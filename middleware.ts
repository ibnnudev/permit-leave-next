// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/login"];
const adminRoutes = ["/admin"];

// JWT verification for Edge Runtime
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const secret = new TextEncoder().encode(JWT_SECRET);

async function verifyTokenEdge(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  const token = request.cookies.get("auth-token")?.value;

  // Redirect to login if unauthenticated and not in public route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (token) {
    const user = await verifyTokenEdge(token);

    if (!user) {
      const response = NextResponse.redirect(
        new URL("/login", request.nextUrl)
      );
      response.cookies.delete("auth-token");
      return response;
    }

    // Role-based access
    if (isAdminRoute && user.role !== "admin" && user.role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }

    // Redirect authenticated user away from login
    if (path === "/login") {
      const redirectPath =
        user.role === "admin" || user.role === "superadmin"
          ? "/admin/dashboard"
          : "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.nextUrl));
    }

    // If accessing "/", redirect to dashboard
    if (path === "/") {
      const redirectPath =
        user.role === "admin" || user.role === "superadmin"
          ? "/admin/dashboard"
          : "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
