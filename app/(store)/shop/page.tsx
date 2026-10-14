import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { FilterPanel } from "@/components/shop/FilterPanel";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { Pagination } from "@/components/shop/Pagination";
import { getCategories } from "@/lib/services/categories";
import { getProducts } from "@/lib/services/products";
import { PRODUCTS_PER_PAGE } from "@/lib/utils/constants";
import type { CategoryDTO, ProductListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop all products",
  description:
    "Browse the full Minimates range of baby and kids care products — bath, feeding, clothing, toys and more.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const q = one(params.q) ?? "";
  const categorySlug = one(params.category);
  const ageGroup = one(params.age);
  const minPrice = one(params.minPrice);
  const maxPrice = one(params.maxPrice);
  const inStock = one(params.inStock) === "1";
  const sort = one(params.sort) ?? "newest";
  const page = Number(one(params.page) ?? 1) || 1;

  let categories: CategoryDTO[] = [];
  let products: ProductListItem[] = [];
  let totalPages = 1;
  let total = 0;

  try {
    const [cats, result] = await Promise.all([
      getCategories(true),
      getProducts({
        search: q || undefined,
        categorySlug: categorySlug || undefined,
        ageGroup: ageGroup || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        inStockOnly: inStock,
        sort,
        page,
        perPage: PRODUCTS_PER_PAGE,
      }),
    ]);
    categories = cats;
    products = result.items;
    totalPages = result.totalPages;
    total = result.total;
  } catch {
    // graceful empty state
  }

  const preservedParams: Record<string, string | undefined> = {
    q: q || undefined,
    category: categorySlug,
    age: ageGroup,
    minPrice,
    maxPrice,
    inStock: inStock ? "1" : undefined,
    sort: sort !== "newest" ? sort : undefined,
  };

  return (
    <div className="bg-cream/40 py-10">
      <Container>
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-ink sm:text-4xl">
            {q ? `Results for “${q}”` : "All products"}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {total} {total === 1 ? "product" : "products"} available
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
              <Suspense fallback={null}>
                <FilterPanel categories={categories} />
              </Suspense>
            </div>
          </aside>

          <div>
            <Suspense fallback={null}>
              <ShopToolbar categories={categories} resultCount={total} />
            </Suspense>
            <div className="mt-6">
              <ProductGrid products={products} />
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/shop"
              params={preservedParams}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
