"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Nimali P.",
    role: "Mum of two",
    quote:
      "The gentlest products I've found in Sri Lanka. My baby's skin has never been happier and delivery was super fast!",
    tone: "bg-sky-blue/25",
  },
  {
    name: "Kasun & Dilani",
    role: "First-time parents",
    quote:
      "Minimates made shopping for our newborn so easy. Everything is clearly described and beautifully packaged.",
    tone: "bg-blush-pink/30",
  },
  {
    name: "Amaya R.",
    role: "Mum of a toddler",
    quote:
      "I love the playful design and how carefully the products are chosen. The WhatsApp support is a lovely touch.",
    tone: "bg-soft-pistachio/40",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <motion.figure
          key={testimonial.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          className={`flex h-full flex-col rounded-3xl p-6 shadow-soft ${testimonial.tone}`}
        >
          <Quote className="h-7 w-7 text-playful-pink" />
          <blockquote className="mt-4 flex-1 text-sm text-ink">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-5">
            <div className="flex gap-0.5 text-soft-sunshine">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star key={starIndex} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-2 font-heading text-sm font-bold text-ink">
              {testimonial.name}
            </p>
            <p className="text-xs text-ink-soft">{testimonial.role}</p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
