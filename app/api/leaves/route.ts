// app/api/leaves/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireRole, requireRoleForApi } from "@/lib/auth";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { buildApiQuery } from "@/lib/queryBuilder";
import { formatApiResponse, handleError } from "@/lib/formatApiRes";
import { Role } from "@prisma/client";

export const leaveformSchema = z.object({
  employee_id: z.number().int().min(1, "Employee ID harus diisi"),
  leave_type_id: z.number().int().min(1, "Leave type harus diisi"),
  start_date: z.coerce.date({
    error: "Tanggal mulai tidak valid",
  }),
  end_date: z.coerce.date({ error: "Tanggal akhir tidak valid" }),
  reason: z.string().min(1, "Alasan cuti harus diisi"),
  last_processed_level: z
    .number()
    .int()
    .min(0, "Level terakhir proses harus diisi"),

  // Optional fields
  admin_notes: z.string().optional(),
  recorded_by: z.string().optional(),
  approved_by_id: z.number().int().optional(),
  document: z.string().optional(),

  // Optional input (bisa diisi atau pakai default)
  status: z.enum(["IN_PROCESS", "APPROVED", "REJECTED"]).optional(),
});

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
