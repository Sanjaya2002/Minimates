import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDateTime } from "@/lib/utils/format";
import { PAYMENT_STATUS_LABELS, FULFILLMENT_STATUS_LABELS } from "@/lib/utils/constants";
import type { Order } from "@prisma/client";

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return <p className="py-8 text-center text-sm text-ink-soft">No orders yet.</p>;
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-2 pr-4 font-semibold">Order</th>
            <th className="py-2 pr-4 font-semibold">Customer</th>
            <th className="py-2 pr-4 font-semibold">Date</th>
            <th className="py-2 pr-4 font-semibold">Total</th>
            <th className="py-2 pr-4 font-semibold">Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-ink/5">
              <td className="py-3 pr-4">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-semibold text-playful-pink hover:underline"
                >
                  {order.orderNumber}
                </Link>
              </td>
              <td className="py-3 pr-4 text-ink-soft">{order.customerName}</td>
              <td className="py-3 pr-4 text-ink-soft">
                {formatDateTime(order.createdAt)}
              </td>
              <td className="py-3 pr-4 font-semibold">{formatPrice(order.total)}</td>
              <td className="py-3 pr-4">
                <Badge tone={order.paymentStatus === "PAID" ? "lime" : "sunshine"}>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OrderStatusSummary({ summary }: { summary: { status: string; count: number }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {summary.map((item) => (
        <span
          key={item.status}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-soft"
        >
          {FULFILLMENT_STATUS_LABELS[item.status] ?? item.status}: {item.count}
        </span>
      ))}
    </div>
  );
}