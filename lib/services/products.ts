import { Prisma, type Product } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { toNumber } from "@/lib/utils/format";
import { PRODUCTS_PER_PAGE } from "@/lib/utils/constants";
import type { Paginated, ProductDetail, ProductListItem } from "@/lib/types";
import type { ProductInput } from "@/lib/validation/product";

type ProductWithCategory = Product & {
  category: { name: string; slug: string };
};

export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  ageGroup?: string;
  sort?: string;
  page?: number;
  perPage?: number;
  featuredOnly?: boolean;
  newOnly?: boolean;
  inStockOnly?: boolean;
  includeInactive?: boolean;
}

function orderByFor(sort?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "name-asc":
      return { name: "asc" };
    case "featured":
      return { isFeatured: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

function toListItem(product: ProductWithCategory): ProductListItem {
  const stock = product.stock;
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: toNumber(product.price),
    compareAtPrice: product.compareAtPrice ? toNumber(product.compareAtPrice) : null,
    image: product.images[0] ?? null,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    ageGroup: product.ageGroup,
    stock,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    inStock: stock > 0,
  };
}

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  if (!filters.includeInactive) where.isActive = true;

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.categorySlug) where.category = { slug: filters.categorySlug };
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.ageGroup) where.ageGroup = filters.ageGroup;
  if (filters.featuredOnly) where.isFeatured = true;
  if (filters.newOnly) where.isNew = true;
  if (filters.inStockOnly) where.stock = { gt: 0 };

  if (filters.minPrice != null || filters.maxPrice != null) {
    where.price = {
      ...(filters.minPrice != null ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice != null ? { lte: filters.maxPrice } : {}),
    };
  }
  return where;
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Paginated<ProductListItem>> {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.min(60, Math.max(1, filters.perPage ?? PRODUCTS_PER_PAGE));
  const where = buildWhere(filters);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: orderByFor(filters.sort),
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map(toListItem),
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: { select: { name: true, slug: true } }, variants: true },
  });
  if (!product) return null;

  return {
    ...toListItem(product),
    description: product.description,
    images: product.images,
    categoryId: product.categoryId,
    isActive: product.isActive,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      size: variant.size,
      color: variant.color,
      stock: variant.stock,
      priceOverride:
        variant.priceOverride != null ? toNumber(variant.priceOverride) : null,
    })),
  };
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  take = 4,
): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: productId } },
    orderBy: { createdAt: "desc" },
    take,
    include: { category: { select: { name: true, slug: true } } },
  });
  return products.map(toListItem);
}

export async function getFeaturedProducts(take = 8): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take,
    include: { category: { select: { name: true, slug: true } } },
  });
  return products.map(toListItem);
}

export async function getNewArrivals(take = 8): Promise<ProductListItem[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, isNew: true },
    orderBy: { createdAt: "desc" },
    take,
    include: { category: { select: { name: true, slug: true } } },
  });
  return products.map(toListItem);
}

export async function getAllProductSlugs(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  return prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export interface AdminProductFilters {
  search?: string;
  categoryId?: string;
  stockFilter?: "in" | "low" | "out";
  status?: "active" | "inactive";
  page?: number;
  perPage?: number;
}

export async function getAdminProducts(filters: AdminProductFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.min(100, Math.max(1, filters.perPage ?? 20));

  const where: Prisma.ProductWhereInput = {};
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { slug: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.status === "active") where.isActive = true;
  if (filters.status === "inactive") where.isActive = false;
  if (filters.stockFilter === "in") where.stock = { gt: 0 };
  if (filters.stockFilter === "out") where.stock = { lte: 0 };
  if (filters.stockFilter === "low") where.stock = { gt: 0, lte: 10 };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: { select: { name: true, slug: true } }, variants: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: items.map((product) => ({
      ...toListItem(product),
      isActive: product.isActive,
      variantCount: product.variants.length,
    })),
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
}

export async function createProduct(input: ProductInput) {
  const { variants, compareAtPrice, ...rest } = input;
  return prisma.product.create({
    data: {
      name: rest.name,
      slug: rest.slug,
      description: rest.description || null,
      price: new Prisma.Decimal(rest.price),
      compareAtPrice:
        compareAtPrice != null ? new Prisma.Decimal(compareAtPrice) : null,
      categoryId: rest.categoryId,
      ageGroup: rest.ageGroup || null,
      stock: rest.stock,
      images: rest.images,
      isFeatured: rest.isFeatured,
      isNew: rest.isNew,
      isActive: rest.isActive,
      variants: {
        create: variants.map((variant) => ({
          size: variant.size || null,
          color: variant.color || null,
          stock: variant.stock,
          priceOverride:
            variant.priceOverride != null
              ? new Prisma.Decimal(variant.priceOverride)
              : null,
        })),
      },
    },
    include: { variants: true },
  });
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const { variants, compareAtPrice, ...rest } = input;

  return prisma.$transaction(async (tx) => {
    if (variants) {
      await tx.productVariant.deleteMany({ where: { productId: id } });
    }
    return tx.product.update({
      where: { id },
      data: {
        ...(rest.name !== undefined ? { name: rest.name } : {}),
        ...(rest.slug !== undefined ? { slug: rest.slug } : {}),
        ...(rest.description !== undefined
          ? { description: rest.description || null }
          : {}),
        ...(rest.price !== undefined ? { price: new Prisma.Decimal(rest.price) } : {}),
        ...(compareAtPrice !== undefined
          ? {
              compareAtPrice:
                compareAtPrice != null ? new Prisma.Decimal(compareAtPrice) : null,
            }
          : {}),
        ...(rest.categoryId !== undefined ? { categoryId: rest.categoryId } : {}),
        ...(rest.ageGroup !== undefined ? { ageGroup: rest.ageGroup || null } : {}),
        ...(rest.stock !== undefined ? { stock: rest.stock } : {}),
        ...(rest.images !== undefined ? { images: rest.images } : {}),
        ...(rest.isFeatured !== undefined ? { isFeatured: rest.isFeatured } : {}),
        ...(rest.isNew !== undefined ? { isNew: rest.isNew } : {}),
        ...(rest.isActive !== undefined ? { isActive: rest.isActive } : {}),
        ...(variants
          ? {
              variants: {
                create: variants.map((variant) => ({
                  size: variant.size || null,
                  color: variant.color || null,
                  stock: variant.stock,
                  priceOverride:
                    variant.priceOverride != null
                      ? new Prisma.Decimal(variant.priceOverride)
                      : null,
                })),
              },
            }
          : {}),
      },
      include: { variants: true },
    });
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

export async function getLowStockProducts(threshold = 10, take = 8) {
  const products = await prisma.product.findMany({
    where: { isActive: true, stock: { lte: threshold } },
    orderBy: { stock: "asc" },
    take,
    include: { category: { select: { name: true, slug: true } } },
  });
  return products.map(toListItem);
}
