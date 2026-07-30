import { Heart, ClipboardList, Sparkles } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import DashboardStatCardSkeleton from "@/components/dashboard/DashboardStatCardSkeleton";
import { ROUTES } from "@/constants/routes";

export default function StatsOverview() {
  const statsQuery = {
  isLoading: false,
  isError: false,
  data: {
    savedPetsCount: 0,
    recommendationsCount: 0,
    adoptionRequestsCount: 0,
  },
  refetch: () => {},
};

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading eyebrow="Overview" title="Your activity at a glance" />

      {statsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <DashboardStatCardSkeleton />
          <DashboardStatCardSkeleton />
          <DashboardStatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <DashboardStatCard
            index={0}
            label="Saved Pets"
            value={statsQuery.data?.savedPetsCount ?? 0}
            icon={Heart}
            href={ROUTES.SAVED_PETS}
          />
          <DashboardStatCard
            index={1}
            label="Recommendations"
            value={statsQuery.data?.recommendationsCount ?? 0}
            icon={Sparkles}
            href={ROUTES.RECOMMENDATIONS}
          />
          <DashboardStatCard
            index={2}
            label="Adoption Requests"
            value={statsQuery.data?.adoptionRequestsCount ?? 0}
            icon={ClipboardList}
            href={ROUTES.ADOPTION_REQUESTS}
          />
        </div>
      )}
    </div>
  );
}
