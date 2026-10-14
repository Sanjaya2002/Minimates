import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-playful-pink">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 font-heading text-3xl font-extrabold text-ink text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-ink-soft">{description}</p>
      )}
    </div>
  );
}
