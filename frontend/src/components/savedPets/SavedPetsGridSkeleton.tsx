import Skeleton from "@/components/common/Skeleton";

interface SavedPetsGridSkeletonProps {
  count?: number;
}

export default function SavedPetsGridSkeleton({ count = 6 }: SavedPetsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-3xl bg-white/60 p-5 shadow-soft ring-1 ring-line"
        >
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
