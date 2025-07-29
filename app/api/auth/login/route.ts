import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.pegawai.findFirst({
      where: { email_pribadi: email },
      include: { lembaga: true },
    });

    console.log("User found:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.kata_sandi);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({
      id: user.id,
      email: user.email_pribadi,
      name: user.nama,
      role: user.peran.toLowerCase(),
      department: user.jabatan,
      lembagaId: user.lembaga_id,
      lembagaName: user.lembaga?.nama || null,
      lembagaAddress: user.lembaga?.alamat || null,
      lembagaPhone: user.lembaga?.telepon || null,
      expires: expires,
    });

    // Set cookie
    cookies().set("session", session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // Determine redirect URL based on role
    let redirectUrl = "/dashboard";
    if (user.role === "superadmin" || user.role === "admin") {
      redirectUrl = "/admin/dashboard";
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      redirectUrl,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
