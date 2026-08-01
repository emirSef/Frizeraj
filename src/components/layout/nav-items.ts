import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROUTES } from "@/lib/constants";

export interface NavItem {
  labelKey: "nav.dashboard" | "nav.customers" | "nav.calendar" | "nav.services";
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { labelKey: "nav.dashboard", href: ROUTES.dashboard, icon: LayoutDashboardIcon },
  { labelKey: "nav.customers", href: ROUTES.customers, icon: UsersIcon },
  { labelKey: "nav.calendar", href: ROUTES.calendar, icon: CalendarDaysIcon },
  { labelKey: "nav.services", href: ROUTES.services, icon: SparklesIcon },
];
