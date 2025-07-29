import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getUserByEmail, getUserById } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: number
  lembaga_id?: number
  nama: string
  email: string
  role: "superadmin" | "admin" | "karyawan"
  jabatan?: string
  lembaga_nama?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      lembaga_id: user.lembaga_id,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    const user = await getUserById(decoded.id)
    if (!user) {
      return null
    }

    return {
      id: user.id,
      lembaga_id: user.lembaga_id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      jabatan: user.jabatan,
      lembaga_nama: user.lembaga_nama,
    }
  } catch (error) {
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireSuperAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "superadmin") {
    redirect("/dashboard")
  }
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "admin" && user.role !== "superadmin") {
    redirect("/dashboard")
  }
  return user
}

export async function requireEmployee(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "karyawan") {
    redirect("/admin/dashboard")
  }
  return user
}

export async function login(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)
  if (!user) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    return null
  }

  return {
    id: user.id,
    lembaga_id: user.lembaga_id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    jabatan: user.jabatan,
    lembaga_nama: user.lembaga_nama,
  }
}
