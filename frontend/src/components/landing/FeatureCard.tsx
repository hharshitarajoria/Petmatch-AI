import { motion } from "framer-motion";
import type { FeatureItem } from "@/constants/landingContent";

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="flex flex-col gap-4 rounded-3xl bg-white/60 p-7 shadow-soft ring-1 ring-line backdrop-blur-sm transition-shadow duration-200 hover:shadow-lifted"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss/10 text-moss">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-ink-soft">{feature.description}</p>
    </motion.div>
  );
}
