import { ok, withErrorHandling } from "@/lib/api/response";
import { getProducts } from "@/lib/services/products";

export const GET = withErrorHandling(async () => {
  const result = await getProducts({ perPage: 100, sort: "newest" });
  return ok(result.items);
});