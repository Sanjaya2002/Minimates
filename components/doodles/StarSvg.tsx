import { cn } from "@/lib/utils/cn";

export function StarSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={cn("h-auto w-full", className)}
    >
      <path
        d="M60 8l15 34 37 4-27 25 8 36-33-19-33 19 8-36L8 46l37-4 15-34Z"
        fill="currentColor"
      />
    </svg>
  );
}
