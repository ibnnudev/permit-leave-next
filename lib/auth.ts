// auth.ts

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "./db";

// ENV Config
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const secret = new TextEncoder().encode(JWT_SECRET);

// Types
export interface User {
  id: number;
  lembaga_id?: number;
  nama: string;
  email: string;
  role: "superadmin" | "admin" | "karyawan";
  jabatan?: string;
  lembaga_nama?: string;
}

// Password utils
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

// Token utils - These work in both Node.js and Edge Runtime
export async function generateToken(user: User): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    lembaga_id: user.lembaga_id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// Auth utils - These require Node.js runtime (for database access)
function mapUser(user: any): User {
  return {
    id: user.id,
    lembaga_id: user.lembaga_id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    jabatan: user.jabatan,
    lembaga_nama: user.lembaga_nama,
  };
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = cookies().get("auth-token")?.value;
    if (!token) return null;

    const decoded = await verifyToken(token);
    if (!decoded?.id) return null;

    const user = await getUserById(decoded.id);
    return user ? mapUser(user) : null;
  } catch {
    return null;
  }
}

// Middleware guards - These require Node.js runtime
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireSuperAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "superadmin") redirect("/dashboard");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (!["admin", "superadmin"].includes(user.role)) {
    redirect("/dashboard");
  }
  return user;
}

export async function requireEmployee(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "karyawan") redirect("/admin/dashboard");
  return user;
}

// Login logic - Requires Node.js runtime
export async function login(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  return isValid ? mapUser(user) : null;
}
