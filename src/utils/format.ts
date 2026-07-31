import { format, formatDistanceToNow, type Locale } from "date-fns";

type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: DateInput, pattern = "PP"): string {
  return format(toDate(value), pattern);
}

export function formatDateTime(value: DateInput, pattern = "PPp"): string {
  return format(toDate(value), pattern);
}

export function formatRelativeTime(value: DateInput, locale?: Locale): string {
  return formatDistanceToNow(toDate(value), { addSuffix: true, locale });
}

export function formatCurrency(amount: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

export function formatNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Returns up to two uppercase initials from a name — handy for avatars.
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
