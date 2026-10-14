import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getAllProductSlugs } from "@/lib/services/products";
import { getAllCategorySlugs } from "@/lib/services/categories";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/shop",
    "/contact",
    "/about",
    "/cart",
    "/checkout",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const [categories, products] = await Promise.allSettled([
    getAllCategorySlugs(),
    getAllProductSlugs(),
  ]);

  const categoryRoutes =
    categories.status === "fulfilled"
      ? categories.value.map(({ slug }) => ({
          url: `${baseUrl}/shop/${slug}`,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }))
      : [];

  const productRoutes =
    products.status === "fulfilled"
      ? products.value.map(({ slug, updatedAt }) => ({
          url: `${baseUrl}/product/${slug}`,
          lastModified: updatedAt,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
      : [];

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}