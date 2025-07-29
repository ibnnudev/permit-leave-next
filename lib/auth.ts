import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.JWT_SECRET || "your-secret-key"
const key = new TextEncoder().encode(secretKey)

export interface User {
  id: number
  email: string
  role: "admin" | "employee"
}

export async function encrypt(payload: User) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    return payload as User
  } catch (error) {
    return null
  }
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  return await decrypt(token)
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "admin") {
    throw new Error("Admin access required")
  }
  return user
}
