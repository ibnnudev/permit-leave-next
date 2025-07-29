import { NextResponse } from "next/server"
import { getLeaveTypes } from "@/lib/db"

export async function GET() {
  try {
    const leaveTypes = await getLeaveTypes()
    return NextResponse.json(leaveTypes)
  } catch (error) {
    console.error("Error fetching leave types:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
