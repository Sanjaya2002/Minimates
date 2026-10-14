import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api/response";
import { getProducts } from "@/lib/services/products";
import { PRODUCTS_PER_PAGE } from "@/lib/utils/constants";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const result = await getProducts({
    search: searchParams.get("q") ?? undefined,
    categorySlug: searchParams.get("category") ?? undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    ageGroup: searchParams.get("age") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    page: Number(searchParams.get("page") ?? 1) || 1,
    perPage: Number(searchParams.get("perPage") ?? PRODUCTS_PER_PAGE),
    featuredOnly: searchParams.get("featured") === "1",
    newOnly: searchParams.get("new") === "1",
  });

  return ok(result);
});