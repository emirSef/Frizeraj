import { DEFAULT_LOCALE, type Locale } from "./config";
import { bs } from "./messages/bs";
import { en, type Messages } from "./messages/en";

const catalogs: Record<Locale, Messages> = {
  en,
  bs,
};

export function getMessages(locale: Locale = DEFAULT_LOCALE): Messages {
  return catalogs[locale] ?? catalogs[DEFAULT_LOCALE];
}

type NestedValue = string | { [key: string]: NestedValue };

function getPath(messages: Messages, path: string): string | undefined {
  const parts = path.split(".");
  let current: NestedValue = messages as unknown as NestedValue;

  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }

  return typeof current === "string" ? current : undefined;
}

export function translate(
  messages: Messages,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const template = getPath(messages, key) ?? key;
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    template,
  );
}
