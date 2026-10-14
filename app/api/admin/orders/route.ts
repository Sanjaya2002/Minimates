import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/session";
import { listOrders } from "@/lib/services/orders";

function parseFilters(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return {
    search: searchParams.get("q") ?? undefined,
    paymentStatus: searchParams.get("paymentStatus") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    page: Number(searchParams.get("page") ?? 1) || 1,
    perPage: Number(searchParams.get("perPage") ?? 20),
  };
}

export const GET = withErrorHandling(async (request: NextRequest) => {
  await requireAdmin();
  const result = await listOrders(parseFilters(request));
  return ok(result);
});