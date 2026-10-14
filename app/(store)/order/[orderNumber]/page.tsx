import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, MessageCircle, PackageCheck, Truck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Badge } from "@/components/ui/Badge";
import { getOrderByNumber } from "@/lib/services/orders";
import { formatPrice, formatDateTime, toNumber } from "@/lib/utils/format";
import { PAYMENT_STATUS_LABELS, FULFILLMENT_STATUS_LABELS } from "@/lib/utils/constants";
import { whatsappLink } from "@/lib/config/site";

export const dynamic = "force-dynamic";

type Params = Promise<{ orderNumber: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Order ${orderNumber}`, robots: { index: false, follow: false } };
}

export default async function OrderConfirmationPage({ params }: { params: Params }) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber).catch(() => null);
  if (!order) notFound();

  const shippingAddress = order.shippingAddress as Record<string, string>;

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-lime-green/40 bg-lime-green/15 p-6 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-lime-green shadow-soft">
            <PackageCheck className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-extrabold text-ink sm:text-3xl">
            Thank you{order.customerName ? `, ${order.customerName.split(" ")[0]}` : ""}!
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Your order <strong className="text-ink">{order.orderNumber}</strong> has
            been placed successfully.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <Badge tone={order.paymentStatus === "PAID" ? "lime" : "sunshine"}>
              Payment: {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </Badge>
            <Badge tone="sky">
              Status: {FULFILLMENT_STATUS_LABELS[order.status]}
            </Badge>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
          <h2 className="font-heading text-lg font-bold">Order summary</h2>
          <ul className="mt-4 divide-y divide-ink/8">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream">
                  {item.productImage && (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.productName}</p>
                  {item.variantLabel && (
                    <p className="text-xs text-ink-soft">{item.variantLabel}</p>
                  )}
                  <p className="text-xs text-ink-soft">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-bold">
                  {formatPrice(toNumber(item.unitPrice) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-2 space-y-2.5 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd>{toNumber(order.shipping) === 0 ? "Free" : formatPrice(order.shipping)}</dd>
            </div>
            {toNumber(order.discount) > 0 && (
              <div className="flex justify-between text-lime-green-700">
                <dt>Discount</dt>
                <dd>−{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-ink/10 pt-3 font-heading text-base font-extrabold">
              <dt>Total</dt>
              <dd className="text-playful-pink">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
              <Truck className="h-5 w-5 text-sky-blue" /> Delivery details
            </h2>
            <dl className="mt-4 space-y-2 text-sm text-ink-soft">
              <p className="font-semibold text-ink">{order.customerName}</p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}{shippingAddress.province ? `, ${shippingAddress.province}` : ""}{" "}
                {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
              {order.notes && <p className="italic">Note: {order.notes}</p>}
            </dl>
          </div>

          <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
              <CheckCircle2 className="h-5 w-5 text-playful-pink" /> What happens next?
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              {order.paymentStatus === "PAID"
                ? "Your payment has been received. We'll prepare and dispatch your order, and notify you by email."
                : order.paymentStatus === "FAILED"
                  ? "Your payment failed. Please contact us to complete your order."
                  : "Once we confirm your payment, we'll prepare and dispatch your order."}
            </p>
            <p className="mt-2 text-xs text-ink-soft">
              Placed on {formatDateTime(order.createdAt)} via {order.paymentProvider}.
            </p>
            <a
              href={whatsappLink(`Hi Minimates! I have a question about my order ${order.orderNumber}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}
            >
              <MessageCircle className="h-4 w-4" /> Help with my order
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/shop" className={buttonVariants({ variant: "secondary" })}>
            Continue shopping
          </Link>
        </div>
      </div>
    </Container>
  );
}