import { NextRequest } from "next/server";
import { ok, withErrorHandling } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/session";
import { orderUpdateSchema } from "@/lib/validation/auth";
import { getOrderById, updateOrder } from "@/lib/services/orders";

type Params = Promise<{ id: string }>;

export const GET = withErrorHandling(async (_request: NextRequest, context: { params: Params }) => {
  await requireAdmin();
  const { id } = await context.params;
  const order = await getOrderById(id);
  if (!order) throw new Error("Order not found");
  return ok(order);
});

export const PATCH = withErrorHandling(async (request: NextRequest, context: { params: Params }) => {
  await requireAdmin();
  const { id } = await context.params;
  const body = orderUpdateSchema.parse(await request.json());
  const order = await updateOrder(id, body);
  return ok(order);
});