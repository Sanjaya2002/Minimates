import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { HeartSvg } from "@/components/doodles/HeartSvg";
import { whatsappLink, siteConfig } from "@/lib/config/site";

export const metadata = {
  title: "Contact us",
  description:
    "Get in touch with Minimates — we'd love to hear from you. Reach us by WhatsApp, email or the contact form.",
};

export default function ContactPage() {
  return (
    <Container className="py-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-playful-pink">
            We&apos;re here to help
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-ink sm:text-4xl">
            Get in touch
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft sm:text-base">
            Questions about a product, an order, or just want to say hi? We usually
            reply within a few hours.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-ink/8 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-heading text-lg font-bold">Send us a message</h2>
            <p className="mt-1 text-sm text-ink-soft">
              We&apos;ll get back to you by email shortly.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-blue to-soft-lilac p-6 shadow-soft">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-4 w-16 text-white/50"
              >
                <HeartSvg />
              </div>
              <h2 className="font-heading text-base font-bold text-ink">
                Chat on WhatsApp
              </h2>
              <p className="mt-2 text-sm text-ink/70">
                Fastest way to reach us — perfect for urgent order questions.
              </p>
              <a
                href={whatsappLink("Hi Minimates! I have a question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-soft transition-transform hover:scale-[1.03]"
              >
                <MessageCircle className="h-4 w-4 text-lime-green" />
                WhatsApp us
              </a>
            </div>

            <div className="rounded-[2rem] border border-ink/8 bg-white p-6 shadow-soft">
              <h2 className="font-heading text-base font-bold">Business info</h2>
              <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-playful-pink" />
                  <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-playful-pink">
                    {siteConfig.contactEmail}
                  </a>
                </li>
                {siteConfig.contactPhone && (
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-playful-pink" />
                    <a href={`tel:${siteConfig.contactPhone}`} className="hover:text-playful-pink">
                      {siteConfig.contactPhone}
                    </a>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-playful-pink" />
                  <span>{siteConfig.address}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}