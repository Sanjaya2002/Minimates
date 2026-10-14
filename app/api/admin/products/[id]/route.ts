import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/session";
import { productUpdateSchema } from "@/lib/validation/product";
import { updateProduct, deleteProduct, getProductById } from "@/lib/services/products";

type Params = Promise<{ id: string }>;

export const GET = withErrorHandling(async (_request: NextRequest, context: { params: Params }) => {
  await requireAdmin();
  const { id } = await context.params;
  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");
  return ok(product);
});

export const PATCH = withErrorHandling(async (request: NextRequest, context: { params: Params }) => {
  await requireAdmin();
  const { id } = await context.params;
  const body = productUpdateSchema.parse(await request.json());
  const product = await updateProduct(id, body);
  return ok(product);
});

export const DELETE = withErrorHandling(async (_request: NextRequest, context: { params: Params }) => {
  await requireAdmin();
  const { id } = await context.params;
  await deleteProduct(id);
  return ok({ deleted: true });
});