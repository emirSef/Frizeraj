import { afterEach, describe, expect, it } from "vitest";

import { formatDate, formatDateTime } from "@/utils/format";
import {
  BUSINESS_TIMEZONE,
  combineBusinessDateAndTime,
  formatBusinessDate,
  formatInBusinessTimeZone,
  parseBusinessDate,
  toDateString,
  toTimeString,
  todayDateString,
} from "@/lib/timezone";

const originalTz = process.env.TZ;

afterEach(() => {
  if (originalTz === undefined) {
    delete process.env.TZ;
  } else {
    process.env.TZ = originalTz;
  }
});

describe("BUSINESS_TIMEZONE", () => {
  it("is Europe/Sarajevo for salon wall-clock logic", () => {
    expect(BUSINESS_TIMEZONE).toBe("Europe/Sarajevo");
  });
});

describe("todayDateString / toDateString (Vercel UTC vs Sarajevo)", () => {
  it("uses Sarajevo calendar day when the Node process is UTC (Vercel)", () => {
    process.env.TZ = "UTC";

    // 2026-07-01 22:30 UTC = 2026-07-02 00:30 in Europe/Sarajevo (CEST, UTC+2)
    const justAfterMidnightSarajevo = new Date("2026-07-01T22:30:00.000Z");
    expect(todayDateString(justAfterMidnightSarajevo)).toBe("2026-07-02");
    expect(toDateString(justAfterMidnightSarajevo)).toBe("2026-07-02");
    expect(toTimeString(justAfterMidnightSarajevo)).toBe("00:30:00");

    // Still previous evening in Sarajevo
    const eveningSarajevo = new Date("2026-07-01T20:00:00.000Z");
    expect(todayDateString(eveningSarajevo)).toBe("2026-07-01");
    expect(toTimeString(eveningSarajevo, false)).toBe("22:00");
  });

  it("agrees across process timezones for the same Instant", () => {
    const instant = new Date("2026-08-05T23:30:00.000Z"); // 01:30 next day in Sarajevo (CEST)

    process.env.TZ = "UTC";
    const fromUtc = todayDateString(instant);

    process.env.TZ = "America/Los_Angeles";
    const fromUs = todayDateString(instant);

    process.env.TZ = "Europe/Sarajevo";
    const fromLocal = todayDateString(instant);

    expect(fromUtc).toBe("2026-08-06");
    expect(fromUs).toBe("2026-08-06");
    expect(fromLocal).toBe("2026-08-06");
  });
});

describe("DST transitions (Europe/Sarajevo)", () => {
  it("handles spring forward (2026-03-29): 02:00 jumps to 03:00", () => {
    process.env.TZ = "UTC";

    // 00:30 UTC = 01:30 CET (still winter offset UTC+1) on March 29 before the jump
    expect(toDateString(new Date("2026-03-29T00:30:00.000Z"))).toBe("2026-03-29");
    expect(toTimeString(new Date("2026-03-29T00:30:00.000Z"), false)).toBe("01:30");

    // After spring forward, Sarajevo is UTC+2. 01:30 UTC = 03:30 CEST
    expect(toDateString(new Date("2026-03-29T01:30:00.000Z"))).toBe("2026-03-29");
    expect(toTimeString(new Date("2026-03-29T01:30:00.000Z"), false)).toBe("03:30");

    // Stored wall-clock 09:00 on DST day still maps to a stable Instant
    const morning = combineBusinessDateAndTime("2026-03-29", "09:00:00");
    expect(formatInBusinessTimeZone(morning, "yyyy-MM-dd HH:mm XXX")).toBe(
      "2026-03-29 09:00 +02:00",
    );
  });

  it("handles fall back (2026-10-25): 03:00 repeats as 02:00", () => {
    process.env.TZ = "UTC";

    // Before fall back ends: still CEST (UTC+2). 00:30 UTC = 02:30 CEST
    expect(toTimeString(new Date("2026-10-25T00:30:00.000Z"), false)).toBe("02:30");

    // After fall back to CET (UTC+1). 01:30 UTC = 02:30 CET
    expect(toTimeString(new Date("2026-10-25T01:30:00.000Z"), false)).toBe("02:30");

    // Wall-clock afternoon appointment is unambiguous
    const afternoon = combineBusinessDateAndTime("2026-10-25", "15:00");
    expect(toDateString(afternoon)).toBe("2026-10-25");
    expect(toTimeString(afternoon, false)).toBe("15:00");
    expect(formatInBusinessTimeZone(afternoon, "XXX")).toBe("+01:00");
  });
});

describe("midnight appointments", () => {
  it("keeps late-evening and early-morning civil dates distinct", () => {
    process.env.TZ = "UTC";

    const late = combineBusinessDateAndTime("2026-08-05", "23:30:00");
    const early = combineBusinessDateAndTime("2026-08-06", "00:15:00");

    expect(toDateString(late)).toBe("2026-08-05");
    expect(toTimeString(late, false)).toBe("23:30");
    expect(toDateString(early)).toBe("2026-08-06");
    expect(toTimeString(early, false)).toBe("00:15");
  });

  it("does not shift a stored date when formatting near UTC midnight", () => {
    process.env.TZ = "UTC";
    expect(formatBusinessDate("2026-08-05", "yyyy-MM-dd")).toBe("2026-08-05");
    expect(formatDate("2026-08-05", "yyyy-MM-dd")).toBe("2026-08-05");
  });
});

describe("parseBusinessDate", () => {
  it("parses at noon to avoid DST midnight edge cases", () => {
    process.env.TZ = "UTC";
    const date = parseBusinessDate("2026-03-29");
    expect(toDateString(date)).toBe("2026-03-29");
    expect(toTimeString(date, false)).toBe("12:00");
  });
});

describe("formatDate display (Vercel + browser parity)", () => {
  it("formats date-only strings without UTC-midnight day shift", () => {
    process.env.TZ = "America/New_York";
    // Legacy bug: new Date("2026-08-05") is UTC midnight → Aug 4 in US Eastern
    expect(formatDate("2026-08-05", "yyyy-MM-dd")).toBe("2026-08-05");
    expect(formatDate("2026-01-01", "yyyy-MM-dd")).toBe("2026-01-01");
  });

  it("formats timestamptz instants in Europe/Sarajevo", () => {
    process.env.TZ = "UTC";
    const iso = "2026-07-01T22:30:00.000Z";
    expect(formatDate(iso, "yyyy-MM-dd HH:mm")).toBe("2026-07-02 00:30");
    expect(formatDateTime(iso, "yyyy-MM-dd HH:mm")).toBe("2026-07-02 00:30");
  });
});
