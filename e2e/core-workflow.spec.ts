import { format } from "date-fns";
import { expect, test } from "@playwright/test";

import {
  appointmentDate,
  hasE2eCredentials,
  login,
  selectLabeledOption,
  uniqueSuffix,
} from "./helpers";

test.describe("Core salon workflow", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      !hasE2eCredentials(),
      "Set E2E_USER_EMAIL and E2E_USER_PASSWORD in .env.local to run E2E tests.",
    );
    testInfo.setTimeout(120_000);
  });

  test("login → add customer → book appointment → complete → view service record", async ({
    page,
  }) => {
    const suffix = uniqueSuffix();
    const firstName = `E2E${suffix}`;
    const lastName = "TestClient";
    const fullName = `${firstName} ${lastName}`;
    const treatmentNote = `Balayage treatment ${suffix}`;
    const hairCondition = `Healthy roots ${suffix}`;

    const apptDate = appointmentDate(14);
    const apptTime = "07:00";

    // ── Login ──────────────────────────────────────────────────────────────
    await login(page);

    // ── Add customer ───────────────────────────────────────────────────────
    await page.goto("/customers");
    await page.getByRole("button", { name: "New Customer" }).click();
    await expect(page.getByRole("heading", { name: "Add New Customer" })).toBeVisible();

    await page.getByLabel("First Name").fill(firstName);
    await page.getByLabel("Last Name").fill(lastName);
    await page.getByLabel("Email").fill(`${firstName.toLowerCase()}@e2e.test`);
    await page.getByLabel("Phone").fill("+38761123456");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByRole("heading", { name: "Add New Customer" })).toBeHidden({
      timeout: 15_000,
    });
    await page.getByLabel("Search customers").fill(fullName);
    await expect(page.getByRole("cell", { name: fullName })).toBeVisible({ timeout: 15_000 });

    // ── Book appointment ───────────────────────────────────────────────────
    await page.goto("/calendar");
    await expect(page.getByRole("heading", { name: "Calendar" })).toBeVisible();
    await page.getByRole("button", { name: "New appointment" }).click();
    await expect(page.getByRole("heading", { name: "New appointment" })).toBeVisible();

    await selectLabeledOption(page, "Customer", fullName);
    await selectLabeledOption(page, "Service", "Women's Haircut");
    await page.getByLabel("Date").fill(apptDate);
    await page.getByLabel("Start time").fill(apptTime);
    await page.getByRole("button", { name: "Create appointment" }).click();

    await expect(page.getByRole("heading", { name: "New appointment" })).toBeHidden({
      timeout: 15_000,
    });

    // Navigate to the week containing the appointment if needed.
    const apptDay = new Date(`${apptDate}T12:00:00`);
    for (let i = 0; i < 8; i += 1) {
      const title = await page.locator(".fc-toolbar-title").textContent();
      if (title?.includes(format(apptDay, "MMM"))) break;
      await page.locator(".fc-next-button").click();
    }

    const calendarEvent = page.locator(".fc-event").filter({ hasText: firstName }).first();
    await expect(calendarEvent).toBeVisible({ timeout: 20_000 });
    await calendarEvent.click();

    const detailsDialog = page.getByRole("dialog").filter({
      has: page.getByRole("heading", { name: fullName }),
    });
    await expect(detailsDialog).toBeVisible();
    await detailsDialog.getByRole("button", { name: "Complete appointment" }).click();

    // ── Complete appointment / service record ──────────────────────────────
    const completeDialog = page.getByRole("dialog").filter({
      has: page.getByRole("heading", { name: "Complete appointment" }),
    });
    await expect(completeDialog).toBeVisible();
    await completeDialog.getByLabel("Hair Condition").fill(hairCondition);
    await completeDialog.getByLabel("Treatment").fill(treatmentNote);
    await completeDialog.getByLabel("Products Used").fill("Olaplex No.3");
    await completeDialog.getByRole("button", { name: "Complete appointment" }).click();

    await expect(completeDialog).toBeHidden({
      timeout: 15_000,
    });

    // ── Verify service record on customer profile ──────────────────────────
    await page.goto("/customers");
    await page.getByLabel("Search customers").fill(fullName);
    await page.getByRole("cell", { name: fullName }).click();

    await expect(page.getByRole("heading", { name: "Customer details" })).toBeVisible();
    await page.getByRole("tab", { name: "Service Records" }).click();

    await expect(page.getByText(treatmentNote)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(hairCondition)).toBeVisible();
    await expect(page.getByText("Olaplex No.3")).toBeVisible();
    await expect(page.getByText("Women's Haircut")).toBeVisible();
  });
});
