interface SkeletonProps {
  className?: string;
}

/** Base shimmering placeholder block — compose into any loading skeleton. */
export default function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-xl bg-line/70 ${className}`} />;
}
