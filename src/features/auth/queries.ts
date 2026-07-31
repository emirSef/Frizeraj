import { createClient } from "@/lib/supabase/server";
import type { AppUser } from "@/types";

export interface SessionUser {
  id: string;
  email: string | null;
  profile: AppUser | null;
}

/**
 * Server-only: returns the authenticated user together with their profile row
 * from the `users` table, or `null` when there is no session.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    profile: profile ?? null,
  };
}
