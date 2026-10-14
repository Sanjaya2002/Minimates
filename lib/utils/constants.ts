export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const AGE_GROUPS = [
  { value: "0-6-months", label: "0 – 6 months" },
  { value: "6-12-months", label: "6 – 12 months" },
  { value: "1-2-years", label: "1 – 2 years" },
  { value: "3-5-years", label: "3 – 5 years" },
  { value: "6-plus-years", label: "6+ years" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A – Z" },
  { value: "featured", label: "Featured" },
] as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const FULFILLMENT_STATUS_LABELS: Record<string, string> = {
  PROCESSING: "Processing",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const FULFILLMENT_FLOW = [
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
] as const;

/** Shipping configuration (LKR). */
export const SHIPPING = {
  flatRate: 400,
  freeThreshold: 10000,
} as const;

/** Demo promo codes (server-authoritative). */
export const PROMO_CODES: Record<
  string,
  { type: "percentage" | "fixed"; value: number; label: string }
> = {
  WELCOME10: { type: "percentage", value: 10, label: "10% off your order" },
  MINI500: { type: "fixed", value: 500, label: "Rs. 500 off" },
};

export const PRODUCTS_PER_PAGE = 12;
