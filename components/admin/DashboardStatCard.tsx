import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "sky",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  tone?: "sky" | "pink" | "lime" | "sunshine" | "lavender";
}) {
  const tones: Record<string, string> = {
    sky: "bg-sky-blue/30",
    pink: "bg-playful-pink/15",
    lime: "bg-lime-green/25",
    sunshine: "bg-soft-sunshine/30",
    lavender: "bg-soft-lilac/40",
  };

  return (
    <div className="rounded-3xl border border-ink/8 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
          {label}
        </p>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-2xl text-ink",
            tones[tone],
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-heading text-2xl font-extrabold text-ink">{value}</p>
      {hint && (
        <p className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
          <TrendingUp className="h-3 w-3 text-lime-green" /> {hint}
        </p>
      )}
    </div>
  );
}