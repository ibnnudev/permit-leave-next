import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
export async function GET() {
  try {
    const leaveTypes = await prisma.jenisCuti.findMany();
    return NextResponse.json(leaveTypes);
  } catch (error) {
    console.error("Error fetching leave types:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
