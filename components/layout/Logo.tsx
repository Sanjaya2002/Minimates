import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2", className)}
      aria-label="Minimates home"
    >
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-playful-pink text-white shadow-soft transition-transform group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M12 21C6.5 16.6 3 13.4 3 9.8 3 7 5.2 5 7.8 5c1.7 0 3.3.9 4.2 2.3C12.9 5.9 14.5 5 16.2 5 18.8 5 21 7 21 9.8c0 3.6-3.5 6.8-9 11.2Z" />
        </svg>
      </span>
      <span className="font-heading text-xl font-extrabold tracking-tight text-ink">
        Minimates
      </span>
    </Link>
  );
}
