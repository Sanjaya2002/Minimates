import { NextRequest } from "next/server";
import { createSessionToken, sessionCookieOptions, ADMIN_COOKIE } from "@/lib/auth/session";
import { authenticateAdmin } from "@/lib/services/auth";
import { loginSchema } from "@/lib/validation/auth";
import { ok, fail, handleApiError } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    const session = await authenticateAdmin(body.email, body.password);

    if (!session) {
      return fail("Invalid email or password", 401);
    }

    const token = await createSessionToken(session);
    const response = ok({ name: session.name, email: session.email });
    response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}