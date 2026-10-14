import { ADMIN_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { ok } from "@/lib/api/response";

export async function POST() {
  const response = ok({ loggedOut: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    ...sessionCookieOptions,
    maxAge: 0,
  });
  return response;
}