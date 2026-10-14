import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/session";
import { productCreateSchema } from "@/lib/validation/product";
import { createProduct, getAdminProducts } from "@/lib/services/products";

function parseFilters(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return {
    search: searchParams.get("q") ?? undefined,
    categoryId: searchParams.get("category") ?? undefined,
    stockFilter:
      (searchParams.get("stock") as "in" | "low" | "out" | null) ?? undefined,
    status: (searchParams.get("status") as "active" | "inactive" | null) ?? undefined,
    page: Number(searchParams.get("page") ?? 1) || 1,
    perPage: Number(searchParams.get("perPage") ?? 20),
  };
}

export const GET = withErrorHandling(async (request: NextRequest) => {
  await requireAdmin();
  const result = await getAdminProducts(parseFilters(request));
  return ok(result);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  await requireAdmin();
  const body = productCreateSchema.parse(await request.json());
  const product = await createProduct(body);
  return ok(product, 201);
});