import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface DashboardStatCardProps {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  href: string;
  index?: number;
}

export default function DashboardStatCard({
  label,
  value,
  icon: Icon,
  href,
  index = 0,
}: DashboardStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-white/70 p-6 shadow-soft ring-1 ring-line transition-shadow duration-200 hover:shadow-lifted"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-moss/10 text-moss">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <Link
          to={href}
          aria-label={`View ${label.toLowerCase()}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft opacity-0 transition-opacity duration-200 hover:bg-ink/5 hover:text-ink group-hover:opacity-100"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-mono text-3xl font-semibold text-ink">{value.toLocaleString()}</span>
        <span className="text-sm text-ink-soft">{label}</span>
      </div>
    </motion.div>
  );
}
