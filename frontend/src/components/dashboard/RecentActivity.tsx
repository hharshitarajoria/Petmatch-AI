import { motion } from "framer-motion";
import { ClipboardList, Heart, History, Sparkles, UserCog } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/common/Skeleton";
import type { ActivityItem, ActivityType } from "@/types/dashboard.types";

const ACTIVITY_ICONS: Record<ActivityType, typeof Heart> = {
  PET_SAVED: Heart,
  RECOMMENDATION_GENERATED: Sparkles,
  ADOPTION_REQUEST_CREATED: ClipboardList,
  ADOPTION_REQUEST_UPDATED: ClipboardList,
  PROFILE_UPDATED: UserCog,
  OTHER: History,
};

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ActivityRow({ item, index }: { item: ActivityItem; index: number }) {
  const Icon = ACTIVITY_ICONS[item.type];

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.04 }}
      className="flex items-center gap-4 py-4"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-moss/10 text-moss">
        <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
      </span>
      <p className="flex-1 text-sm text-ink">{item.message}</p>
      <span className="shrink-0 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
        {formatRelativeTime(item.createdAt)}
      </span>
    </motion.li>
  );
}

export default function RecentActivity() {
 const activityQuery: {
  isLoading: boolean;
  isError: boolean;
  data: ActivityItem[];
} = {
  isLoading: false,
  isError: false,
  data: [],
};

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading eyebrow="Timeline" title="Recent activity" />

      {activityQuery.isLoading ? (
        <div className="flex flex-col divide-y divide-line rounded-3xl bg-white/70 px-6 shadow-soft ring-1 ring-line">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 py-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      ) : activityQuery.data && activityQuery.data.length > 0 ? (
        <ul className="flex flex-col divide-y divide-line rounded-3xl bg-white/70 px-6 shadow-soft ring-1 ring-line">
          {activityQuery.data.map((item, index) => (
            <ActivityRow key={item.id} item={item} index={index} />
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={History}
          title="No recent activity yet"
          description="Once you save pets, get recommendations, or send adoption requests, you'll see it show up here."
        />
      )}
    </div>
  );
}
