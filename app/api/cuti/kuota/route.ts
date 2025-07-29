import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const kuotaList = await prisma.kuotaCuti.findMany({
      include: {
        user: true,
      },
    });
    return NextResponse.json(kuotaList);
  } catch (error) {
    console.error("Error fetching kuota:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
