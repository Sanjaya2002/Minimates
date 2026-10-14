import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { CloudSvg } from "@/components/doodles/CloudSvg";
import { FlowerFaceSvg } from "@/components/doodles/FlowerFaceSvg";
import { StarSvg } from "@/components/doodles/StarSvg";

export const metadata = {
  title: "About us",
  description:
    "Minimates is a playful baby & kids care store built around safe, gentle products and happy parents.",
};

const values = [
  {
    emoji: "🌱",
    title: "Gentle & safe",
    text: "Every product is checked for safety and gentleness before it earns a place on our shelves.",
  },
  {
    emoji: "💛",
    title: "Parent-approved",
    text: "We listen to real parents and only stock what families genuinely love and recommend.",
  },
  {
    emoji: "📦",
    title: "Delivered with love",
    text: "Beautiful packaging and fast, careful delivery across the island.",
  },
  {
    emoji: "🤝",
    title: "Here for you",
    text: "Real humans on WhatsApp and email, ready to help before, during and after your order.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-soft-pistachio to-sky-blue/70">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[8%] top-8 w-20 text-white/60 animate-float"
        >
          <CloudSvg />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute right-[10%] bottom-8 w-12 text-soft-sunshine/80 animate-float-slow"
        >
          <StarSvg />
        </div>
        <Container className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-playful-pink">
              Our story
            </p>
            <h1 className="mt-2 font-heading text-4xl font-extrabold text-ink text-balance sm:text-5xl">
              Caring for little ones, and the grown-ups who love them.
            </h1>
            <p className="mt-5 text-base text-ink/80 sm:text-lg">
              Minimates started with a very simple belief: finding safe, gentle and
              genuinely lovely things for your baby shouldn&apos;t be stressful. So we
              built a store that feels as playful as childhood itself.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-ink">
              Why parents choose Minimates
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft"
                >
                  <span className="text-3xl">{value.emoji}</span>
                  <h3 className="mt-3 font-heading text-base font-bold text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-soft">{value.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-cream p-8 shadow-soft">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -right-6 w-36 text-sweet-lavender/50"
              >
                <FlowerFaceSvg />
              </div>
              <blockquote className="relative">
                <p className="font-heading text-xl font-bold leading-relaxed text-ink">
                  “We&apos;re not just selling baby products — we&apos;re part of your
                  family&apos;s story, from first bath to first friend.”
                </p>
                <footer className="mt-4 text-sm text-ink-soft">
                  — The Minimates team
                </footer>
              </blockquote>
            </div>

            <div className="mt-8 rounded-[2.5rem] bg-gradient-to-br from-blush-pink to-soft-lilac p-8 shadow-soft">
              <h2 className="font-heading text-2xl font-extrabold text-ink">
                Come say hi!
              </h2>
              <p className="mt-3 text-sm text-ink/80">
                Browse the collection or ask us anything — we&apos;d love to meet you.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/shop" className={buttonVariants()}>
                  Shop now
                </Link>
                <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}