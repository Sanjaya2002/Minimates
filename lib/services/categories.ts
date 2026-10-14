import { prisma } from "@/lib/db/prisma";
import { ConflictError } from "@/lib/errors";
import type { CategoryDTO } from "@/lib/types";
import type { CategoryInput } from "@/lib/validation/category";

export async function getCategories(
  withCounts = false,
): Promise<CategoryDTO[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: withCounts
      ? { _count: { select: { products: { where: { isActive: true } } } } }
      : undefined,
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    productCount: withCounts
      ? (category as unknown as { _count: { products: number } })._count.products
      : undefined,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return null;
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
  };
}

export async function getCategoryById(id: string): Promise<CategoryDTO | null> {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return null;
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
  };
}

export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
  return prisma.category.findMany({ select: { slug: true } });
}

export async function createCategory(input: CategoryInput) {
  return prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      imageUrl: input.imageUrl || null,
    },
  });
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  return prisma.category.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined
        ? { description: input.description || null }
        : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl || null } : {}),
    },
  });
}

export async function deleteCategory(id: string) {
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new ConflictError(
      `This category still has ${productCount} product(s). Reassign them before deleting.`,
    );
  }
  return prisma.category.delete({ where: { id } });
}
