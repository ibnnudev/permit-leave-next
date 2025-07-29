import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { createLeaveRequest, getEmployeeByUserId, getLeaveRequests } from "@/lib/db"

export async function GET() {
  try {
    const user = await requireAuth()

    if (user.role === "admin") {
      const requests = await getLeaveRequests()
      return NextResponse.json(requests)
    } else {
      const employee = await getEmployeeByUserId(user.id)
      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 })
      }
      const requests = await getLeaveRequests(employee.id)
      return NextResponse.json(requests)
    }
  } catch (error) {
    console.error("Error fetching leave requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()

    if (user.role !== "employee") {
      return NextResponse.json({ error: "Only employees can create leave requests" }, { status: 403 })
    }

    const employee = await getEmployeeByUserId(user.id)
    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    const data = await request.json()
    const { leave_type_id, start_date, end_date, days_requested, reason } = data

    if (!leave_type_id || !start_date || !end_date || !days_requested || !reason) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const leaveRequest = await createLeaveRequest({
      employee_id: employee.id,
      leave_type_id,
      start_date,
      end_date,
      days_requested,
      reason,
    })

    return NextResponse.json(leaveRequest, { status: 201 })
  } catch (error) {
    console.error("Error creating leave request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
