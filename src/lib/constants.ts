export const APP_NAME = "Salon CRM";
export const APP_DESCRIPTION =
  "A modern CRM for hair salons — manage clients, appointments, staff and services.";

/**
 * Central place for route paths so links stay consistent and refactorable.
 */
export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  customers: "/customers",
  calendar: "/calendar",
  services: "/services",
} as const;

/**
 * Routes accessible without an authenticated session. Everything else is
 * protected by the middleware.
 */
export const PUBLIC_ROUTES = ["/login"] as const;

export const QUERY_KEYS = {
  // Populate as features are added, e.g. clients: ["clients"] as const
} as const;

export const DEFAULT_PAGE_SIZE = 10;
