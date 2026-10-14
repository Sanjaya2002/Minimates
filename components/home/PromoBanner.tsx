import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { HeartSvg } from "@/components/doodles/HeartSvg";
import { StarSvg } from "@/components/doodles/StarSvg";

export function PromoBanner() {
  return (
    <Container className="py-14">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blush-pink to-soft-lilac px-6 py-12 sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 w-32 text-white/40 animate-float"
        >
          <HeartSvg />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-4 left-[45%] w-12 text-soft-sunshine/70 animate-float-slow"
        >
          <StarSvg />
        </div>
        <div className="relative max-w-2xl">
          <span className="inline-block rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-playful-pink">
            Limited time offer
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-ink text-balance sm:text-4xl">
            Get 10% off your first order
          </h2>
          <p className="mt-3 max-w-xl text-base text-ink/70">
            Use code <strong className="font-extrabold text-ink">WELCOME10</strong> at
            checkout and give your little one the very best start.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/shop" className={buttonVariants({ size: "lg" })}>
              Shop the collection
            </Link>
            <Link
              href="/about"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Why Minimates?
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
