import { motion } from "framer-motion";
import { Mail, ShieldCheck } from "lucide-react";
import type { AuthUser } from "@/types/user.types";

interface ProfileSummaryCardProps {
  user: AuthUser | null;
}

const ROLE_LABELS: Record<AuthUser["role"], string> = {
  ADOPTER: "Adopter",
  SHELTER: "Shelter",
  ADMIN: "Admin",
};


export default function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";


  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
      className="flex flex-col gap-6 rounded-3xl bg-white/70 p-7 shadow-soft ring-1 ring-line"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-moss/15 font-display text-lg font-bold text-moss-dark ring-2 ring-moss/20">
          {userInitials}
        </div>
        <div className="flex flex-col">
          <span className="font-display text-lg font-semibold text-ink">
            {user?.name ?? "—"}
          </span>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-gold">
            <ShieldCheck className="h-3 w-3" />
            {user ? ROLE_LABELS[user.role] : "—"}
          </span>
        </div>
      </div>

      <dl className="flex flex-col gap-3 border-t border-line pt-5 text-sm">
        <div className="flex items-center gap-3 text-ink-soft">
          <Mail className="h-4 w-4 shrink-0 text-moss" />
          <dt className="sr-only">Email</dt>
          <dd className="truncate">{user?.email ?? "—"}</dd>
        </div>
      </dl>
    </motion.div>
  );
}
