import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { PromoBanner } from "@/components/home/PromoBanner";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { getCategories } from "@/lib/services/categories";
import { getFeaturedProducts, getNewArrivals } from "@/lib/services/products";
import type { CategoryDTO, ProductListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let categories: CategoryDTO[] = [];
  let featured: ProductListItem[] = [];
  let newArrivals: ProductListItem[] = [];

  try {
    [categories, featured, newArrivals] = await Promise.all([
      getCategories(true),
      getFeaturedProducts(8),
      getNewArrivals(4),
    ]);
  } catch {
    // Render a graceful page even if the database is unreachable.
  }

  return (
    <>
      <HeroBanner />

      <Container className="py-14">
        <SectionHeading
          eyebrow="Browse by category"
          title="Shop our favourite collections"
          description="From bath time to play time, find exactly what your little one needs."
        />
        <div className="mt-8">
          <CategoryGrid categories={categories} />
        </div>
      </Container>

      {featured.length > 0 && (
        <section className="bg-cream/60 py-14">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Best sellers"
                title="Loved by parents"
                description="Our most popular picks, tried and trusted by families."
              />
              <Link
                href="/shop"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8">
              <ProductGrid products={featured} />
            </div>
          </Container>
        </section>
      )}

      <PromoBanner />

      {newArrivals.length > 0 && (
        <Container className="py-14">
          <SectionHeading
            eyebrow="Just landed"
            title="New arrivals"
            description="Freshly added products for your growing little one."
          />
          <div className="mt-8">
            <ProductGrid products={newArrivals} />
          </div>
        </Container>
      )}

      <section className="bg-cream/60 py-14">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Kind words"
            title="Parents trust Minimates"
            description="Real stories from families who shop with us."
          />
          <div className="mt-10">
            <Testimonials />
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
