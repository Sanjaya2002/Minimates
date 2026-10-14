"use client";

import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { AGE_GROUPS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import type { CategoryDTO } from "@/lib/types";

export function FilterPanel({
  categories,
  lockedCategory,
  onNavigate,
}: {
  categories: CategoryDTO[];
  lockedCategory?: boolean;
  onNavigate?: () => void;
}) {
  const { setParam, get, clearAll, searchParams } = useQueryParams();

  const activeCategory = get("category");
  const activeAge = get("age");
  const minPrice = get("minPrice");
  const maxPrice = get("maxPrice");
  const inStock = get("inStock") === "1";

  function update(updates: Record<string, string | number | null>) {
    setParam(updates);
    onNavigate?.();
  }

  const hasFilters =
    Boolean(activeCategory || activeAge || minPrice || maxPrice || inStock) ||
    searchParams.has("q");

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">Filters</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              clearAll();
              onNavigate?.();
            }}
            className="text-xs font-semibold text-playful-pink hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {!lockedCategory && (
        <FilterGroup title="Category">
          <div className="space-y-1.5">
            <FilterRadio
              label="All categories"
              checked={!activeCategory}
              onChange={() => update({ category: null })}
            />
            {categories.map((category) => (
              <FilterRadio
                key={category.id}
                label={category.name}
                checked={activeCategory === category.slug}
                onChange={() => update({ category: category.slug })}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Age group">
        <div className="space-y-1.5">
          <FilterRadio
            label="Any age"
            checked={!activeAge}
            onChange={() => update({ age: null })}
          />
          {AGE_GROUPS.map((group) => (
            <FilterRadio
              key={group.value}
              label={group.label}
              checked={activeAge === group.value}
              onChange={() => update({ age: group.value })}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price (Rs.)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(event) => update({ minPrice: event.target.value || null })}
            className="w-full rounded-xl border-2 border-ink/10 bg-white px-3 py-2 text-sm focus:border-sky-blue focus:outline-none"
            aria-label="Minimum price"
          />
          <span className="text-ink-soft">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(event) => update({ maxPrice: event.target.value || null })}
            className="w-full rounded-xl border-2 border-ink/10 bg-white px-3 py-2 text-sm focus:border-sky-blue focus:outline-none"
            aria-label="Maximum price"
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(event) => update({ inStock: event.target.checked ? "1" : null })}
            className="h-4 w-4 rounded border-ink/20 accent-playful-pink"
          />
          <span className="font-medium text-ink">In stock only</span>
        </label>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
          checked ? "border-playful-pink" : "border-ink/20",
        )}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-playful-pink" />}
      </span>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="font-medium text-ink">{label}</span>
    </label>
  );
}
