"use client";

import Link from "next/link";
import { HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/buttonStyles";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-soft-lilac/50 text-playful-pink">
        <HeartCrack className="h-8 w-8" />
      </span>
      <h1 className="mt-5 font-heading text-3xl font-extrabold text-ink">404</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
        We couldn&apos;t find that page. It may have been moved, renamed, or just
        doesn&apos;t exist.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className={buttonVariants()}>
          Back to home
        </Link>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    </div>
  );
}