import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().trim().max(40).optional().or(z.literal("")),
  color: z.string().trim().max(40).optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0).max(1_000_000).default(0),
  priceOverride: z.coerce.number().min(0).nullable().optional(),
});

export const productBaseSchema = z.object({
  name: z.string().trim().min(2, "Product name is required").max(160),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, hyphenated"),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be zero or more"),
  compareAtPrice: z.coerce.number().min(0).nullable().optional(),
  categoryId: z.string().min(1, "Please choose a category"),
  ageGroup: z.string().trim().max(40).optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0).max(1_000_000).default(0),
  images: z.array(z.string().trim().min(1)).max(10).default([]),
  isFeatured: z.coerce.boolean().default(false),
  isNew: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
  variants: z.array(variantSchema).max(50).default([]),
});

export const productCreateSchema = productBaseSchema;
export const productUpdateSchema = productBaseSchema.partial();

export type ProductInput = z.infer<typeof productBaseSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
