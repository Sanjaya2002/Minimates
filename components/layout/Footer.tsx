import Link from "next/link";
import { Aperture, Mail, MapPin, MessageCircle, Phone, ThumbsUp } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { siteConfig, whatsappLink } from "@/lib/config/site";
import { FlowerFaceSvg } from "@/components/doodles/FlowerFaceSvg";
import { StarSvg } from "@/components/doodles/StarSvg";

export interface FooterCategory {
  name: string;
  slug: string;
}

export function Footer({ categories = [] }: { categories?: FooterCategory[] }) {
  return (
    <footer className="relative mt-20 overflow-hidden bg-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-6 w-40 text-lime-green/40"
      >
        <FlowerFaceSvg />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-8 bottom-10 w-16 text-soft-sunshine/50"
      >
        <StarSvg />
      </div>

      <Container className="relative py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              Gentle, playful and safe products for your little ones — thoughtfully
              chosen with love by Minimates.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-white p-2.5 text-ink shadow-soft transition-colors hover:text-playful-pink"
              >
                <ThumbsUp className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-white p-2.5 text-ink shadow-soft transition-colors hover:text-playful-pink"
              >
                <Aperture className="h-4 w-4" />
              </a>
              <a
                href={whatsappLink("Hi Minimates!")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-full bg-white p-2.5 text-ink shadow-soft transition-colors hover:text-playful-pink"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav aria-label="Shop">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
              Shop
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/shop" className="hover:text-playful-pink">
                  All products
                </Link>
              </li>
              {categories.slice(0, 5).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/shop/${category.slug}`}
                    className="hover:text-playful-pink"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
              Company
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/about" className="hover:text-playful-pink">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-playful-pink">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-playful-pink">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-playful-pink">
                  Checkout
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
              Stay in the loop
            </h3>
            <p className="mt-4 text-sm text-ink-soft">
              Tips, new arrivals and exclusive offers for parents.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
            <ul className="mt-6 space-y-2 text-sm text-ink-soft">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-playful-pink" />
                <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-playful-pink">
                  {siteConfig.contactEmail}
                </a>
              </li>
              {siteConfig.contactPhone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-playful-pink" />
                  <a href={`tel:${siteConfig.contactPhone}`} className="hover:text-playful-pink">
                    {siteConfig.contactPhone}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-playful-pink" />
                <span>{siteConfig.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink/10 pt-6 text-xs text-ink-soft sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Made with love for little ones.</p>
        </div>
      </Container>
    </footer>
  );
}
