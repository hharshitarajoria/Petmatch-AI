import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/api/dashboardApi";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
  });
}
