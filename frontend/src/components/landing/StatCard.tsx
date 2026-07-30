import { useEffect, useRef, useState } from "react";
import { animate, useInView, motion } from "framer-motion";
import type { StatItem } from "@/constants/landingContent";

interface StatCardProps {
  stat: StatItem;
  index: number;
}

export default function StatCard({ stat, index }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, stat.value, {
      duration: 1.4,
      delay: index * 0.08,
      ease: "easeOut",
      onUpdate: (value) => setDisplayValue(Math.round(value)),
    });

    return () => controls.stop();
  }, [isInView, stat.value, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
      className="flex flex-col items-center gap-2 rounded-3xl bg-white/5 px-6 py-8 text-center ring-1 ring-paper/10"
    >
      <span className="font-mono text-4xl font-semibold text-paper sm:text-5xl">
        {displayValue.toLocaleString()}
        {stat.suffix}
      </span>
      <span className="text-sm text-paper/70">{stat.label}</span>
    </motion.div>
  );
}
