import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/session";
import { categorySchema } from "@/lib/validation/category";
import { createCategory, getCategories } from "@/lib/services/categories";

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  return ok(await getCategories(true));
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  await requireAdmin();
  const body = categorySchema.parse(await request.json());
  const category = await createCategory(body);
  return ok(category, 201);
});