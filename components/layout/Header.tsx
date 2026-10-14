"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { NAV_LINKS } from "@/lib/utils/constants";
import { siteConfig, whatsappLink } from "@/lib/config/site";
import { useCart } from "@/lib/cart/CartContext";
import { cn } from "@/lib/utils/cn";

export interface HeaderCategory {
  name: string;
  slug: string;
}

export function Header({ categories = [] }: { categories?: HeaderCategory[] }) {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="bg-sky-blue/30 text-center text-xs font-semibold text-ink">
        <Container className="flex items-center justify-center gap-2 py-1.5">
          <span>Free delivery on orders over Rs. 10,000</span>
          <span aria-hidden className="hidden sm:inline">
            •
          </span>
          <a
            href={whatsappLink("Hi Minimates! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 hover:text-playful-pink sm:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Chat with us
          </a>
        </Container>
      </div>

      <header className="sticky top-0 z-50 border-b border-ink/8 bg-white/85 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="-ml-2 rounded-full p-2 text-ink transition-colors hover:bg-cream lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Logo />
          </div>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            <NavItem href="/" label="Home" active={pathname === "/"} />
            <NavItem href="/shop" label="Shop" active={pathname.startsWith("/shop")} />
            {categories.slice(0, 4).map((category) => (
              <NavItem
                key={category.slug}
                href={`/shop/${category.slug}`}
                label={category.name}
                active={pathname === `/shop/${category.slug}`}
              />
            ))}
            <NavItem href="/about" label="About" active={pathname === "/about"} />
            <NavItem href="/contact" label="Contact" active={pathname === "/contact"} />
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/shop"
              className="rounded-full p-2.5 text-ink transition-colors hover:bg-cream"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </Link>
            <a
              href={whatsappLink("Hi Minimates!")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full p-2.5 text-ink transition-colors hover:bg-cream sm:inline-flex"
              aria-label="WhatsApp us"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={openCart}
              className="relative rounded-full p-2.5 text-ink transition-colors hover:bg-cream"
              aria-label={`Open cart, ${itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-playful-pink px-1 text-[10px] font-bold text-white"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-white p-6 shadow-lift"
              aria-label="Mobile"
            >
              <div className="mb-6 flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 text-ink hover:bg-cream"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-base font-semibold transition-colors",
                      pathname === link.href
                        ? "bg-playful-pink/10 text-playful-pink"
                        : "text-ink hover:bg-cream",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {categories.length > 0 && (
                  <p className="mt-4 px-4 text-xs font-bold uppercase tracking-wide text-ink-soft">
                    Categories
                  </p>
                )}
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/shop/${category.slug}`}
                    className="rounded-2xl px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <a
                href={whatsappLink("Hi Minimates!")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-lime-green/40 px-4 py-3 text-sm font-bold text-ink"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
              <p className="mt-6 text-xs text-ink-soft">{siteConfig.contactEmail}</p>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
        active ? "text-playful-pink" : "text-ink hover:bg-cream",
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-playful-pink"
        />
      )}
    </Link>
  );
}
