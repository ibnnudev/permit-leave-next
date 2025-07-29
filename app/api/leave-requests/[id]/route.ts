import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()

    const requestId = Number.parseInt(params.id)
    if (isNaN(requestId)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 })
    }

    const result = await sql`
      SELECT lr.*, 
             CONCAT(e.first_name, ' ', e.last_name) as employee_name,
             lt.name as leave_type_name
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      JOIN leave_types lt ON lr.leave_type_id = lt.id
      WHERE lr.id = ${requestId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching leave request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
