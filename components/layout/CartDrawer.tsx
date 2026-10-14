"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/utils/format";
import { buttonVariants } from "@/components/ui/buttonStyles";

export function CartDrawer() {
  const { isOpen, closeCart, items, totals, setQuantity, removeItem, itemCount } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[75]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-ink/8 p-5">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
                <ShoppingBag className="h-5 w-5" /> Your basket
                {itemCount > 0 && (
                  <span className="rounded-full bg-playful-pink/15 px-2 py-0.5 text-xs text-playful-pink">
                    {itemCount}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full p-2 text-ink-soft hover:bg-cream"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream text-4xl">
                  🧺
                </div>
                <p className="font-heading text-lg font-bold">Your basket is empty</p>
                <p className="text-sm text-ink-soft">
                  Add some lovely things for your little one.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className={buttonVariants({ className: "mt-2" })}
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto p-5">
                  {items.map((line) => (
                    <li key={line.id} className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream">
                        {line.image && (
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/product/${line.slug}`}
                          onClick={closeCart}
                          className="line-clamp-2 text-sm font-semibold hover:text-playful-pink"
                        >
                          {line.name}
                        </Link>
                        {line.variantLabel && (
                          <span className="text-xs text-ink-soft">
                            {line.variantLabel}
                          </span>
                        )}
                        <span className="mt-0.5 text-sm font-bold text-playful-pink">
                          {formatPrice(line.unitPrice)}
                        </span>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-ink/10">
                            <button
                              type="button"
                              onClick={() => setQuantity(line.id, line.quantity - 1)}
                              className="rounded-full p-1.5 hover:bg-cream"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(line.id, line.quantity + 1)}
                              disabled={line.quantity >= line.stock}
                              className="rounded-full p-1.5 hover:bg-cream disabled:opacity-40"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
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
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-ink/8 p-5">
                  <div className="flex items-center justify-between text-sm text-ink-soft">
                    <span>Subtotal</span>
                    <span className="font-semibold text-ink">
                      {formatPrice(totals.subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">
                    Shipping calculated at checkout.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      View cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className={buttonVariants({ variant: "primary" })}
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
