import { format, type FormatOptions } from "date-fns";
import { TZDate, tz } from "@date-fns/tz";

/**
 * Salon business timezone.
 *
 * Appointments are stored as civil `date` + `time` (wall-clock) values for this
 * zone. All "today", display, and calendar math must use this timezone so the
 * browser, Next.js (Vercel UTC), and Supabase stay aligned.
 */
export const BUSINESS_TIMEZONE = "Europe/Sarajevo" as const;

export type BusinessDateString = `${number}-${number}-${number}`;

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

const businessTz = tz(BUSINESS_TIMEZONE);

function withBusinessTz(options?: FormatOptions): FormatOptions {
  return { ...options, in: businessTz };
}

/** Format an instant using Europe/Sarajevo wall-clock parts. */
export function formatInBusinessTimeZone(
  value: Date | number | string,
  pattern: string,
  options?: Omit<FormatOptions, "in">,
): string {
  const date = value instanceof Date ? value : new Date(value);
  return format(date, pattern, withBusinessTz(options));
}

/** Today's calendar date in Europe/Sarajevo as `yyyy-MM-dd`. */
export function todayDateString(now: Date | number = new Date()): string {
  return formatInBusinessTimeZone(now, "yyyy-MM-dd");
}

/** Calendar date of an instant in Europe/Sarajevo as `yyyy-MM-dd`. */
export function toDateString(value: Date | number): string {
  return formatInBusinessTimeZone(value, "yyyy-MM-dd");
}

/** Wall-clock time of an instant in Europe/Sarajevo. */
export function toTimeString(
  value: Date | number,
  withSeconds: boolean = true,
): string {
  return formatInBusinessTimeZone(value, withSeconds ? "HH:mm:ss" : "HH:mm");
}

/**
 * Parse a stored `yyyy-MM-dd` as noon in Europe/Sarajevo.
 * Noon avoids DST midnight gaps/ambiguous offsets when converting to an Instant.
 */
export function parseBusinessDate(dateStr: string): Date {
  const match = DATE_RE.exec(dateStr);
  if (!match) {
    throw new Error(`Invalid business date: ${dateStr}`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new TZDate(year, month - 1, day, 12, 0, 0, 0, BUSINESS_TIMEZONE);
}

/**
 * Combine stored civil date + time into the corresponding Instant in
 * Europe/Sarajevo (e.g. for comparisons against "now").
 */
export function combineBusinessDateAndTime(dateStr: string, timeStr: string): Date {
  const dateMatch = DATE_RE.exec(dateStr);
  const timeMatch = TIME_RE.exec(timeStr);
  if (!dateMatch || !timeMatch) {
    throw new Error(`Invalid business date/time: ${dateStr} ${timeStr}`);
  }
  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const second = Number(timeMatch[3] ?? "0");
  return new TZDate(year, month - 1, day, hour, minute, second, 0, BUSINESS_TIMEZONE);
}

/**
 * Format a stored calendar date (`yyyy-MM-dd`) for display without shifting the
 * day via UTC midnight parsing (`new Date("yyyy-MM-dd")`).
 */
export function formatBusinessDate(
  dateStr: string,
  pattern = "PP",
  options?: Omit<FormatOptions, "in">,
): string {
  return format(parseBusinessDate(dateStr), pattern, options);
}

/**
 * Format a timestamptz / ISO instant for display in Europe/Sarajevo.
 * Safe on Vercel (UTC) and in any browser timezone.
 */
export function formatBusinessDateTime(
  value: Date | number | string,
  pattern = "PPp",
  options?: Omit<FormatOptions, "in">,
): string {
  return formatInBusinessTimeZone(value, pattern, options);
}

/** True when `value`'s Sarajevo calendar day equals `dateStr`. */
export function isSameBusinessDay(value: Date | number, dateStr: string): boolean {
  return toDateString(value) === dateStr;
}

/** Civil date key for React lists (`yyyy-MM-dd`) from a Date's Sarajevo parts. */
export function businessDayKey(value: Date | number): string {
  return toDateString(value);
}
