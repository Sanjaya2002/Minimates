"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Card";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/utils/format";

export default function CartPage() {
  const { items, totals, loading, setQuantity, removeItem, applyPromo } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  async function handlePromo(event: React.FormEvent) {
    event.preventDefault();
    setPromoLoading(true);
    await applyPromo(promoInput);
    setPromoLoading(false);
  }

  return (
    <Container className="py-10">
      <h1 className="font-heading text-3xl font-extrabold text-ink sm:text-4xl">
        Your basket
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Review your items and head to checkout when you&apos;re ready.
      </p>

      {loading ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-72" />
        </div>
      ) : items.length === 0 ? (
        <EmptyCartState />
      ) : (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {items.map((line) => (
              <li
                key={line.id}
                className="flex gap-4 rounded-3xl border border-ink/8 bg-white p-4 shadow-soft"
              >
                <Link
                  href={`/product/${line.slug}`}
                  className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream"
                >
                  {line.image && (
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/product/${line.slug}`}
                        className="font-heading text-sm font-bold hover:text-playful-pink"
                      >
                        {line.name}
                      </Link>
                      {line.variantLabel && (
                        <p className="mt-0.5 text-xs text-ink-soft">
                          {line.variantLabel}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.id)}
                      className="rounded-full p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove ${line.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {!line.inStock && <Badge tone="red" className="mt-2 self-start">Out of stock</Badge>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-1 rounded-full border border-ink/10">
                      <QtyButton
                        label="Decrease quantity"
                        onClick={() => setQuantity(line.id, line.quantity - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </QtyButton>
                      <span className="w-8 text-center text-sm font-semibold">
                        {line.quantity}
                      </span>
                      <QtyButton
                        label="Increase quantity"
                        disabled={line.quantity >= line.stock}
                        onClick={() => setQuantity(line.id, line.quantity + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </QtyButton>
                    </div>
                    <p className="font-bold text-playful-pink">
                      {formatPrice(line.lineTotal)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <AnimatePresence>
            <div className="sticky top-24 rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
              <h2 className="font-heading text-lg font-bold">Order summary</h2>

              <form onSubmit={handlePromo} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value)}
                  placeholder="Promo code"
                  aria-label="Promo code"
                  className="w-full rounded-full border-2 border-ink/10 px-4 py-2.5 text-sm focus:border-sky-blue focus:outline-none"
                />
                <Button type="submit" variant="secondary" size="md" loading={promoLoading}>
                  Apply
                </Button>
              </form>

              {totals.promoCode && (
                <p className="mt-2 rounded-2xl bg-lime-green/20 px-3 py-2 text-xs font-semibold text-lime-green-900">
                  {totals.promoLabel} applied 🎉
                </p>
              )}

              <dl className="mt-5 space-y-2.5 text-sm">
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
                  <dt>Total</dt>
                  <dd className="text-playful-pink">{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className={buttonVariants({ className: "mt-5 w-full" })}
              >
                Proceed to checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop"
                className="mt-3 block text-center text-sm font-semibold text-ink-soft hover:text-playful-pink"
              >
                Continue shopping
              </Link>
            </div>
          </AnimatePresence>
        </div>
      )}
    </Container>
  );
}

function QtyButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full p-1.5 hover:bg-cream disabled:opacity-40"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function EmptyCartState() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-ink/10 bg-cream/50 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-playful-pink shadow-soft">
        <ShoppingBag className="h-9 w-9" />
      </div>
      <h2 className="mt-5 font-heading text-2xl font-bold">Your basket is empty</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">
        Looks like you haven&apos;t added anything yet. Let&apos;s find something lovely
        for your little one.
      </p>
      <Link href="/shop" className={buttonVariants({ className: "mt-6" })}>
        Start shopping <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}