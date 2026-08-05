import { expect, type Page } from "@playwright/test";
import { addDays } from "date-fns";

import { parseBusinessDate, todayDateString, toDateString } from "../src/lib/timezone";

export const e2eCredentials = {
  email: process.env.E2E_USER_EMAIL ?? "",
  password: process.env.E2E_USER_PASSWORD ?? "",
};

export function hasE2eCredentials(): boolean {
  return Boolean(e2eCredentials.email && e2eCredentials.password);
}

export async function login(page: Page): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(e2eCredentials.email);
  await page.getByLabel("Password").fill(e2eCredentials.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard");
  await expect(page.getByText("Here's an overview of your salon.")).toBeVisible();
}

/** Opens a labeled select (base-ui combobox) and picks an option by visible text. */
export async function selectLabeledOption(
  page: Page,
  label: string,
  optionText: string,
): Promise<void> {
  await page.getByLabel(label).click();
  await page.getByRole("option", { name: optionText }).click();
}

export function uniqueSuffix(): string {
  return Date.now().toString(36);
}

/** Civil appointment date in Europe/Sarajevo (not UTC via toISOString). */
export function appointmentDate(daysFromNow = 14): string {
  return toDateString(addDays(parseBusinessDate(todayDateString()), daysFromNow));
}
