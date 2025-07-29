import { type NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(["superadmin", "admin", "employee"]);

    const requestId = Number.parseInt(params.id);
    if (isNaN(requestId)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    const result = await prisma.leaveRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching leave request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
