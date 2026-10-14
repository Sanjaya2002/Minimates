import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/session";
import { categoryUpdateSchema } from "@/lib/validation/category";
import { updateCategory, deleteCategory } from "@/lib/services/categories";

type Params = Promise<{ id: string }>;

export const PATCH = withErrorHandling(async (request: NextRequest, context: { params: Params }) => {
  await requireAdmin();
  const { id } = await context.params;
  const body = categoryUpdateSchema.parse(await request.json());
  const category = await updateCategory(id, body);
  return ok(category);
});

export const DELETE = withErrorHandling(async (_request: NextRequest, context: { params: Params }) => {
  await requireAdmin();
  const { id } = await context.params;
  await deleteCategory(id);
  return ok({ deleted: true });
});