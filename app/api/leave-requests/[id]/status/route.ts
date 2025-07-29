import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { updateLeaveRequestStatus } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAdmin()

    const requestId = Number.parseInt(params.id)
    if (isNaN(requestId)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 })
    }

    const { status, admin_comments } = await request.json()

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updatedRequest = await updateLeaveRequestStatus(requestId, status, admin_comments, user.id)

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("Error updating leave request status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
