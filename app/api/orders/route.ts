import { NextRequest } from "next/server";
import { getOrderByNumber } from "@/lib/services/orders";
import { ok, withErrorHandling } from "@/lib/api/response";
import { NotFoundError } from "@/lib/errors";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const orderNumber = request.nextUrl.searchParams.get("orderNumber");
  if (!orderNumber) throw new NotFoundError("Missing order number");

  const order = await getOrderByNumber(orderNumber);
  if (!order) throw new NotFoundError("Order not found");

  return ok({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: order.total,
    createdAt: order.createdAt,
  });
});