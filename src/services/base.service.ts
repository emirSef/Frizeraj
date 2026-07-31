import type { PostgrestError } from "@supabase/supabase-js";

import { AppError } from "@/lib/errors";

/**
 * Service layer conventions
 * ─────────────────────────
 * Services encapsulate all data access. Feature code (hooks, server actions,
 * route handlers) should call services rather than touching the Supabase client
 * directly. This keeps queries reusable, testable and easy to refactor.
 *
 * A typical feature service lives in `src/features/<feature>/services/` and is
 * built from the Supabase client factories in `@/lib/supabase`.
 *
 * Example:
 *   export async function listClients() {
 *     const supabase = await createClient(); // server
 *     const res = await supabase.from("clients").select("*");
 *     return unwrap(res);
 *   }
 */

interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

/**
 * Unwraps a Supabase response, throwing a normalized {@link AppError} on failure.
 */
export function unwrap<T>(response: SupabaseResponse<T>): T {
  if (response.error) {
    throw new AppError(response.error.message, {
      code: response.error.code ?? "SUPABASE_ERROR",
      cause: response.error,
    });
  }

  if (response.data === null) {
    throw new AppError("No data returned from the database.", { code: "NO_DATA" });
  }

  return response.data;
}

/**
 * Like {@link unwrap} but allows `null` data (e.g. `.maybeSingle()`).
 */
export function unwrapNullable<T>(response: SupabaseResponse<T>): T | null {
  if (response.error) {
    throw new AppError(response.error.message, {
      code: response.error.code ?? "SUPABASE_ERROR",
      cause: response.error,
    });
  }
  return response.data;
}
