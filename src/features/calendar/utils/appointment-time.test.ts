import { describe, expect, it } from "vitest";

import {
  addMinutesToTime,
  isEndAfterStart,
  normalizeTime,
} from "./appointment-time";

describe("normalizeTime", () => {
  it("pads single-digit hours and minutes", () => {
    expect(normalizeTime("9:5")).toBe("09:05:00");
  });

  it("preserves seconds when provided", () => {
    expect(normalizeTime("09:30:45")).toBe("09:30:45");
  });
});

describe("addMinutesToTime", () => {
  it("adds service duration and returns HH:mm by default", () => {
    expect(addMinutesToTime("09:00", 45)).toBe("09:45");
  });

  it("can return HH:mm:ss for server storage", () => {
    expect(addMinutesToTime("09:00", 30, "HH:mm:ss")).toBe("09:30:00");
  });

  it("accepts HH:mm:ss input", () => {
    expect(addMinutesToTime("09:00:00", 60)).toBe("10:00");
  });

  it("clamps to end of day at 23:59", () => {
    expect(addMinutesToTime("23:30", 60)).toBe("23:59");
  });

  it("handles zero-minute services", () => {
    expect(addMinutesToTime("14:00", 0)).toBe("14:00");
  });
});

describe("isEndAfterStart", () => {
  it("returns true when end is after start", () => {
    expect(isEndAfterStart("09:00", "09:30")).toBe(true);
  });

  it("returns false when end equals start", () => {
    expect(isEndAfterStart("09:00", "09:00")).toBe(false);
  });

  it("returns false when end is before start", () => {
    expect(isEndAfterStart("10:00", "09:30")).toBe(false);
  });
});
