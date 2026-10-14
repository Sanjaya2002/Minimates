import { ok, withErrorHandling } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/session";

export const GET = withErrorHandling(async () => {
  const session = await requireAdmin();
  return ok(session);
});