import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getAllJenisCuti } from "@/lib/db"

export async function GET() {
  try {
    await requireAuth()
    const jenisCutiList = await getAllJenisCuti()
    return NextResponse.json(jenisCutiList)
  } catch (error) {
    console.error("Error fetching jenis cuti:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
