"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CalendarDays, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { formatPrice, formatDateTime } from "@/lib/utils/format";
import { PAYMENT_STATUS_LABELS, FULFILLMENT_STATUS_LABELS } from "@/lib/utils/constants";

interface OrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: unknown;
  paymentStatus: string;
  status: string;
  createdAt: string;
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

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = useCallback(async () => {
    setError(false);
    const params = new URLSearchParams({ page: String(page), perPage: "20" });
    if (search.trim()) params.set("q", search.trim());
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    if (status) params.set("status", status);
    try {
      const response = await fetch(`/api/admin/orders?${params}`, { cache: "no-store" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error);
      setOrders(json.data.items);
      setPages(json.data.totalPages);
    } catch (error) {
      setError(true);
      toast(error instanceof Error ? error.message : "Failed to load orders", "error");
    }
  }, [search, paymentStatus, status, page, toast]);

  useEffect(() => {
    setPage(1);
  }, [search, paymentStatus, status]);

  useEffect(() => {
    load();
  }, [load, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-ink">Orders</h1>
        <p className="text-sm text-ink-soft">
          {orders ? `${orders.length} orders on this page` : "Loading orders…"}
        </p>
      </div>

      <div className="grid gap-3 rounded-3xl border border-ink/8 bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Search order, name or email…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value)}
        >
          <option value="">All payments</option>
          {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All fulfilment</option>
          {Object.entries(FULFILLMENT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <div className="flex items-end pb-1 text-sm text-ink-soft">
          <CalendarDays className="mr-1.5 h-4 w-4" /> Search within all dates
        </div>
      </div>

      {error && (
        <p className="rounded-3xl bg-red-50 p-6 text-sm font-semibold text-red-500">
          Could not load orders.
        </p>
      )}

      {!orders && !error ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16" />
          ))}
        </div>
      ) : orders && orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink/15 bg-white p-12 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-ink-soft" />
          <p className="mt-3 font-heading font-bold text-ink">No orders found</p>
          <p className="mt-1 text-sm text-ink-soft">Try different filters.</p>
        </div>
      ) : orders ? (
        <>
          <div className="-mx-4 overflow-x-auto px-4">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-soft">
                  <th className="py-2 pr-4 font-semibold">Order</th>
                  <th className="py-2 pr-4 font-semibold">Customer</th>
                  <th className="py-2 pr-4 font-semibold">Date</th>
                  <th className="py-2 pr-4 font-semibold">Total</th>
                  <th className="py-2 pr-4 font-semibold">Payment</th>
                  <th className="py-2 font-semibold">Fulfilment</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-ink/5 hover:bg-cream/40">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-playful-pink hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="block font-semibold text-ink">{order.customerName}</span>
                      <span className="text-xs text-ink-soft">{order.customerEmail}</span>
                    </td>
                    <td className="py-3 pr-4 text-ink-soft">{formatDateTime(order.createdAt)}</td>
                    <td className="py-3 pr-4 font-semibold text-ink">{formatPrice(order.total)}</td>
                    <td className="py-3 pr-4">
                      <Badge tone={paymentTones[order.paymentStatus] ?? "neutral"}>
                        {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge tone={fulfillmentTones[order.status] ?? "neutral"}>
                        {FULFILLMENT_STATUS_LABELS[order.status] ?? order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                Previous
              </Button>
              <span className="text-sm font-semibold text-ink-soft">
                Page {page} of {pages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}