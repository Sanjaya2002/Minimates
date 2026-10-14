"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { cn } from "@/lib/utils/cn";
import type { ProductDetail } from "@/lib/types";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "0-3M", "3-6M", "6-12M", "150ml", "260ml", "2-3Y", "4-5Y", "6-7Y"];

export function ProductPurchasePanel({ product }: { product: ProductDetail }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const sizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size).filter(Boolean)) as Set<string>].sort(sizeSort),
    [product.variants],
  );
  const colors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color).filter(Boolean)) as Set<string>],
    [product.variants],
  );

  const selectedVariant = useMemo(() => {
    if (!product.variants.length) return null;
    if (sizes.length === 0 && colors.length === 0) return product.variants[0];
    return (
      product.variants.find(
        (v) =>
          (size === null || v.size === size) && (color === null || v.color === color),
      ) ?? null
    );
  }, [product.variants, size, color, sizes.length, colors.length]);

  const inStock = selectedVariant ? selectedVariant.stock > 0 : product.stock > 0;
  const needsSelection = (sizes.length > 0 || colors.length > 0) && !selectedVariant;
  const unitPrice = selectedVariant?.priceOverride ?? product.price;
  const stock = selectedVariant?.stock ?? product.stock;

  async function handleAdd() {
    if (!selectedVariant && product.variants.length > 0) return;
    setAdding(true);
    await addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      quantity,
      name: product.name,
    });
    setAdding(false);
  }

  return (
    <div className="space-y-5">
      {sizes.length > 0 && (
        <OptionGroup label="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={cn(
                  "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                  size === s
                    ? "border-playful-pink bg-playful-pink text-white"
                    : "border-ink/10 bg-white text-ink hover:border-sky-blue",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </OptionGroup>
      )}

      {colors.length > 0 && (
        <OptionGroup label="Colour">
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={color === c}
                className={cn(
                  "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                  color === c
                    ? "border-playful-pink bg-playful-pink text-white"
                    : "border-ink/10 bg-white text-ink hover:border-sky-blue",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </OptionGroup>
      )}

      <div className="flex items-center justify-between rounded-2xl bg-cream/60 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Quantity
          </p>
          <div className="mt-1 flex items-center gap-3 rounded-full border-2 border-ink/10 bg-white px-2 py-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="rounded-full p-1.5 hover:bg-cream"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-heading text-base font-bold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              className="rounded-full p-1.5 hover:bg-cream"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            {selectedVariant && selectedVariant.priceOverride != null ? "Variant price" : "Price"}
          </p>
          <p className="font-heading text-xl font-extrabold text-playful-pink">
            Rs. {unitPrice.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!inStock || needsSelection || adding}
        className={cn(
          "flex h-13 w-full items-center justify-center gap-2 rounded-full px-8 text-base font-bold transition-all",
          inStock
            ? "bg-playful-pink text-white shadow-soft hover:bg-playful-pink-dark hover:shadow-lift"
            : "bg-cream text-ink-soft",
        )}
      >
        <ShoppingBag className="h-5 w-5" />
        {!product.inStock && !selectedVariant
          ? "Out of stock"
          : !inStock
            ? "Out of stock"
            : adding
              ? "Adding…"
              : "Add to cart"}
      </button>
    </div>
  );
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">
        {label}
      </p>
      {children}
    </div>
  );
}

function sizeSort(a: string, b: string) {
  const ia = SIZE_ORDER.indexOf(a);
  const ib = SIZE_ORDER.indexOf(b);
  if (ia === -1 && ib === -1) return a.localeCompare(b);
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
}