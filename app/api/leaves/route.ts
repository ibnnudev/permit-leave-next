// app/api/leaves/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole, requireRoleForApi } from "@/lib/auth";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { buildApiQuery } from "@/lib/queryBuilder";
import { formatApiResponse, handleError } from "@/lib/formatApiRes";
import { Role } from "@prisma/client";
import { leaveformSchema } from "@/lib/validations/leaves";

export async function GET(req: NextRequest) {
  try {
    await requireRoleForApi(req, [Role.SUPERADMIN, Role.ADMIN, Role.EMPLOYEE]);
    const { filter, page, limit, search, order_by, sorted_by, withParams } =
      parseQueryParams(req.url);
    const totalItems = await prisma.leave.count();
    const paginationParams = { page, limit };

    const query = buildApiQuery({
      filter,
      search,
      order_by,
      sorted_by,
      pagination: paginationParams,
      with: withParams,
    });

    const leaves = await prisma.leave.findMany(query as any);
    const pagination = {
      total: totalItems,
      per_page: limit,
      current_page: page,
      last_page: Math.ceil(totalItems / limit),
    };
    const response = formatApiResponse(leaves, pagination);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRoleForApi(req, [Role.SUPERADMIN, Role.ADMIN, Role.EMPLOYEE]);
    const body = await req.json();
    const validatedData = leaveformSchema.parse(body);

    const leave = await prisma.leave.create({
      data: validatedData,
    });

    const response = formatApiResponse(
      leave,
      undefined,
      true,
      "Leave created successfully"
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
