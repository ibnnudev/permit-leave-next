import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();
export async function GET() {
  try {
    await requireRole(["superadmin", "admin", "employee"]);
    const jenisCutiList = await prisma.jenisCuti.findMany();
    return NextResponse.json(jenisCutiList);
  } catch (error) {
    console.error("Error fetching jenis cuti:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
