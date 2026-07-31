export * from "./format";

/**
 * Type-safe list of object keys.
 */
export function objectKeys<T extends Record<string, unknown>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Async sleep helper, primarily for tests and optimistic UI delays.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
