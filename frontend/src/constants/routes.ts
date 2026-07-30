/**
 * Centralized route path constants.
 * Import these instead of hardcoding path strings across the app.
 */
export const ROUTES = {
  HOME: "/",

  LOGIN: "/login",
  REGISTER: "/register",

  DASHBOARD: "/dashboard",
  PETS: "/pets",
  PET_DETAILS: "/pets/:petId",
  SAVED_PETS: "/saved-pets",
  RECOMMENDATIONS: "/recommendations",

  ADOPTION_REQUESTS: "/adoption-requests",
  CONVERSATIONS: "/conversations",
  CONVERSATION_DETAILS: "/conversations/:conversationId",

  NOTIFICATIONS: "/notifications",
  REPORTS: "/reports",
  PROFILE: "/profile",

  NOT_FOUND: "*",
} as const;
