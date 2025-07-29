import { type NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { updateLeaveRequestStatus } from "@/lib/db";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
export async function PATCH(
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

    const { status, admin_comments } = await request.json();

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedRequest = await prisma.leaveRequest.update({
      data: {
        status,
        user_id: user.id,
        review_notes: admin_comments,
        updated_at: new Date(),
      },
      where: {
        id: requestId,
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating leave request status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
