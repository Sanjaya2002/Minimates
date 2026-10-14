"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/buttonStyles";
import { CloudSvg } from "@/components/doodles/CloudSvg";
import { HeartSvg } from "@/components/doodles/HeartSvg";
import { StarSvg } from "@/components/doodles/StarSvg";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-blue to-sky-blue/50">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[6%] top-10 w-24 text-white/70 animate-float"
      >
        <CloudSvg />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-[10%] top-16 w-12 text-playful-pink/70 animate-float-slow"
      >
        <HeartSvg />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-[20%] w-10 text-soft-sunshine/80 animate-float"
      >
        <StarSvg />
      </div>

      <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink backdrop-blur">
            <Sparkles className="h-4 w-4 text-playful-pink" />
            Gentle care for little ones
          </span>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.1] text-ink text-balance sm:text-5xl lg:text-6xl">
            Everything your baby needs to <span className="text-playful-pink">grow&nbsp;happy</span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-ink-soft sm:text-lg">
            Safe, soft and playful baby &amp; kids care essentials — thoughtfully
            chosen so parents can shop with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className={buttonVariants({ size: "lg" })}>
              Shop all products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop/toys-play"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Explore toys
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              ["500+", "Happy families"],
              ["100%", "Baby-safe"],
              ["Free", "Over Rs.10k"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-heading text-2xl font-extrabold text-ink">{value}</dt>
                <dd className="text-xs font-medium text-ink-soft">{label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-white/40 shadow-lift backdrop-blur">
            <Image
              src="/images/hero.svg"
              alt="Playful baby care illustration"
              fill
              priority
              sizes="(max-width: 1024px) 80vw, 480px"
              className="object-contain p-6"
            />
          </div>
        </motion.div>
      </Container>

      <div aria-hidden className="h-10 rounded-t-[3rem] bg-cloud sm:h-14" />
    </section>
  );
}
