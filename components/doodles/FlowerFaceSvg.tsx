import { cn } from "@/lib/utils/cn";

export function FlowerFaceSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
      className={cn("h-auto w-full", className)}
    >
      <g fill="currentColor">
        <ellipse cx="70" cy="26" rx="20" ry="26" />
        <ellipse cx="70" cy="114" rx="20" ry="26" />
        <ellipse cx="26" cy="70" rx="26" ry="20" />
        <ellipse cx="114" cy="70" rx="26" ry="20" />
        <ellipse cx="38" cy="38" rx="20" ry="24" transform="rotate(-45 38 38)" />
        <ellipse cx="102" cy="38" rx="20" ry="24" transform="rotate(45 102 38)" />
        <ellipse cx="38" cy="102" rx="20" ry="24" transform="rotate(45 38 102)" />
        <ellipse cx="102" cy="102" rx="20" ry="24" transform="rotate(-45 102 102)" />
      </g>
      <circle cx="70" cy="70" r="30" fill="#F4D77B" />
      <circle cx="60" cy="64" r="4" fill="#2b2b3a" />
      <circle cx="80" cy="64" r="4" fill="#2b2b3a" />
      <path
        d="M58 80c6 7 18 7 24 0"
        stroke="#2b2b3a"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
