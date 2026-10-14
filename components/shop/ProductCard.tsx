"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { calculateDiscountPercent, formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import type { ProductListItem } from "@/lib/types";

export function ProductCard({ product }: { product: ProductListItem }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const discount = calculateDiscountPercent(product.price, product.compareAtPrice);

  async function handleAdd() {
    setAdding(true);
    await addItem({ productId: product.id, quantity: 1, name: product.name });
    setAdding(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-soft transition-shadow hover:shadow-lift"
    >
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-cream">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🍼</div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <Badge tone="pink">New</Badge>}
          {discount && <Badge tone="sunshine">-{discount}%</Badge>}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Badge tone="neutral">Out of stock</Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {product.categoryName}
        </span>
        <Link
          href={`/product/${product.slug}`}
          className="mt-1 line-clamp-2 font-heading text-sm font-bold text-ink hover:text-playful-pink"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-playful-pink">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-ink-soft line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock || adding}
          className={cn(
            "mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-sky-blue text-sm font-bold text-ink transition-all",
            "hover:bg-playful-pink hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sky-blue disabled:hover:text-ink",
          )}
        >
          <Plus className="h-4 w-4" />
          {adding ? "Adding…" : "Add to cart"}
        </button>
      </div>
    </motion.div>
  );
}
