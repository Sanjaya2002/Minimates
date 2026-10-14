import { NextRequest } from "next/server";
import { z } from "zod";
import { getCartSessionId } from "@/lib/cart/session";
import {
  addItem,
  clearCart,
  getOrCreateCart,
  removeItem,
  updateItem,
  buildCartResponse,
} from "@/lib/services/cart";
import { ok, fail, withErrorHandling } from "@/lib/api/response";

const addSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).nullable().optional(),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

const updateSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.coerce.number().int().min(0).max(999),
});

const add = withErrorHandling(async (request: NextRequest) => {
  const sessionId = await getCartSessionId(true);
  if (!sessionId) return fail("Could not start a cart session", 500);
  const cart = await getOrCreateCart(sessionId);

  const body = addSchema.parse(await request.json());
  await addItem(cart.id, body.productId, body.variantId ?? null, body.quantity);
  return ok(await buildCartResponse(cart.id));
});

const get = withErrorHandling(async (request: NextRequest) => {
  const sessionId = await getCartSessionId(true);
  if (!sessionId) return fail("Could not start a cart session", 500);
  const cart = await getOrCreateCart(sessionId);
  const promo = request.nextUrl.searchParams.get("promo");
  return ok(await buildCartResponse(cart.id, promo));
});

const patch = withErrorHandling(async (request: NextRequest) => {
  const sessionId = await getCartSessionId(true);
  if (!sessionId) return fail("Could not start a cart session", 500);
  const cart = await getOrCreateCart(sessionId);

  const body = updateSchema.parse(await request.json());
  await updateItem(cart.id, body.itemId, body.quantity);
  return ok(await buildCartResponse(cart.id));
});

const del = withErrorHandling(async (request: NextRequest) => {
  const sessionId = await getCartSessionId(false);
  if (!sessionId) return ok({ cleared: false });
  const cart = await getOrCreateCart(sessionId);

  const itemId = request.nextUrl.searchParams.get("itemId");
  const clear = request.nextUrl.searchParams.get("all") === "1";

  if (clear) {
    await clearCart(cart.id);
  } else if (itemId) {
    await removeItem(cart.id, itemId);
  }
  return ok(await buildCartResponse(cart.id));
});

export { get as GET, add as POST, patch as PATCH, del as DELETE };