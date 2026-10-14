"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FilterPanel } from "@/components/shop/FilterPanel";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { SORT_OPTIONS } from "@/lib/utils/constants";
import type { CategoryDTO } from "@/lib/types";

export function ShopToolbar({
  categories,
  lockedCategory,
  resultCount,
}: {
  categories: CategoryDTO[];
  lockedCategory?: boolean;
  resultCount: number;
}) {
  const { setParam, get } = useQueryParams();
  const [search, setSearch] = useState(get("q"));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setSearch(get("q"));
  }, [get]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    setParam({ q: search.trim() || null });
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={submitSearch} className="relative w-full sm:max-w-xs" role="search">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="w-full rounded-full border-2 border-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-sky-blue focus:outline-none"
          />
        </form>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>

          <span className="hidden text-sm text-ink-soft lg:inline">
            {resultCount} {resultCount === 1 ? "product" : "products"}
          </span>

          <label className="flex items-center gap-2">
            <span className="sr-only">Sort by</span>
            <select
              value={get("sort") || "newest"}
              onChange={(event) => setParam({ sort: event.target.value })}
              className="cursor-pointer rounded-full border-2 border-ink/10 bg-white py-2.5 pl-4 pr-9 text-sm font-semibold focus:border-sky-blue focus:outline-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235b5b6b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.85rem center",
                appearance: "none",
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[90] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-lift"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 text-ink-soft hover:bg-cream"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel
                categories={categories}
                lockedCategory={lockedCategory}
                onNavigate={() => setMobileOpen(false)}
              />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="mt-6 w-full rounded-full bg-playful-pink py-3 text-sm font-bold text-white"
              >
                Show {resultCount} products
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
