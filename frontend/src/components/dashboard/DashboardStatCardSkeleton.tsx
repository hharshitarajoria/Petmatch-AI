import Skeleton from "@/components/common/Skeleton";

export default function DashboardStatCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white/70 p-6 shadow-soft ring-1 ring-line">
      <Skeleton className="h-11 w-11 rounded-2xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
