import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "./prisma";
import { NextRequest } from "next/server";

const secretKey = process.env.JWT_SECRET || "fallback-secret-key";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const user = { id: 1, email, role: "admin" };

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ user, expires });

  cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Clear the session cookie
  cookies().set("session", "", { expires: new Date(0), httpOnly: true });
  return { message: "Logged out successfully" };
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.id) return null;
    const user = await prisma.employee.findFirst({
      where: { id: session.user.id },
      include: { institution: true },
    });
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function updateSession(request: Request) {
  const session = request.headers.get("cookie")?.includes("session");
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await getSession();
  if (parsed) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newSession = await encrypt({ ...parsed, expires });

    const response = new Response();
    response.headers.set(
      "Set-Cookie",
      `session=${newSession}; expires=${expires.toUTCString()}; httpOnly=true; path=/`
    );
    return response;
  }
}

export async function requireRole(allowedRoles: string[]) {
  const user = await getCurrentUser();
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("Unauthorized");
  }
  return user;
}
export async function requireRoleForApi(
  req: NextRequest,
  allowedRoles: string[]
) {
  // Coba ambil token dari header Authorization
  let token = req.headers.get("Authorization")?.replace("Bearer ", "");

  // Jika token tidak ada di header, coba ambil dari cookie "session"
  if (!token) {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      })
    );
    token = cookies.session;
  }

  if (!token) throw new Error("No token provided");

  const userPayload = await decrypt(token);
  const role = userPayload?.user?.role;
  if (!role || !allowedRoles.includes(role)) {
    throw new Error("You are not authorized");
  }

  return userPayload;
}
