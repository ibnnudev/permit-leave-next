import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole, requireRoleForApi } from "@/lib/auth";
import { formatApiResponse, handleError } from "@/lib/formatApiRes";
import { institutionformSchema } from "../../institutions/route";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRoleForApi(req, ["SUPERADMIN"]);
    const { id } = params;
    const institution = await prisma.institution.delete({
      where: { id: Number(id) },
    });
    const response = formatApiResponse(institution);
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
    await requireRoleForApi(req, ["SUPERADMIN"]);
    const id = Number(params.id);
    const body = await req.json();
    const validatedData = institutionformSchema.partial().parse(body);
    const updateInstitution = await prisma.institution.update({
      where: { id: id! },
      data: validatedData,
    });
    const response = formatApiResponse(updateInstitution);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
}
