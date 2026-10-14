"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useToast } from "@/components/ui/Toast";
import type { CartLine, CartTotals } from "@/lib/types";

interface CartState {
  items: CartLine[];
  totals: CartTotals;
  itemCount: number;
}

interface CartContextValue extends CartState {
  loading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: {
    productId: string;
    variantId?: string | null;
    quantity?: number;
    name?: string;
  }) => Promise<boolean>;
  setQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  applyPromo: (code: string) => Promise<void>;
  promoCode: string | null;
  refresh: () => Promise<void>;
}

const EMPTY_TOTALS: CartTotals = {
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  promoCode: null,
  promoLabel: null,
};

const CartContext = createContext<CartContextValue | null>(null);

async function parse<T>(response: Response): Promise<T> {
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json?.error || "Something went wrong");
  }
  return json.data as T;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [items, setItems] = useState<CartLine[]>([]);
  const [totals, setTotals] = useState<CartTotals>(EMPTY_TOTALS);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const query = promoCode ? `?promo=${encodeURIComponent(promoCode)}` : "";
      const response = await fetch(`/api/cart${query}`, { cache: "no-store" });
      const data = await parse<CartState>(response);
      setItems(data.items);
      setTotals(data.totals);
      setItemCount(data.itemCount);
    } catch {
      // Silently keep current state on background refresh failures.
    } finally {
      setLoading(false);
    }
  }, [promoCode]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem: CartContextValue["addItem"] = useCallback(
    async ({ productId, variantId, quantity = 1, name }) => {
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, variantId: variantId ?? null, quantity }),
        });
        await parse(response);
        await refresh();
        setIsOpen(true);
        toast(name ? `${name} added to cart` : "Added to cart", "success");
        return true;
      } catch (error) {
        toast(error instanceof Error ? error.message : "Could not add item", "error");
        return false;
      }
    },
    [refresh, toast],
  );

  const setQuantity: CartContextValue["setQuantity"] = useCallback(
    async (itemId, quantity) => {
      try {
        const response = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId, quantity }),
        });
        await parse(response);
        await refresh();
      } catch (error) {
        toast(error instanceof Error ? error.message : "Could not update item", "error");
      }
    },
    [refresh, toast],
  );

  const removeItem: CartContextValue["removeItem"] = useCallback(
    async (itemId) => {
      try {
        const response = await fetch(`/api/cart?itemId=${encodeURIComponent(itemId)}`, {
          method: "DELETE",
        });
        await parse(response);
        await refresh();
        toast("Removed from cart", "info");
      } catch (error) {
        toast(error instanceof Error ? error.message : "Could not remove item", "error");
      }
    },
    [refresh, toast],
  );

  const clear = useCallback(async () => {
    try {
      const response = await fetch("/api/cart?all=1", { method: "DELETE" });
      await parse(response);
      await refresh();
    } catch {
      // ignore
    }
  }, [refresh]);

  const applyPromo: CartContextValue["applyPromo"] = useCallback(
    async (code) => {
      const trimmed = code.trim().toUpperCase();
      if (!trimmed) {
        setPromoCode(null);
        return;
      }
      try {
        const response = await fetch(`/api/cart?promo=${encodeURIComponent(trimmed)}`, {
          cache: "no-store",
        });
        const data = await parse<CartState>(response);
        if (!data.totals.promoCode) {
          toast("That promo code isn't valid", "error");
          return;
        }
        setPromoCode(data.totals.promoCode);
        setItems(data.items);
        setTotals(data.totals);
        setItemCount(data.itemCount);
        toast("Promo code applied", "success");
      } catch (error) {
        toast(error instanceof Error ? error.message : "Could not apply code", "error");
      }
    },
    [toast],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals,
      itemCount,
      loading,
      isOpen,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      removeItem,
      clear,
      applyPromo,
      promoCode,
      refresh,
    }),
    [
      items,
      totals,
      itemCount,
      loading,
      isOpen,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      removeItem,
      clear,
      applyPromo,
      promoCode,
      refresh,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
