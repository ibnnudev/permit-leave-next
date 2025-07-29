import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { getUserById } from "./db"

const secretKey = process.env.JWT_SECRET || "fallback-secret-key"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

export async function login(formData: FormData) {
  // Verify credentials and get the user
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // This would typically verify against your database
  // For now, we'll assume verification is done elsewhere

  const user = { id: 1, email, role: "admin" } // Replace with actual user data

  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  const session = await encrypt({ user, expires })

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true })
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) })
}

export async function getSession() {
  const session = cookies().get("session")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function getCurrentUser() {
  try {
    const session = await getSession()
    if (!session?.user?.id) return null

    const user = await getUserById(session.user.id)
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function updateSession(request: Request) {
  const session = request.headers.get("cookie")?.includes("session")
  if (!session) return

  // Refresh the session so it doesn't expire
  const parsed = await getSession()
  if (parsed) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const newSession = await encrypt({ ...parsed, expires })

    const response = new Response()
    response.headers.set("Set-Cookie", `session=${newSession}; expires=${expires.toUTCString()}; httpOnly=true; path=/`)
    return response
  }
}
