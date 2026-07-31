"use client";

import * as React from "react";

/**
 * Returns a debounced copy of a value that only updates after `delay` ms
 * have passed without changes. Useful for search inputs.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
