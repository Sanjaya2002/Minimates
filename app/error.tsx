"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-cream/60 px-4 text-center">
          <h1 className="font-heading text-3xl font-extrabold text-ink">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            An unexpected error stopped the page from loading. Try again — if it
            keeps happening, contact us and we&apos;ll sort it out.
          </p>
          <Button size="lg" className="mt-6" onClick={reset}>
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}