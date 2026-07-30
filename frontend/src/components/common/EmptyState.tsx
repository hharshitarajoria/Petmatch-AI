import type { ComponentType, ReactNode } from "react";
import { PawPrint } from "lucide-react";

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon = PawPrint,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/50 px-6 py-16 text-center ring-1 ring-line">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-moss/10 text-moss">
        <Icon className="h-6 w-6" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        {description ? <p className="max-w-sm text-sm text-ink-soft">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
