import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import type { AdminSession } from "@/lib/auth/session";

/**
 * Verify admin credentials against the database.
 * Returns a session object only when the user exists AND is an admin.
 */
export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  const user = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user || !user.isAdmin) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, email: user.email, name: user.fullName };
}
