import { ok, withErrorHandling } from "@/lib/api/response";
import { getAvailableProviders } from "@/lib/payments/paymentService";

export const GET = withErrorHandling(async () => {
  return ok(getAvailableProviders());
});