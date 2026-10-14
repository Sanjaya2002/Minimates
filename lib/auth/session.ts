import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import {
  ADMIN_COOKIE,
  verifySessionToken,
  type AdminSession,
} from "@/lib/auth/jwt";

export { ADMIN_COOKIE, sessionCookieOptions, createSessionToken } from "@/lib/auth/jwt";
export type { AdminSession } from "@/lib/auth/jwt";

/** Read and verify the admin session from cookies (Node runtime only). */
export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Require an authenticated admin. Verifies the JWT *and* re-checks the
 * admin flag against the database so privileges can be revoked.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  const user = await prisma.adminUser.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, fullName: true, isAdmin: true },
  });

  if (!user) throw new UnauthorizedError();
  if (!user.isAdmin) throw new ForbiddenError();

  return { id: user.id, email: user.email, name: user.fullName };
}