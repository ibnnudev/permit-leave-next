import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRoleForApi } from "@/lib/auth";
import { formatApiResponse, handleError } from "@/lib/formatApiRes";
import { leaveformSchema } from "../route";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { Role } from "@prisma/client";
import { buildApiQuery } from "@/lib/queryBuilder";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRoleForApi(req, [Role.SUPERADMIN, Role.ADMIN, Role.EMPLOYEE]);
    const { filter, search, withParams } = parseQueryParams(req.url);

    const query = buildApiQuery({
      filter,
      search,
      with: withParams,
    });
    const leave = await prisma.leave.findUnique({
      where: { id: Number(params.id)! },
      include: query.include,
    } as any);
    const response = formatApiResponse(leave);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRoleForApi(req, [Role.SUPERADMIN]);
    const leave = await prisma.leave.delete({
      where: { id: Number(params.id) },
    });
    const response = formatApiResponse(leave);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRoleForApi(req, [Role.SUPERADMIN, Role.ADMIN]);
    const body = await req.json();
    const validatedData = leaveformSchema.partial().parse(body);
    const updateleave = await prisma.leave.update({
      where: { id: Number(params.id) },
      data: validatedData,
    });
    const response = formatApiResponse(updateleave);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
