import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config/site";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Hi Minimates! I'd like to know more about your products.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105 focus-visible:outline-3"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
