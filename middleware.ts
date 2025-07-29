import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

// Routes
const protectedRoutes = ["/dashboard", "/admin", "/leave-requests", "/cuti"];
const adminRoutes = ["/admin"];
const publicRoutes = ["/login", "/"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.includes(pathname);

  const cookie = req.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // Unauthenticated access to protected route
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Authenticated user accessing /login
  if (pathname === "/login" && session) {
    const role = session.user?.role;
    const redirectPath =
      role === "admin" || role === "superadmin"
        ? "/admin/dashboard"
        : "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, req.nextUrl));
  }

  // Prevent non-admin users from accessing admin routes
  if (isAdmin && session) {
    const role = session.user?.role;
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  // Authenticated access to "/" → redirect to proper dashboard
  if (pathname === "/" && session) {
    const role = session.user?.role;
    const redirectPath =
      role === "admin" || role === "superadmin"
        ? "/admin/dashboard"
        : "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)"],
};
