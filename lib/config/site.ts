export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Minimates",
  tagline: "Baby & Kids Care",
  description:
    "Minimates is a playful baby and kids care store — gentle, safe products for your little ones, delivered with love.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@minimates.lk",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  address:
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ||
    "Colombo, Sri Lanka",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
  },
} as const;

export function whatsappLink(message?: string): string {
  const number = siteConfig.whatsappNumber.replace(/[^0-9]/g, "");
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
