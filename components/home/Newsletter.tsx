import { Mail } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { CloudSvg } from "@/components/doodles/CloudSvg";

export function Newsletter() {
  return (
    <Container className="py-14">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-soft-sunshine/70 to-soft-pistachio/70 px-6 py-12 sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-4 top-6 w-24 text-white/60 animate-float"
        >
          <CloudSvg />
        </div>
        <div className="relative mx-auto max-w-xl text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-playful-pink shadow-soft">
            <Mail className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-ink">
            Join the Minimates family
          </h2>
          <p className="mt-3 text-sm text-ink/70">
            Be the first to know about new arrivals, parenting tips and special
            offers — no spam, promise.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </Container>
  );
}
