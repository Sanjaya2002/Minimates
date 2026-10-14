import { Prisma, type Product } from "@prisma/client";
import { toNumber } from "@/lib/utils/format";
import { PROMO_CODES, SHIPPING } from "@/lib/utils/constants";

export interface PricingResult {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode: string | null;
  promoLabel: string | null;
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Server-authoritative pricing. The browser never supplies totals.
 */
export function computeTotals(
  subtotal: number,
  promoCodeInput?: string | null,
): PricingResult {
  const cleanSubtotal = roundMoney(Math.max(0, subtotal));

  const shipping =
    cleanSubtotal <= 0 || cleanSubtotal >= SHIPPING.freeThreshold
      ? 0
      : SHIPPING.flatRate;

  let discount = 0;
  let promoLabel: string | null = null;
  let appliedCode: string | null = null;

  const code = promoCodeInput?.trim().toUpperCase();
  if (code && PROMO_CODES[code]) {
    const promo = PROMO_CODES[code];
    discount =
      promo.type === "percentage"
        ? roundMoney((cleanSubtotal * promo.value) / 100)
        : Math.min(promo.value, cleanSubtotal);
    appliedCode = code;
    promoLabel = promo.label;
  }

  const total = Math.max(0, roundMoney(cleanSubtotal + shipping - discount));

  return {
    subtotal: cleanSubtotal,
    shipping,
    discount,
    total,
    promoCode: appliedCode,
    promoLabel,
  };
}

export function effectiveUnitPrice(product: Pick<Product, "price">, variant?: { priceOverride: Prisma.Decimal | null } | null): number {
  if (variant?.priceOverride != null) return toNumber(variant.priceOverride);
  return toNumber(product.price);
}
