import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { FilterPanel } from "@/components/shop/FilterPanel";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { Pagination } from "@/components/shop/Pagination";
import { getCategories, getCategoryBySlug } from "@/lib/services/categories";
import { getProducts } from "@/lib/services/products";
import { PRODUCTS_PER_PAGE } from "@/lib/utils/constants";
import type { CategoryDTO, ProductListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type Params = Promise<{ category: string }>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description:
      category.description ??
      `Shop ${category.name} at Minimates — baby and kids care essentials.`,
    openGraph: {
      title: `${category.name} | Minimates`,
      description: category.description ?? undefined,
      images: category.imageUrl ? [category.imageUrl] : undefined,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { category: slug } = await params;
  const query = await searchParams;

  let category: CategoryDTO | null = null;
  try {
    category = await getCategoryBySlug(slug);
  } catch {
    category = null;
  }
  if (!category) notFound();

  const q = one(query.q) ?? "";
  const ageGroup = one(query.age);
  const minPrice = one(query.minPrice);
  const maxPrice = one(query.maxPrice);
  const inStock = one(query.inStock) === "1";
  const sort = one(query.sort) ?? "newest";
  const page = Number(one(query.page) ?? 1) || 1;

  let categories: CategoryDTO[] = [];
  let products: ProductListItem[] = [];
  let totalPages = 1;
  let total = 0;

  try {
    const [cats, result] = await Promise.all([
      getCategories(),
      getProducts({
        search: q || undefined,
        categorySlug: slug,
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
    age: ageGroup,
    minPrice,
    maxPrice,
    inStock: inStock ? "1" : undefined,
    sort: sort !== "newest" ? sort : undefined,
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-blue/70 to-soft-lilac/60">
        <Container className="grid items-center gap-8 py-12 sm:grid-cols-[1fr_auto] sm:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-playful-pink">
              Category
            </p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold text-ink sm:text-4xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-3 max-w-xl text-sm text-ink-soft sm:text-base">
                {category.description}
              </p>
            )}
            <p className="mt-4 text-sm font-semibold text-ink">
              {total} {total === 1 ? "product" : "products"}
            </p>
          </div>
          {category.imageUrl && (
            <div className="relative hidden h-40 w-40 overflow-hidden rounded-[2rem] shadow-lift sm:block">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          )}
        </Container>
      </section>

      <div className="bg-cream/40 py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
                <Suspense fallback={null}>
                  <FilterPanel categories={categories} lockedCategory />
                </Suspense>
              </div>
            </aside>

            <div>
              <Suspense fallback={null}>
                <ShopToolbar
                  categories={categories}
                  lockedCategory
                  resultCount={total}
                />
              </Suspense>
              <div className="mt-6">
                <ProductGrid products={products} />
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                basePath={`/shop/${slug}`}
                params={preservedParams}
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
