import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { Peran, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Ambil user berdasarkan email
    const user = await prisma.pegawai.findFirst({
      where: { email_pribadi: email },
      include: { lembaga: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      );
    }

    // Cek password
    const isValidPassword = await bcrypt.compare(password, user.kata_sandi);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      );
    }

    // Buat session dan cookie
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam
    const session = await encrypt({ user, expires });

    cookies().set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires,
    });

    // Tentukan redirect berdasarkan peran
    let redirectUrl = "/dashboard";
    if (user.peran === Peran.SUPERADMIN || user.peran === Peran.ADMIN) {
      redirectUrl = "/admin/dashboard";
    }

    // Hapus field sensitif sebelum dikirim ke client
    const { kata_sandi, ...userSafe } = user;

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      redirectUrl,
      user: userSafe,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
