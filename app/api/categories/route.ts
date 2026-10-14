import { ok, withErrorHandling } from "@/lib/api/response";
import { getCategories } from "@/lib/services/categories";

export const GET = withErrorHandling(async () => {
  const categories = await getCategories(true);
  return ok(categories);
});