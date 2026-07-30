import { motion } from "framer-motion";
import type { StepItem } from "@/constants/landingContent";

interface StepCardProps {
  step: StepItem;
  index: number;
}

export default function StepCard({ step, index }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      className="relative flex flex-col gap-4 rounded-3xl bg-white/60 p-7 shadow-soft ring-1 ring-line"
    >
      <span className="font-mono text-sm font-medium text-gold">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
      <p className="text-sm leading-relaxed text-ink-soft">{step.description}</p>
    </motion.div>
  );
}
