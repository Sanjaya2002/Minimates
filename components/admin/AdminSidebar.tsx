"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, ShoppingBag, Tags } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <aside className="flex h-14 shrink-0 flex-row items-center justify-between gap-2 border-b border-ink/10 bg-white px-4 lg:h-full lg:w-60 lg:flex-col lg:justify-start lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
      <Link href="/admin" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-playful-pink text-white">
          <Package className="h-4 w-4" />
        </span>
        <span className="font-heading font-extrabold text-ink">Minimates</span>
        <span className="rounded-full bg-sky-blue/30 px-2 py-0.5 text-[10px] font-bold uppercase text-ink-soft">
          Admin
        </span>
      </Link>

      <nav className="flex items-center gap-1 lg:mt-8 lg:w-full lg:flex-col">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-playful-pink/10 text-playful-pink"
                  : "text-ink-soft hover:bg-cream hover:text-ink",
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-red-50 hover:text-red-500"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden lg:inline">Log out</span>
      </button>
    </aside>
  );
}