"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { FULFILLMENT_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/utils/constants";

const fulfillmentOrder = ["PROCESSING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderStatusUpdater({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function update(data: { status?: string; paymentStatus?: string }) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error);
      toast("Order updated", "success");
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Update failed", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">
          Fulfilment status
        </p>
        <div className="flex flex-wrap gap-2">
          {fulfillmentOrder.map((value) => (
            <button
              key={value}
              type="button"
              disabled={busy}
              onClick={() => update({ status: value })}
              className={
                status === value
                  ? "rounded-full bg-playful-pink px-3 py-1.5 text-xs font-bold text-white shadow-soft"
                  : "rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-cream"
              }
            >
              {FULFILLMENT_STATUS_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">
          Payment status
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => {
            const disabled = value === "PENDING" || (value === "PAID" && paymentStatus === "PAID");
            return (
              <button
                key={value}
                type="button"
                disabled={busy || disabled}
                onClick={() => update({ paymentStatus: value })}
                className={
                  paymentStatus === value
                    ? "rounded-full bg-playful-pink px-3 py-1.5 text-xs font-bold text-white shadow-soft"
                    : "rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-cream disabled:opacity-40"
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={() => router.refresh()} disabled={busy}>
        Refresh
      </Button>
    </div>
  );
}