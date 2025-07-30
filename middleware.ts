import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";
import { Peran } from "@prisma/client";

// Route access rules
const routeAccess: Record<string, Peran[]> = {
  "/admin": [Peran.ADMIN, Peran.SUPERADMIN],
  "/admin/dashboard": [Peran.ADMIN, Peran.SUPERADMIN],
  "/dashboard": [Peran.KARYAWAN],
  "/leave-requests": [Peran.KARYAWAN],
  "/cuti": [Peran.KARYAWAN],
};

const publicRoutes = ["/login", "/"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionCookie = req.cookies.get("session")?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
  const role: Peran | null = session?.user?.peran ?? null;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = Object.keys(routeAccess).some((route) =>
    pathname.startsWith(route)
  );

  // ❌ Session invalid (e.g. expired or tampered)
  if (isProtectedRoute && sessionCookie && !session) {
    return clearSessionAndRedirect(req);
  }

  // 🔐 Not logged in but accessing protected route
  if (isProtectedRoute && !session) {
    return redirectToLogin(req);
  }

  // ✅ Logged in but tries to access /login or /
  if ((pathname === "/login" || pathname === "/") && session) {
    const dashboard = isAdmin(role) ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(dashboard, req.nextUrl));
  }

  // 🔒 Role-based access check
  for (const route in routeAccess) {
    if (pathname.startsWith(route)) {
      const allowedRoles = routeAccess[route];
      if (!allowedRoles.includes(role as Peran)) {
        return clearSessionAndRedirect(req);
      }
    }
  }

  return NextResponse.next();
}

// Helpers
function isAdmin(role: Peran | null): boolean {
  return role === Peran.ADMIN || role === Peran.SUPERADMIN;
}

function redirectToLogin(req: NextRequest) {
  return NextResponse.redirect(new URL("/login", req.nextUrl));
}

function clearSessionAndRedirect(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.nextUrl));
  res.cookies.delete("session");
  return res;
}

// Matcher
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:js|css|png|jpg|jpeg|svg|ico|webp|woff2?)$).*)",
  ],
};
