import Container from "@/components/common/Container";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import ProfileSummaryCard from "@/components/dashboard/ProfileSummaryCard";
import StatsOverview from "@/components/dashboard/StatsOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useAppSelector } from "@/app/hooks";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="py-10 sm:py-14">
      <Container className="flex flex-col gap-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WelcomeSection user={user} />
          </div>
          <ProfileSummaryCard user={user} />
        </div>

        <StatsOverview />
        <QuickActions />
        <RecentActivity />
      </Container>
    </div>
  );
}
