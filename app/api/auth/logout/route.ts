import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Handle POST method
export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.set("session", "", {
      expires: new Date(0),
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json({ message: "Logout berhasil" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
