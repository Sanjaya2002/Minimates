import { cn } from "@/lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export const buttonBase =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] whitespace-nowrap";

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-playful-pink text-white shadow-soft hover:bg-playful-pink-dark hover:shadow-lift",
  secondary:
    "bg-sky-blue text-ink shadow-soft hover:bg-sky-blue-dark hover:shadow-lift",
  accent:
    "bg-soft-sunshine text-ink shadow-soft hover:brightness-95 hover:shadow-lift",
  outline:
    "border-2 border-ink/15 bg-white/70 text-ink hover:border-playful-pink hover:text-playful-pink backdrop-blur",
  ghost: "text-ink hover:bg-soft-lilac/40",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-soft",
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(buttonBase, buttonVariantStyles[variant], buttonSizes[size], className);
}