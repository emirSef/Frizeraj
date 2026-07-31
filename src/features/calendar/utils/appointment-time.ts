/** Normalize an "HH:mm" or "HH:mm:ss" string to "HH:mm:ss". */
export function normalizeTime(time: string): string {
  const [h = "00", m = "00", s = "00"] = time.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
}

type TimeFormat = "HH:mm" | "HH:mm:ss";

/**
 * Adds minutes to a time string, clamped to the end of the day (23:59).
 * Accepts "HH:mm" or "HH:mm:ss" input.
 */
export function addMinutesToTime(
  time: string,
  minutes: number,
  format: TimeFormat = "HH:mm",
): string {
  const normalized = normalizeTime(time);
  const [h, m] = normalized.split(":").map(Number);
  const total = Math.min(h * 60 + m + minutes, 23 * 60 + 59);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  const base = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  return format === "HH:mm:ss" ? `${base}:00` : base;
}

/** Returns true when end is strictly after start (both as "HH:mm:ss"). */
export function isEndAfterStart(startTime: string, endTime: string): boolean {
  return normalizeTime(endTime) > normalizeTime(startTime);
}
