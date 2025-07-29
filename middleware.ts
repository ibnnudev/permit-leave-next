import { type NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/auth"

// Define protected routes
const protectedRoutes = ["/dashboard", "/admin", "/leave-requests", "/cuti"]
const adminRoutes = ["/admin"]
const publicRoutes = ["/login", "/"]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  // Get the session from the cookie
  const cookie = req.cookies.get("session")?.value
  const session = await decrypt(cookie)

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  // Redirect to dashboard if accessing login with valid session
  if (path === "/login" && session) {
    const user = session.user
    if (user.role === "superadmin" || user.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl))
    }
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  // Check admin access
  if (isAdminRoute && session) {
    const user = session.user
    if (user.role !== "superadmin" && user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    }
  }

  // Redirect root to appropriate dashboard
  if (path === "/" && session) {
    const user = session.user
    if (user.role === "superadmin" || user.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl))
    }
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
