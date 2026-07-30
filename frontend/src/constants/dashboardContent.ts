import type { ComponentType } from "react";
import {
  Bell,
  ClipboardList,
  FileText,
  Heart,
  LayoutDashboard,
  MessageCircle,
  PawPrint,
  Sparkles,
  UserCog,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}

/** Cards shown in the Dashboard Home "Quick Actions" section. */
export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Browse Pets",
    description: "Explore every pet currently listed by verified shelters.",
    href: ROUTES.PETS,
    icon: PawPrint,
  },
  {
    label: "Saved Pets",
    description: "Revisit the pets you've bookmarked for later.",
    href: ROUTES.SAVED_PETS,
    icon: Heart,
  },
  {
    label: "Recommendations",
    description: "See the pets our AI thinks are a great fit for you.",
    href: ROUTES.RECOMMENDATIONS,
    icon: Sparkles,
  },
  {
    label: "Edit Profile",
    description: "Keep your account details and preferences up to date.",
    href: ROUTES.PROFILE,
    icon: UserCog,
  },
];

export interface DashboardNavLink {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}

/** Links shown in the persistent dashboard sidebar/mobile nav. */
export const DASHBOARD_NAV_LINKS: DashboardNavLink[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Saved Pets", href: ROUTES.SAVED_PETS, icon: Heart },
  { label: "Recommendations", href: ROUTES.RECOMMENDATIONS, icon: Sparkles },
  { label: "Adoption Requests", href: ROUTES.ADOPTION_REQUESTS, icon: ClipboardList },
  { label: "Conversations", href: ROUTES.CONVERSATIONS, icon: MessageCircle },
  { label: "Notifications", href: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: "Reports", href: ROUTES.REPORTS, icon: FileText },
  { label: "Profile", href: ROUTES.PROFILE, icon: UserCog },
];
