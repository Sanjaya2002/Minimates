import { cn } from "@/lib/utils/cn";

export type BadgeTone =
  | "sky"
  | "pink"
  | "sunshine"
  | "lavender"
  | "lime"
  | "blush"
  | "neutral"
  | "red";

const tones: Record<BadgeTone, string> = {
  sky: "bg-sky-blue/40 text-ink",
  pink: "bg-playful-pink/90 text-white",
  sunshine: "bg-soft-sunshine text-ink",
  lavender: "bg-sweet-lavender/50 text-ink",
  lime: "bg-lime-green/70 text-ink",
  blush: "bg-blush-pink/70 text-ink",
  neutral: "bg-ink/8 text-ink-soft",
  red: "bg-red-100 text-red-600",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
