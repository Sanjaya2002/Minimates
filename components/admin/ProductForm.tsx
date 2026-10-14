"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { AGE_GROUPS } from "@/lib/utils/constants";
import { slugify } from "@/lib/utils/slug";
import type { CategoryDTO } from "@/lib/types";

interface VariantRow {
  size: string;
  color: string;
  stock: string;
  priceOverride: string;
  id?: string;
}

interface FormValues {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  ageGroup: string;
  stock: string;
  images: string[];
  imagesUrlInput: string;
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  variants: VariantRow[];
}

const emptyForm: FormValues = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compareAtPrice: "",
  categoryId: "",
  ageGroup: "",
  stock: "0",
  images: [],
  imagesUrlInput: "",
  isFeatured: false,
  isNew: false,
  isActive: true,
  variants: [],
};

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryDTO[];
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    compareAtPrice: number | null;
    categoryId: string;
    ageGroup: string | null;
    stock: number;
    images: string[];
    isFeatured: boolean;
    isNew: boolean;
    isActive: boolean;
    variants: {
      id: string;
      size: string | null;
      color: string | null;
      stock: number;
      priceOverride: number | null;
    }[];
  };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<FormValues>(() =>
    product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          price: String(product.price),
          compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : "",
          categoryId: product.categoryId,
          ageGroup: product.ageGroup ?? "",
          stock: String(product.stock),
          images: product.images,
          imagesUrlInput: "",
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          isActive: product.isActive,
          variants: product.variants.map((variant) => ({
            id: variant.id,
            size: variant.size ?? "",
            color: variant.color ?? "",
            stock: String(variant.stock),
            priceOverride: variant.priceOverride != null ? String(variant.priceOverride) : "",
          })),
        }
      : emptyForm,
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const defaultCategory = useMemo(() => categories[0]?.id ?? "", [categories]);

  useEffect(() => {
    if (!form.categoryId && defaultCategory) {
      setForm((current) => ({ ...current, categoryId: defaultCategory }));
    }
  }, [defaultCategory, form.categoryId]);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key as string]) setErrors((current) => ({ ...current, [key]: "" }));
  }

  function handleName(name: string) {
    set("name", name);
    if (!product) set("slug", slugify(name));
  }

  function addImage(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;
    set("images", [...form.images, trimmed]);
  }

  function removeImage(index: number) {
    set("images", form.images.filter((_, i) => i !== index));
  }

  async function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error);
      addImage(json.data.url);
      toast("Image uploaded", "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handleVariantChange(index: number, key: keyof VariantRow, value: string) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, i) =>
        i === index ? { ...variant, [key]: value } : variant,
      ),
    }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Product name is required";
    if (!form.slug.trim()) next.slug = "Slug is required";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      next.slug = "Lowercase letters, numbers and hyphens only";
    }
    if (form.price === "" || Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
      next.price = "Enter a valid price";
    }
    if (!form.categoryId) next.categoryId = "Choose a category";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) {
      toast("Please check the highlighted fields", "error");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      categoryId: form.categoryId,
      ageGroup: form.ageGroup || null,
      stock: Number(form.stock) || 0,
      images: form.images,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isActive: form.isActive,
      variants: form.variants
        .filter((variant) => variant.size || variant.color)
        .map((variant) => ({
          id: variant.id,
          size: variant.size || null,
          color: variant.color || null,
          stock: Number(variant.stock) || 0,
          priceOverride: variant.priceOverride ? Number(variant.priceOverride) : null,
        })),
    };

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const response = await fetch(url, {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error);

      toast(product ? "Product updated" : "Product created", "success");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not save product", "error");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-4 rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-base font-bold text-ink">Basic information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Product name"
            name="name"
            required
            value={form.name}
            onChange={(event) => handleName(event.target.value)}
            error={errors.name}
          />
          <Input
            label="Slug"
            name="slug"
            required
            value={form.slug}
            onChange={(event) => set("slug", event.target.value)}
            error={errors.slug}
            hint="Used in the product URL."
          />
        </div>
        <Textarea
          label="Description"
          name="description"
          rows={4}
          value={form.description}
          onChange={(event) => set("description", event.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Price (Rs.)"
            name="price"
            type="number"
            min={0}
            step="0.01"
            required
            value={form.price}
            onChange={(event) => set("price", event.target.value)}
            error={errors.price}
          />
          <Input
            label="Compare-at price (Rs.)"
            name="compareAtPrice"
            type="number"
            min={0}
            step="0.01"
            value={form.compareAtPrice}
            onChange={(event) => set("compareAtPrice", event.target.value)}
            hint="Shows a strikethrough discount."
          />
          <Input
            label="Stock"
            name="stock"
            type="number"
            min={0}
            value={form.stock}
            onChange={(event) => set("stock", event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            name="categoryId"
            required
            value={form.categoryId}
            onChange={(event) => set("categoryId", event.target.value)}
            error={errors.categoryId}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select
            label="Age group"
            name="ageGroup"
            value={form.ageGroup}
            onChange={(event) => set("ageGroup", event.target.value)}
          >
            <option value="">No specific age</option>
            {AGE_GROUPS.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap gap-5 pt-1">
          <Toggle
            checked={form.isFeatured}
            onChange={(checked) => set("isFeatured", checked)}
            label="Featured"
          />
          <Toggle
            checked={form.isNew}
            onChange={(checked) => set("isNew", checked)}
            label="New"
          />
          <Toggle
            checked={form.isActive}
            onChange={(checked) => set("isActive", checked)}
            label="Active"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-base font-bold text-ink">Images</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {form.images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative h-24 w-24 overflow-hidden rounded-2xl border border-ink/10 bg-cream">
              <Image src={image} alt="" fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                aria-label="Remove image"
                className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-500 shadow"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 gap-2">
            <Input
              label="Add image URL"
              name="imageUrl"
              value={form.imagesUrlInput ?? ""}
              onChange={(event) =>
                event.target.name === "imageUrl" &&
                setForm((current) => ({ ...current, imagesUrlInput: event.target.value }))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const input = event.currentTarget as HTMLInputElement;
                  addImage(input.value);
                  input.value = "";
                  setForm((current) => ({ ...current, imagesUrlInput: "" }));
                }
              }}
              placeholder="https://…"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-6"
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>('input[name="imageUrl"]');
                if (input) {
                  addImage(input.value);
                  input.value = "";
                  setForm((current) => ({ ...current, imagesUrlInput: "" }));
                }
              }}
            >
              <ImagePlus className="h-4 w-4" /> Add
            </Button>
          </div>
          <label className="mt-6 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink/10 bg-white px-5 text-sm font-semibold">
            {uploading ? "Uploading…" : <><Upload className="h-4 w-4" /> Upload</>}
            <input type="file" accept="image/*" className="hidden" onChange={uploadFile} disabled={uploading} />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-bold text-ink">Variants</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              set("variants", [...form.variants, { size: "", color: "", stock: "0", priceOverride: "" }])
            }
          >
            <Plus className="h-4 w-4" /> Add variant
          </Button>
        </div>
        <p className="mt-1 text-xs text-ink-soft">
          Variants track their own stock (e.g. sizes, colours).
        </p>
        {form.variants.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 lg:grid-cols-[1fr_1fr_110px_130px_auto]">
              <span className="text-xs font-bold uppercase text-ink-soft">Size</span>
              <span className="text-xs font-bold uppercase text-ink-soft">Colour</span>
              <span className="text-xs font-bold uppercase text-ink-soft">Stock</span>
              <span className="text-xs font-bold uppercase text-ink-soft">Price override</span>
              <span />
            </div>
            {form.variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-2 rounded-2xl bg-cream/50 p-3 sm:grid-cols-4"
              >
                <input
                  placeholder="S"
                  aria-label={`Variant ${index + 1} size`}
                  value={variant.size}
                  onChange={(event) => handleVariantChange(index, "size", event.target.value)}
                  className="rounded-xl border-2 border-ink/10 bg-white px-3 py-2 text-sm focus:border-sky-blue focus:outline-none"
                />
                <input
                  placeholder="Blue"
                  aria-label={`Variant ${index + 1} colour`}
                  value={variant.color}
                  onChange={(event) => handleVariantChange(index, "color", event.target.value)}
                  className="rounded-xl border-2 border-ink/10 bg-white px-3 py-2 text-sm focus:border-sky-blue focus:outline-none"
                />
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  aria-label={`Variant ${index + 1} stock`}
                  value={variant.stock}
                  onChange={(event) => handleVariantChange(index, "stock", event.target.value)}
                  className="rounded-xl border-2 border-ink/10 bg-white px-3 py-2 text-sm focus:border-sky-blue focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Optional"
                    aria-label={`Variant ${index + 1} price override`}
                    value={variant.priceOverride}
                    onChange={(event) => handleVariantChange(index, "priceOverride", event.target.value)}
                    className="w-full rounded-xl border-2 border-ink/10 bg-white px-3 py-2 text-sm focus:border-sky-blue focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => set("variants", form.variants.filter((_, i) => i !== index))}
                    aria-label="Remove variant"
                    className="shrink-0 rounded-full p-2 text-red-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" loading={saving}>
          {product ? "Save changes" : "Create product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-playful-pink"
      />
      {label}
    </label>
  );
}