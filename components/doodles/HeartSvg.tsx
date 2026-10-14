import { cn } from "@/lib/utils/cn";

export function HeartSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={cn("h-auto w-full", className)}
    >
      <path
        d="M60 104C24 78 8 58 8 38 8 22 20 10 35 10c10 0 19 5 25 14 6-9 15-14 25-14 15 0 27 12 27 28 0 20-16 40-52 66Z"
        fill="currentColor"
      />
    </svg>
  );
}
