import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

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
        const user = await prisma.employee.findFirst({
            where: { personal_email: email },
            include: { institution: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Email atau password salah." },
                { status: 401 }
            );
        }

        // Cek password
        const isValidPassword = await bcrypt.compare(password, user.password);
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

        // Tentukan redirect berdasarkan Role
        let redirectUrl = "";
        if (user.role === Role.SUPERADMIN) {
            redirectUrl = "/admin/superadmin";
        } else if (user.role === Role.ADMIN) {
            redirectUrl = "/admin/dashboard";
        } else if (user.role === Role.EMPLOYEE) {
            redirectUrl = "/admin/employee";
        }

        // Hapus field sensitif sebelum dikirim ke client
        const { password: _password, ...userSafe } = user;

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
