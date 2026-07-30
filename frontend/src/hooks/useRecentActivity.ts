import { useQuery } from "@tanstack/react-query";
import { fetchRecentActivity } from "@/api/dashboardApi";

export function useRecentActivity() {
  return useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: fetchRecentActivity,
  });
}
