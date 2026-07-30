import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import { QUICK_ACTIONS } from "@/constants/dashboardContent";

export default function QuickActions() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading eyebrow="Shortcuts" title="Quick actions" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {QUICK_ACTIONS.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
              whileHover={{ y: -3 }}
            >
              <Link
                to={action.href}
                className="group flex h-full items-start gap-4 rounded-3xl bg-white/70 p-6 shadow-soft ring-1 ring-line transition-shadow duration-200 hover:shadow-lifted"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-moss/10 text-moss">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="font-display text-base font-semibold text-ink">
                    {action.label}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">
                    {action.description}
                  </span>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-soft transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
