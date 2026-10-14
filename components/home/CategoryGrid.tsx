"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CategoryDTO } from "@/lib/types";

export function CategoryGrid({ categories }: { categories: CategoryDTO[] }) {
  if (!categories.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Link
            href={`/shop/${category.slug}`}
            className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-3xl border border-ink/8 bg-cream p-5 shadow-soft transition-shadow hover:shadow-lift sm:h-52"
          >
            {category.imageUrl && (
              <Image
                src={category.imageUrl}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
            <div className="relative z-10 flex items-end justify-between gap-2">
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {category.name}
                </h3>
                {typeof category.productCount === "number" && (
                  <p className="text-xs font-medium text-white/80">
                    {category.productCount} products
                  </p>
                )}
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink transition-transform group-hover:-rotate-12">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
