"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants";

/**
 * Signs the current user out and clears the auth cookies, then redirects to
 * the login page.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ROUTES.login);
}
