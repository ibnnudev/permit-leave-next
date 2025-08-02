// app/api/institutions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireRole, requireRoleForApi } from "@/lib/auth";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { buildApiQuery } from "@/lib/queryBuilder";
import { formatApiResponse, handleError } from "@/lib/formatApiRes";
import { Role } from "@prisma/client";

export const institutionformSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(8),
});

export async function GET(req: NextRequest) {
  try {
    await requireRoleForApi(req, ["SUPERADMIN"]);
    const {
      filter,
      page,
      limit,
      search,
      order_by,
      sorted_by,
      withParams,
      pagination = true,
    } = parseQueryParams(req.url);

    let institutions;
    let paginationData;

    if (pagination !== false) {
      const totalItems = await prisma.institution.count();
      const paginationParams = { page, limit };

      const query = buildApiQuery({
        filter,
        search,
        order_by,
        sorted_by,
        pagination: paginationParams,
        with: withParams,
      });

      institutions = await prisma.institution.findMany(query as any);
      paginationData = {
        total: totalItems,
        per_page: limit,
        current_page: page,
        last_page: Math.ceil(totalItems / limit),
      };
    } else {
      const query = buildApiQuery({
        filter,
        search,
        order_by,
        sorted_by,
        with: withParams,
      });

      institutions = await prisma.institution.findMany(query as any);
      paginationData = undefined;
    }

    const response = formatApiResponse(institutions, paginationData);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRoleForApi(req, [Role.SUPERADMIN]);
    const body = await req.json();
    const validatedData = institutionformSchema.parse(body);

    const institution = await prisma.institution.create({
      data: validatedData,
    });

    const response = formatApiResponse(
      institution,
      undefined,
      true,
      "Istitution created successfully"
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
