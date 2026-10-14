import { PackageOpen } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductListItem } from "@/lib/types";

export function ProductGrid({ products }: { products: ProductListItem[] }) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-ink/10 bg-cream/50 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-playful-pink shadow-soft">
          <PackageOpen className="h-7 w-7" />
        </div>
        <p className="mt-4 font-heading text-lg font-bold">No products found</p>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">
          Try adjusting your filters or search for something else.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
