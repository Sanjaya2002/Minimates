import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/lib/services/orders";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDateTime, toNumber } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  province?: string | null;
  country?: string;
}

const paymentTones: Record<string, "lime" | "sunshine" | "red" | "neutral"> = {
  PAID: "lime",
  PENDING: "sunshine",
  FAILED: "red",
  REFUNDED: "neutral",
};

const fulfillmentTones: Record<string, "sky" | "pink" | "sunshine" | "lime" | "neutral" | "red"> = {
  PROCESSING: "sky",
  CONFIRMED: "pink",
  SHIPPED: "sunshine",
  DELIVERED: "lime",
  CANCELLED: "red",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const shippingAddress = (order.shippingAddress ?? {}) as unknown as ShippingAddress;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="mb-1 inline-flex items-center gap-1 text-sm font-semibold text-playful-pink hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All orders
          </Link>
          <h1 className="font-heading text-2xl font-extrabold text-ink">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-ink-soft">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <Badge tone={paymentTones[order.paymentStatus] ?? "neutral"}>
            {order.paymentStatus}
          </Badge>
          <Badge tone={fulfillmentTones[order.status] ?? "neutral"}>
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
            <h2 className="mb-4 font-heading text-base font-bold text-ink">Items</h2>
            <ul className="divide-y divide-ink/5">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                    {item.productImage && (
                      <Image src={item.productImage} alt="" fill sizes="56px" className="object-cover" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{item.productName}</span>
                    <span className="text-xs text-ink-soft">
                      {item.variantLabel ? `${item.variantLabel} · ` : ""}x{item.quantity}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-ink">
                    {formatPrice(toNumber(item.unitPrice) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              {toNumber(order.discount) > 0 && (
                <div className="flex justify-between text-lime-green">
                  <span>Discount{order.promoCode ? ` (${order.promoCode})` : ""}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base font-extrabold text-ink">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-heading text-base font-bold text-ink">Customer</h2>
            <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <span className="text-ink-soft">Name</span>
              <span className="font-semibold text-ink">{order.customerName}</span>
              <span className="text-ink-soft">Email</span>
              <a className="font-semibold text-playful-pink hover:underline" href={`mailto:${order.customerEmail}`}>
                {order.customerEmail}
              </a>
              <span className="text-ink-soft">Phone</span>
              <span className="font-semibold text-ink">{order.customerPhone}</span>
            </div>
          </section>

          <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
            <h2 className="mb-3 font-heading text-base font-bold text-ink">Shipping to</h2>
            <p className="text-sm leading-relaxed text-ink">
              {shippingAddress.address}
              <br />
              {shippingAddress.city} {shippingAddress.postalCode}
              <br />
              {[shippingAddress.province, shippingAddress.country].filter(Boolean).join(", ")}
            </p>
            {order.notes && (
              <p className="mt-3 rounded-2xl bg-cream p-3 text-sm text-ink-soft">
                <span className="font-semibold text-ink">Order notes:</span> {order.notes}
              </p>
            )}
            {order.paymentReference && (
              <p className="mt-3 text-xs text-ink-soft">
                Payment reference: <span className="font-mono">{order.paymentReference}</span>
                {order.paidAt ? ` · paid ${formatDateTime(order.paidAt)}` : ""}
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-ink/8 bg-white p-6 shadow-soft lg:sticky lg:top-6">
          <h2 className="mb-4 font-heading text-base font-bold text-ink">Manage order</h2>
          <OrderStatusUpdater
            orderId={order.id}
            status={order.status}
            paymentStatus={order.paymentStatus}
          />
        </aside>
      </div>
    </div>
  );
}