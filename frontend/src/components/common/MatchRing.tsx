import { useId } from "react";
import { motion } from "framer-motion";

interface MatchRingProps {
  /** Compatibility score, 0–100 (mirrors Recommendation.compatibilityScore). */
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

/**
 * The page's signature element: a radial progress ring that visualizes an
 * AI compatibility score. It appears large in the hero (the "match" the
 * whole product is built around) and again as a small badge on every
 * PetCard, so the motif carries real product meaning rather than
 * decorating the page.
 */
export default function MatchRing({
  percentage,
  size = 96,
  strokeWidth = 8,
  label = "Match",
  className = "",
}: MatchRingProps) {
  const gradientId = useId();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percentage));
  const center = size / 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped}% ${label.toLowerCase()}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-gold)" />
            <stop offset="100%" stopColor="var(--color-leaf)" />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="var(--color-line)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference - (clamped / 100) * circumference }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-semibold text-ink"
          style={{ fontSize: size * 0.24 }}
        >
          {clamped}%
        </span>
        {size >= 80 ? (
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ink-soft">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
