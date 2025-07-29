import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/auth"
import sql from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const users = await sql`
      SELECT id, email, password_hash, role 
      FROM users 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // For demo purposes, we'll use simple password comparison
    // In production, use proper bcrypt comparison
    const isValidPassword =
      (password === "admin123" && email === "admin@company.com") ||
      (password === "password123" && email.includes("@company.com"))

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session token
    const token = await encrypt({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
