import { AlertTriangle, RotateCw } from "lucide-react";
import Button from "@/components/common/Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this right now. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/50 px-6 py-16 text-center ring-1 ring-line">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        <p className="max-w-sm text-sm text-ink-soft">{description}</p>
      </div>
      {onRetry ? (
        <Button
          variant="ghost"
          onClick={onRetry}
          className="ring-1 ring-line"
          icon={<RotateCw className="h-4 w-4" />}
        >
          Try again
        </Button>
      ) : null}
    </div>
  );
}
