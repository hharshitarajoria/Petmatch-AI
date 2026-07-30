import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/constants/landingContent";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const initials = testimonial.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      className="flex flex-col gap-6 rounded-3xl border border-white/40 bg-white/40 p-8 shadow-soft backdrop-blur-lg"
    >
      <Quote className="h-7 w-7 text-gold" strokeWidth={1.5} />

      <blockquote className="flex-1 text-base leading-relaxed text-ink">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moss font-mono text-xs font-medium text-paper ring-2 ring-gold-soft">
          {initials}
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-ink">{testimonial.name}</p>
          <p className="text-xs text-ink-soft">
            {testimonial.role} · {testimonial.city}
          </p>
        </div>
      </figcaption>
    </motion.figure>
  );
}
