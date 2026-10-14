import { prisma } from "@/lib/db/prisma";
import { AppError, NotFoundError, ValidationError } from "@/lib/errors";
import { toNumber } from "@/lib/utils/format";
import { computeTotals } from "@/lib/services/pricing";
import type { CartLine, CartWithItems } from "@/lib/types";

function variantLabel(size: string | null, color: string | null): string | null {
  const parts = [size, color].filter(Boolean);
  return parts.length ? parts.join(" / ") : null;
}

export async function getOrCreateCart(sessionId: string) {
  return prisma.cart.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
  });
}

export async function getCart(id: string) {
  return prisma.cart.findUnique({ where: { id } });
}

export async function getCartLines(cartId: string): Promise<CartLine[]> {
  const items = await prisma.cartItem.findMany({
    where: { cartId },
    orderBy: { createdAt: "asc" },
    include: { product: true, variant: true },
  });

  return items.map((item) => {
    const unitPrice =
      item.variant?.priceOverride != null
        ? toNumber(item.variant.priceOverride)
        : toNumber(item.product.price);
    const stock = item.variant ? item.variant.stock : item.product.stock;
    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      name: item.product.name,
      slug: item.product.slug,
      image: item.product.images[0] ?? null,
      variantLabel: item.variant
        ? variantLabel(item.variant.size, item.variant.color)
        : null,
      unitPrice,
      quantity: item.quantity,
      lineTotal: Math.round(unitPrice * item.quantity * 100) / 100,
      stock,
      inStock: stock > 0,
    };
  });
}

export async function buildCartResponse(
  cartId: string,
  promoCode?: string | null,
): Promise<CartWithItems & { id: string }> {
  const lines = await getCartLines(cartId);
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const totals = computeTotals(subtotal, promoCode);

  return {
    id: cartId,
    sessionId: cartId,
    items: lines,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    totals,
  };
}

export async function addItem(
  cartId: string,
  productId: string,
  variantId: string | null,
  quantity: number,
): Promise<void> {
  if (quantity < 1) throw new ValidationError("Quantity must be at least 1");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });
  if (!product || !product.isActive) throw new NotFoundError("Product not found");

  let availableStock = product.stock;
  if (variantId) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) throw new ValidationError("Selected variant is unavailable");
    availableStock = variant.stock;
  }

  if (availableStock <= 0) {
    throw new AppError("This item is out of stock", 409, "OUT_OF_STOCK");
  }

  const existing = await prisma.cartItem.findFirst({
    where: { cartId, productId, variantId: variantId ?? null },
  });

  const desired = (existing?.quantity ?? 0) + quantity;
  if (desired > availableStock) {
    throw new AppError(
      `Only ${availableStock} left in stock`,
      409,
      "INSUFFICIENT_STOCK",
    );
  }

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: desired },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId, productId, variantId: variantId ?? null, quantity },
    });
  }
}

export async function updateItem(
  cartId: string,
  itemId: string,
  quantity: number,
): Promise<void> {
  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cartId },
    include: { product: true, variant: true },
  });
  if (!item) throw new NotFoundError("Cart item not found");

  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: item.id } });
    return;
  }

  const availableStock = item.variant ? item.variant.stock : item.product.stock;
  if (quantity > availableStock) {
    throw new AppError(
      `Only ${availableStock} left in stock`,
      409,
      "INSUFFICIENT_STOCK",
    );
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  });
}

export async function removeItem(cartId: string, itemId: string): Promise<void> {
  await prisma.cartItem.deleteMany({ where: { id: itemId, cartId } });
}

export async function clearCart(cartId: string): Promise<void> {
  await prisma.cartItem.deleteMany({ where: { cartId } });
}
