export const LOCALES = ["en", "bs"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "salon-crm-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  bs: "Bosanski",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "bs";
}
