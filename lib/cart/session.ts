import { cookies } from "next/headers";
import { generateSessionId } from "@/lib/utils/slug";

export const CART_COOKIE = "minimates_cart";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Read the guest cart session id. When `create` is true a new secure session
 * is created and written to an httpOnly cookie (Route Handlers only).
 */
export async function getCartSessionId(create = false): Promise<string | null> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) return existing;
  if (!create) return null;

  const sessionId = generateSessionId();
  store.set(CART_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return sessionId;
}
