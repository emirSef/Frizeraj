-- ============================================================================
-- Salon CRM — RLS / security hardening (addresses Supabase advisor warnings)
--
--   * Replace literal `true` write policies with explicit authenticated checks
--     (same behaviour for signed-in staff, but not a literal RLS bypass).
--   * Remove the SECURITY DEFINER helper/trigger functions from the public
--     REST surface so they cannot be invoked as RPCs by anon.
-- ============================================================================

-- clients: explicit "must be authenticated" instead of `true`
alter policy "clients_insert_authenticated" on public.clients
  with check ((select auth.uid()) is not null);

alter policy "clients_update_authenticated" on public.clients
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- appointments: explicit "must be authenticated" instead of `true`
alter policy "appointments_insert_authenticated" on public.appointments
  with check ((select auth.uid()) is not null);

alter policy "appointments_update_authenticated" on public.appointments
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Trigger function must not be a public RPC (triggers run regardless of EXECUTE).
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Role helper is used inside RLS policies (authenticated needs EXECUTE),
-- but anon/public should not be able to call it via /rpc.
revoke execute on function public.current_user_role() from public, anon;
