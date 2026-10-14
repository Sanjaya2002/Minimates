import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, Package, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { calculateDiscountPercent, formatPrice } from "@/lib/utils/format";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/products";
import type { ProductDetail, ProductListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description:
      product.description?.slice(0, 160) ??
      `Shop ${product.name} at Minimates — baby & kids care essentials.`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) ?? undefined,
      images: product.image ? [{ url: product.image }] : undefined,
      type: "website",
    },
  };
}

const benefits = [
  { icon: Truck, title: "Fast delivery", text: "Nationwide within 2–4 days" },
  { icon: RotateCcw, title: "Easy returns", text: "7-day hassle-free returns" },
  { icon: ShieldCheck, title: "Baby-safe", text: "Carefully safety-tested items" },
  { icon: Package, title: "Gift ready", text: "Beautiful, safe packaging" },
];

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;

  let product: ProductDetail | null = null;
  let related: ProductListItem[] = [];
  try {
    product = await getProductBySlug(slug);
    if (product) {
      related = await getRelatedProducts(product.id, product.categoryId);
    }
  } catch {
    product = null;
  }
  if (!product) notFound();

  const discount = calculateDiscountPercent(product.price, product.compareAtPrice);

  return (
    <Container className="py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs font-medium text-ink-soft">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-playful-pink">Home</Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" />
          <li>
            <Link href="/shop" className="hover:text-playful-pink">Shop</Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" />
          <li>
            <Link href={`/shop/${product.categorySlug}`} className="hover:text-playful-pink">
              {product.categoryName}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" />
          <li aria-current="page" className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="sky">{product.categoryName}</Badge>
            {product.isNew && <Badge tone="pink">New</Badge>}
            {discount && <Badge tone="sunshine">Save {discount}%</Badge>}
          </div>

          <h1 className="mt-3 font-heading text-3xl font-extrabold text-ink sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            <span className="font-heading text-3xl font-extrabold text-playful-pink">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-ink-soft line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <>
                {product.variants.length === 0 && (
                  <span className="inline-flex items-center gap-1.5 text-lime-green">
                    <span className="h-2.5 w-2.5 rounded-full bg-lime-green" />
                    In stock ({product.stock} available)
                  </span>
                )}
                {product.variants.length > 0 && (
                  <span className="text-ink-soft">
                    In stock · pick a variant below
                  </span>
                )}
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-semibold text-red-500">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                Out of stock
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-5 text-sm leading-relaxed text-ink-soft sm:text-base">
              {product.description}
            </p>
          )}

          {product.variants.length > 0 && (
            <div className="mt-6">
              <ProductPurchasePanel product={product} />
            </div>
          )}
          {product.variants.length === 0 && (
            <div className="mt-6">
              <ProductPurchasePanel product={product} />
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-3 rounded-2xl bg-cream/60 p-3"
              >
                <benefit.icon className="mt-0.5 h-5 w-5 shrink-0 text-playful-pink" />
                <div>
                  <p className="text-sm font-bold text-ink">{benefit.title}</p>
                  <p className="text-xs text-ink-soft">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 overflow-hidden rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-cream">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            )}
          </div>
          <div>
            <p className="font-heading text-sm font-bold">Bought this? Share the love</p>
            <p className="text-xs text-ink-soft">
              Tell your friends about {product.name}.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading
            eyebrow="You may also like"
            title="Related products"
          />
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </Container>
  );
}