import { notFound } from "next/navigation";
import { getProductById } from "@/lib/services/products";
import { getCategories } from "@/lib/services/categories";
import { ProductForm } from "@/components/admin/ProductForm";
import { toNumber } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(id),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: toNumber(product.price),
          compareAtPrice:
            product.compareAtPrice != null ? toNumber(product.compareAtPrice) : null,
          categoryId: product.categoryId,
          ageGroup: product.ageGroup,
          stock: product.stock,
          images: product.images,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          isActive: product.isActive,
          variants: product.variants.map((variant) => ({
            id: variant.id,
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
            priceOverride:
              variant.priceOverride != null ? toNumber(variant.priceOverride) : null,
          })),
        }}
      />
    </div>
  );
}