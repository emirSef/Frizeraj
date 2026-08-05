import { formatDistanceToNow, type Locale } from "date-fns";

import {
  formatBusinessDate,
  formatBusinessDateTime,
  formatInBusinessTimeZone,
} from "@/lib/timezone";

type DateInput = Date | string | number;

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

/**
 * Format a calendar date or timestamp for UI display in Europe/Sarajevo.
 *
 * - `yyyy-MM-dd` strings are treated as civil dates (no UTC-midnight shift).
 * - Instants / ISO timestamps are shown in the salon timezone.
 */
export function formatDate(value: DateInput, pattern = "PP"): string {
  if (typeof value === "string" && DATE_ONLY_RE.test(value)) {
    return formatBusinessDate(value, pattern);
  }
  return formatInBusinessTimeZone(toDate(value), pattern);
}

export function formatDateTime(value: DateInput, pattern = "PPp"): string {
  if (typeof value === "string" && DATE_ONLY_RE.test(value)) {
    return formatBusinessDate(value, pattern);
  }
  return formatBusinessDateTime(value, pattern);
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
