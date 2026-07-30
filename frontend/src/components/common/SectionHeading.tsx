import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "ink" | "paper";
  className?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Every section opens with the same eyebrow/title/subtitle rhythm so the
 * page reads as one system rather than independently designed blocks.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "ink",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const eyebrowTone = tone === "paper" ? "text-gold-soft" : "text-moss";
  const titleTone = tone === "paper" ? "text-paper" : "text-ink";
  const subtitleTone = tone === "paper" ? "text-paper/70" : "text-ink-soft";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={fadeUp}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex max-w-2xl flex-col gap-3 ${alignClass} ${className}`}
    >
      <span className={`font-mono text-xs font-medium uppercase tracking-[0.2em] ${eyebrowTone}`}>
        {eyebrow}
      </span>
      <h2 className={`font-display text-3xl font-semibold leading-tight sm:text-4xl ${titleTone}`}>
        {title}
      </h2>
      {subtitle ? (
        <p className={`text-lg leading-relaxed ${subtitleTone}`}>{subtitle}</p>
      ) : null}
    </motion.div>
  );
}
