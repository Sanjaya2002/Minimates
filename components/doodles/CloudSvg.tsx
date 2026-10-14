import { cn } from "@/lib/utils/cn";

export function CloudSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      aria-hidden="true"
      className={cn("h-auto w-full", className)}
    >
      <path
        d="M46 96c-19 0-34-15-34-33S27 30 46 30c6-15 21-25 38-25 20 0 37 13 42 31 16 2 28 15 28 31 0 17-14 29-32 29H46Z"
        fill="currentColor"
      />
      <circle cx="118" cy="60" r="4" fill="#2b2b3a" opacity="0.35" />
      <circle cx="88" cy="60" r="4" fill="#2b2b3a" opacity="0.35" />
      <path
        d="M92 76c8 8 18 8 26 0"
        stroke="#2b2b3a"
        strokeOpacity="0.35"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
