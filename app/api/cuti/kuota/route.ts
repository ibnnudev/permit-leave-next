import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { getCutiKuotaByUser } from "@/lib/db"

export async function GET() {
  try {
    const user = await requireAuth()
    const kuotaList = await getCutiKuotaByUser(user.id)
    return NextResponse.json(kuotaList)
  } catch (error) {
    console.error("Error fetching kuota:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
