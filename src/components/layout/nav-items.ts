import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROUTES } from "@/lib/constants";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboardIcon },
  { label: "Customers", href: ROUTES.customers, icon: UsersIcon },
  { label: "Calendar", href: ROUTES.calendar, icon: CalendarDaysIcon },
  { label: "Services", href: ROUTES.services, icon: SparklesIcon },
];
