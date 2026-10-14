import { NextRequest } from "next/server";
import { getCartSessionId } from "@/lib/cart/session";
import { getOrCreateCart, clearCart } from "@/lib/services/cart";
import { createOrder } from "@/lib/services/orders";
import { checkoutSchema } from "@/lib/validation/checkout";
import { ok, withErrorHandling } from "@/lib/api/response";
import { sendEmail, orderConfirmationEmail } from "@/lib/email/send";
import { formatPrice } from "@/lib/utils/format";
import { siteConfig } from "@/lib/config/site";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = checkoutSchema.parse(await request.json());

  const order = await createOrder(
    {
      customer: body.customer,
      shipping: body.shipping,
      items: body.items,
      paymentProvider: body.paymentProvider,
      promoCode: body.promoCode || null,
    },
    { siteUrl: siteConfig.url },
  );

  // The basket has now become an order — clear the guest cart.
  const sessionId = await getCartSessionId(false);
  if (sessionId) {
    const cart = await getOrCreateCart(sessionId);
    await clearCart(cart.id);
  }

  void sendEmail({
    to: order.email,
    subject: `Your Minimates order ${order.orderNumber}`,
    text: `Thank you! Your order ${order.orderNumber} has been placed. Total: ${formatPrice(order.total)}.`,
    html: orderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: body.customer.fullName,
      total: formatPrice(order.total),
    }),
  }).catch(() => undefined);

  return ok({
    orderNumber: order.orderNumber,
    total: order.total,
    payment: order.payment,
  });
});