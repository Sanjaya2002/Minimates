"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils/format";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  categoryName: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  variantCount: number;
}

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [deleting, setDeleting] = useState<AdminProduct | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories").then(async (response) => {
      const json = await response.json();
      if (response.ok && json.success) setCategories(json.data);
    });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, category, stock, status]);

  const load = useCallback(async () => {
    setError(false);
    const params = new URLSearchParams({ page: String(page), perPage: "20" });
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (stock) params.set("stock", stock);
    if (status) params.set("status", status);
    try {
      const response = await fetch(`/api/admin/products?${params}`, {
        cache: "no-store",
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error);
      setProducts(json.data.products);
      setTotal(json.data.pagination.total);
    } catch (error) {
      setError(true);
      toast(error instanceof Error ? error.message : "Failed to load", "error");
    }
  }, [search, category, stock, status, page, toast]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, stock, status, page]);

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      const response = await fetch(`/api/admin/products/${deleting.id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error);
      toast("Product deleted", "success");
      setDeleting(null);
      load();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not delete", "error");
    } finally {
      setDeletingBusy(false);
    }
  }

  const pages = useMemo(() => Math.max(1, Math.ceil(total / 20)), [total]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">Products</h1>
          <p className="text-sm text-ink-soft">{total.toLocaleString()} products</p>
        </div>
        <Link href="/admin/products/new" className={buttonVariants({ size: "sm" })}>
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      <div className="grid gap-3 rounded-3xl border border-ink/8 bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Search products…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
        <Select value={stock} onChange={(event) => setStock(event.target.value)}>
          <option value="">All stock</option>
          <option value="in">In stock</option>
          <option value="low">Low stock (&le; 5)</option>
          <option value="out">Out of stock</option>
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      {error && (
        <p className="rounded-3xl bg-red-50 p-6 text-sm font-semibold text-red-500">
          Could not load products.
        </p>
      )}

      {!products && !error ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16" />
          ))}
        </div>
      ) : products && products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink/15 bg-white p-12 text-center">
          <Package className="mx-auto h-10 w-10 text-ink-soft" />
          <p className="mt-3 font-heading font-bold text-ink">No products found</p>
          <p className="mt-1 text-sm text-ink-soft">Try changing your filters.</p>
        </div>
      ) : products ? (
        <>
          <div className="-mx-4 overflow-x-auto px-4">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-soft">
                  <th className="py-2 pr-4 font-semibold">Product</th>
                  <th className="py-2 pr-4 font-semibold">Category</th>
                  <th className="py-2 pr-4 font-semibold">Price</th>
                  <th className="py-2 pr-4 font-semibold">Stock</th>
                  <th className="py-2 pr-4 font-semibold">Status</th>
                  <th className="py-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-ink/5 hover:bg-cream/40">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt=""
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          )}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="block truncate font-semibold text-ink hover:text-playful-pink"
                          >
                            {product.name}
                          </Link>
                          <span className="text-xs text-ink-soft">
                            {product.slug}
                            {product.isFeatured && (
                              <span className="ml-1 font-semibold text-playful-pink">· Featured</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-ink-soft">{product.categoryName}</td>
                    <td className="py-3 pr-4 font-semibold text-ink">
                      {formatPrice(product.price)}
                      {product.compareAtPrice && (
                        <span className="ml-1 text-xs font-normal text-ink-soft line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge tone={product.stock > 5 ? "lime" : product.stock > 0 ? "sunshine" : "red"}>
                        {product.stock}
                      </Badge>
                      {product.variantCount > 0 && (
                        <span className="ml-1 text-xs text-ink-soft">
                          +{product.variantCount} variants
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge tone={product.isActive ? "lime" : "neutral"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-full p-2 text-ink-soft transition-colors hover:bg-cream hover:text-playful-pink"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleting(product)}
                          className="rounded-full p-2 text-ink-soft transition-colors hover:bg-red-50 hover:text-red-500"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                Previous
              </Button>
              <span className="text-sm font-semibold text-ink-soft">
                Page {page} of {pages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      ) : null}

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete product"
      >
        {deleting && (
          <div className="space-y-4">
            <p className="text-sm text-ink-soft">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-ink">{deleting.name}</span>? This cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={deletingBusy}
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}