import Image from "next/image";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export interface LowStockProduct {
  id: string;
  name: string;
  image: string | null;
  stock: number;
}

export function LowStockAlert({ products }: { products: LowStockProduct[] }) {
  if (!products.length) return null;

  return (
    <div className="rounded-3xl border border-soft-sunshine/60 bg-soft-sunshine/15 p-5 shadow-soft">
      <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-ink">
        <AlertTriangle className="h-4 w-4 text-ink" /> Low stock alert
      </h3>
      <ul className="mt-3 space-y-2.5">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white"
            >
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white">
                {product.image && (
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                {product.name}
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-red-500">
                {product.stock} left
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}