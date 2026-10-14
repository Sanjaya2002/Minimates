"use client";

export default function StoreLoading() {
  return (
    <div className="container-page space-y-8 py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-64 rounded-[2rem] bg-soft-lilac/40" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 rounded-3xl bg-cream" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-72 rounded-3xl bg-soft-lilac/30" />
          ))}
        </div>
      </div>
    </div>
  );
}