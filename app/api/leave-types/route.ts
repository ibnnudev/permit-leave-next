// app/api/leaveTypes/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireRole, requireRoleForApi } from "@/lib/auth";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { buildApiQuery } from "@/lib/queryBuilder";
import { formatApiResponse, handleError } from "@/lib/formatApiRes";
import { Role } from "@prisma/client";
import { leaveTypeFormSchema } from "@/lib/validations/leave-types";

export async function GET(req: NextRequest) {
  try {
    await requireRoleForApi(req, [Role.SUPERADMIN, Role.ADMIN, Role.EMPLOYEE]);
    const { filter, page, limit, search, order_by, sorted_by, withParams } =
      parseQueryParams(req.url);
    const paginationParams = { page, limit };

    const query = buildApiQuery({
      filter,
      search,
      order_by,
      sorted_by,
      pagination: paginationParams,
      with: withParams,
    });

    const leaveTypes = await prisma.leaveType.findMany(query as any);

    const response = formatApiResponse(leaveTypes);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRoleForApi(req, [Role.SUPERADMIN, Role.ADMIN]);
    const body = await req.json();
    const validatedData = leaveTypeFormSchema.parse(body);

    const leaveType = await prisma.leaveType.create({
      data: validatedData,
    });

    const response = formatApiResponse(
      leaveType,
      undefined,
      true,
      "leaveType created successfully"
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
