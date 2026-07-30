import { axiosClient } from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/types/api.types";
import type {
  ActivityApiRecord,
  ActivityItem,
  ActivityType,
  DashboardStats,
  DashboardStatsApiRecord,
} from "@/types/dashboard.types";

/**
 * ASSUMPTION: Saved Pets, Recommendations, and Adoption Requests aren't wired
 * up on this frontend yet (no savedPetsApi/recommendationsApi/adoptionRequestsApi),
 * so a dedicated dashboard summary contract hasn't been confirmed against the
 * live backend. Assumed contract, mirrored on the aggregate stats + activity
 * feed a "dashboard" endpoint would typically expose:
 *   - GET /dashboard/stats -> { savedPetsCount, recommendationsCount, adoptionRequestsCount }
 *   - GET /dashboard/activity -> array of { id, type, message, createdAt }
 * If the real contract differs, mapDashboardStats() / mapActivityRecord() and
 * the two request paths below are the only places that need to change.
 */

const KNOWN_ACTIVITY_TYPES: ActivityType[] = [
  "PET_SAVED",
  "RECOMMENDATION_GENERATED",
  "ADOPTION_REQUEST_CREATED",
  "ADOPTION_REQUEST_UPDATED",
  "PROFILE_UPDATED",
  "OTHER",
];

function mapDashboardStats(record: DashboardStatsApiRecord): DashboardStats {
  return {
    savedPetsCount: record.savedPetsCount ?? 0,
    recommendationsCount: record.recommendationsCount ?? 0,
    adoptionRequestsCount: record.adoptionRequestsCount ?? 0,
  };
}

function mapActivityRecord(record: ActivityApiRecord): ActivityItem {
  const type = KNOWN_ACTIVITY_TYPES.includes(record.type as ActivityType)
    ? (record.type as ActivityType)
    : "OTHER";

  return {
    id: record.id,
    type,
    message: record.message ?? record.title ?? "Activity update",
    createdAt: record.createdAt,
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await axiosClient.get<ApiSuccessResponse<DashboardStatsApiRecord>>(
    "/dashboard/stats"
  );
  return mapDashboardStats(data.data);
}

export async function fetchRecentActivity(): Promise<ActivityItem[]> {
  const { data } = await axiosClient.get<ApiSuccessResponse<ActivityApiRecord[]>>(
    "/dashboard/activity"
  );
  return data.data.map(mapActivityRecord);
}
