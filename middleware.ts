import { type NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/auth"

const publicRoutes = ["/login"]
const adminRoutes = ["/admin"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

  // Get session token
  const token = request.cookies.get("session")?.value

  // Redirect to login if no token and not on public route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.nextUrl))
  }

  // If token exists, verify it
  if (token) {
    const user = await decrypt(token)

    if (!user) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL("/login", request.nextUrl))
      response.cookies.delete("session")
      return response
    }

    // Check admin routes
    if (isAdminRoute && user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
    }

    // Redirect authenticated users away from login
    if (path === "/login") {
      const redirectUrl = user.role === "admin" ? "/admin/dashboard" : "/dashboard"
      return NextResponse.redirect(new URL(redirectUrl, request.nextUrl))
    }

    // Redirect to appropriate dashboard from root
    if (path === "/") {
      const redirectUrl = user.role === "admin" ? "/admin/dashboard" : "/dashboard"
      return NextResponse.redirect(new URL(redirectUrl, request.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
