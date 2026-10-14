export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount?: number;
}

export interface ProductVariantDTO {
  id: string;
  size: string | null;
  color: string | null;
  stock: number;
  priceOverride: number | null;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  categoryName: string;
  categorySlug: string;
  ageGroup: string | null;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  inStock: boolean;
}

export interface ProductDetail extends ProductListItem {
  description: string | null;
  images: string[];
  categoryId: string;
  isActive: boolean;
  variants: ProductVariantDTO[];
}

export interface CartLine {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  slug: string;
  image: string | null;
  variantLabel: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stock: number;
  inStock: boolean;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode: string | null;
  promoLabel: string | null;
}

export interface CartWithItems {
  sessionId: string;
  items: CartLine[];
  totals: CartTotals;
  itemCount: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
