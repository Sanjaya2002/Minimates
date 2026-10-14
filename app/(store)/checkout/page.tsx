"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useCart } from "@/lib/cart/CartContext";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils/format";
import type { PaymentInitiation } from "@/lib/payments/types";

interface PaymentMethod {
  id: string;
  name: string;
  configured: boolean;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { items, totals, loading: cartLoading } = useCart();

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [provider, setProvider] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentForm, setPaymentForm] = useState<{
    actionUrl: string;
    method: string;
    fields: Record<string, string>;
  } | null>(null);

  const redirectFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/checkout/methods", { cache: "no-store" })
      .then((response) => response.json())
      .then((json) => {
        if (cancelled) return;
        const list = (json?.data ?? []) as PaymentMethod[];
        setMethods(list);
        const configured =
          list.find((method) => method.configured) ??
          list.find((method) => method.id === "cod");
        if (configured) setProvider(configured.id);
      })
      .catch(() => {
        if (!cancelled) setMethods([{ id: "cod", name: "Cash on Delivery", configured: true }]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (paymentForm && paymentForm.method === "POST") {
      redirectFormRef.current?.submit();
    }
  }, [paymentForm]);

  function set(field: string, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: "" }));
    }
  }

  function validate(): boolean {
    const required: [string, string][] = [
      ["fullName", "Full name"],
      ["email", "Email"],
      ["phone", "Phone number"],
      ["address", "Delivery address"],
      ["city", "City"],
      ["postalCode", "Postal code"],
    ];
    const next: Record<string, string> = {};
    for (const [key, label] of required) {
      if (!fields[key]?.trim()) next[key] = `${label} is required`;
    }
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      next.email = "Please enter a valid email";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) {
      toast("Please check the highlighted fields", "error");
      return;
    }
    if (!items.length) {
      toast("Your basket is empty", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: fields.fullName,
            email: fields.email,
            phone: fields.phone,
          },
          shipping: {
            address: fields.address,
            city: fields.city,
            postalCode: fields.postalCode,
            province: fields.province || "",
            notes: fields.notes || "",
          },
          items: items.map((line) => ({
            productId: line.productId,
            variantId: line.variantId,
            quantity: line.quantity,
          })),
          paymentProvider: provider,
          promoCode: totals.promoCode,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Could not place your order");
      }

      const result = json.data as {
        orderNumber: string;
        payment: PaymentInitiation;
      };

      if (result.payment.kind === "redirect") {
        if (result.payment.method === "POST") {
          setPaymentForm({
            actionUrl: result.payment.actionUrl,
            method: result.payment.method,
            fields: result.payment.fields,
          });
        } else {
          window.location.assign(result.payment.actionUrl);
        }
        return;
      }

      router.push(`/order/${result.orderNumber}`);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not place your order", "error");
      setSubmitting(false);
    }
  }

  const cancelled = searchParams.get("cancelled") === "1";

  return (
    <Container className="py-10">
      {paymentForm?.method === "POST" && (
        <form
          ref={redirectFormRef}
          action={paymentForm.actionUrl}
          method="POST"
          className="hidden"
          aria-label="Proceed to secure payment"
        >
          {Object.entries(paymentForm.fields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
          <button type="submit">Continue</button>
        </form>
      )}

      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-playful-pink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to basket
      </Link>
      <h1 className="mt-3 font-heading text-3xl font-extrabold text-ink sm:text-4xl">
        Checkout
      </h1>

      {cancelled && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-soft-sunshine bg-soft-sunshine/20 px-4 py-3 text-sm font-semibold">
          <AlertTriangle className="h-5 w-5 shrink-0 text-ink" />
          Your payment was cancelled. No worries — you can try again below.
        </div>
      )}

      {cartLoading ? (
        <p className="mt-8 text-ink-soft">Loading your basket…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-[2rem] border-2 border-dashed border-ink/10 bg-cream/50 py-16 text-center">
          <p className="font-heading text-xl font-bold">Your basket is empty</p>
          <Link
            href="/shop"
            className="mt-3 inline-block text-sm font-semibold text-playful-pink hover:underline"
          >
            Go shopping
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
              <h2 className="font-heading text-lg font-bold">1 · Your details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  name="fullName"
                  required
                  autoComplete="name"
                  value={fields.fullName ?? ""}
                  onChange={(event) => set("fullName", event.target.value)}
                  error={errors.fullName}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={fields.email ?? ""}
                  onChange={(event) => set("email", event.target.value)}
                  error={errors.email}
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={fields.phone ?? ""}
                  onChange={(event) => set("phone", event.target.value)}
                  error={errors.phone}
                  className="sm:col-span-2"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
              <h2 className="font-heading text-lg font-bold">2 · Delivery address</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Address"
                  name="address"
                  required
                  autoComplete="street-address"
                  value={fields.address ?? ""}
                  onChange={(event) => set("address", event.target.value)}
                  error={errors.address}
                  className="sm:col-span-2"
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="address-level2"
                  value={fields.city ?? ""}
                  onChange={(event) => set("city", event.target.value)}
                  error={errors.city}
                />
                <Select
                  label="Province"
                  name="province"
                  value={fields.province ?? ""}
                  onChange={(event) => set("province", event.target.value)}
                >
                  <option value="">Select province</option>
                  {["Western", "Central", "Southern", "North Western", "Sabaragamuwa", "Eastern", "Uva", "North Central", "Northern"].map(
                    (province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ),
                  )}
                </Select>
                <Select
                  label="Postal code"
                  name="postalCode"
                  value={fields.postalCode ?? ""}
                  onChange={(event) => set("postalCode", event.target.value)}
                  error={errors.postalCode}
                >
                  <option value="">Select or type</option>
                  {["00100", "00200", "00300", "00400", "00500", "00600", "01000", "11000"].map(
                    (code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ),
                  )}
                </Select>
                <Textarea
                  label="Delivery instructions (optional)"
                  name="notes"
                  value={fields.notes ?? ""}
                  onChange={(event) => set("notes", event.target.value)}
                  className="sm:col-span-2"
                  hint="e.g. leave at the door, call on arrival."
                />
              </div>
            </section>

            <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
              <h2 className="font-heading text-lg font-bold">3 · Payment method</h2>
              <div className="mt-5 space-y-3">
                {methods.length === 0 && (
                  <p className="text-sm text-ink-soft">Loading payment methods…</p>
                )}
                {methods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-colors ${
                      provider === method.id
                        ? "border-playful-pink bg-playful-pink/5"
                        : "border-ink/10 hover:border-sky-blue"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={provider === method.id}
                      onChange={() => setProvider(method.id)}
                      className="h-4 w-4 accent-playful-pink"
                    />
                    <span className="font-semibold text-ink">{method.name}</span>
                    {!method.configured && (
                      <span className="ml-auto text-xs text-ink-soft">
                        not configured
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-soft">
                <Lock className="h-3.5 w-3.5" /> Payments are securely processed by
                our payment partner.
              </p>
            </section>
          </div>

          <div className="sticky top-24 rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-lg font-bold">Order summary</h2>
            <ul className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-1">
              {items.map((line) => (
                <li key={line.id} className="flex items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream">
                    {line.image && (
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{line.name}</p>
                    {line.variantLabel && (
                      <p className="text-xs text-ink-soft">{line.variantLabel}</p>
                    )}
                    <p className="text-xs text-ink-soft">
                      {line.quantity} × {formatPrice(line.unitPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(line.lineTotal)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="font-semibold">
                  {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
                </dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-lime-green-700">
                  <dt className="font-medium">Discount</dt>
                  <dd className="font-bold">−{formatPrice(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-ink/10 pt-3 font-heading text-base font-extrabold">
                <dt>Total to pay</dt>
                <dd className="text-playful-pink">{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            <Button
              type="submit"
              size="lg"
              loading={submitting}
              className="mt-6 w-full"
            >
              {submitting ? "Placing order…" : `Place order · ${formatPrice(totals.total)}`}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
              <CheckCircle2 className="h-4 w-4 text-lime-green" />
              No account needed — check out as a guest.
            </p>
          </div>
        </form>
      )}
    </Container>
  );
}