import { describe, expect, it } from "vitest";

import { serviceRecordDate } from "./types";

describe("serviceRecordDate", () => {
  it("prefers the appointment civil date", () => {
    expect(
      serviceRecordDate({
        appointment: { date: "2026-08-05" },
        created_at: "2026-08-04T22:30:00.000Z",
      }),
    ).toBe("2026-08-05");
  });

  it("falls back to created_at in Europe/Sarajevo (not raw ISO)", () => {
    // 22:30 UTC = 00:30 next day in Sarajevo (CEST)
    expect(
      serviceRecordDate({
        appointment: null,
        created_at: "2026-08-04T22:30:00.000Z",
      }),
    ).toBe("2026-08-05");
  });
});
