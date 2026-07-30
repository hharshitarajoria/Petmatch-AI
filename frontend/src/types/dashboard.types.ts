/**
 * Raw shape returned by the backend for the dashboard stats endpoint.
 * Fields are optional/nullable defensively — the exact contract hasn't been
 * confirmed against a live backend yet (see ASSUMPTION note in dashboardApi.ts).
 */
export interface DashboardStatsApiRecord {
  savedPetsCount?: number | null;
  recommendationsCount?: number | null;
  adoptionRequestsCount?: number | null;
}

/** Normalized stats used by the UI. */
export interface DashboardStats {
  savedPetsCount: number;
  recommendationsCount: number;
  adoptionRequestsCount: number;
}

export type ActivityType =
  | "PET_SAVED"
  | "RECOMMENDATION_GENERATED"
  | "ADOPTION_REQUEST_CREATED"
  | "ADOPTION_REQUEST_UPDATED"
  | "PROFILE_UPDATED"
  | "OTHER";

/** Raw shape of a single activity entry as returned by the backend. */
export interface ActivityApiRecord {
  id: string;
  type?: ActivityType | string | null;
  message?: string | null;
  title?: string | null;
  createdAt: string;
}

/** Normalized activity feed item used by the UI. */
export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  createdAt: string;
}
