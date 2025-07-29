import { type NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { createLeaveRequest, getLeaveRequests } from "@/lib/db";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();
export async function GET() {
  try {
    const user = await requireRole(["superadmin", "admin", "employee"]);

    if (user.role === "admin") {
      const requests = await prisma.leaveRequest.findMany();
      return NextResponse.json(requests);
    } else {
      const employee = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
      if (!employee) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }
      const requests = await getLeaveRequests(employee.id);
      return NextResponse.json(requests);
    }
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(["superadmin", "admin", "employee"]);

    if (user.role !== "employee") {
      return NextResponse.json(
        { error: "Only employees can create leave requests" },
        { status: 403 }
      );
    }

    const employee = await prisma.user.findUnique(user.id);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { leave_type_id, start_date, end_date, days_requested, reason } =
      data;

    if (
      !leave_type_id ||
      !start_date ||
      !end_date ||
      !days_requested ||
      !reason
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const leaveRequest = await createLeaveRequest({
      user_id: employee.id,
      jenis_cuti_id: leave_type_id,
      start_date,
      end_date,
      total_days: days_requested,
      reason,
    });

    return NextResponse.json(leaveRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating leave request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
