-- ============================================================================
-- Salon CRM — Row Level Security & auth integration
--
-- Model: this is an internal staff tool. Any authenticated staff member can
-- read and manage clients, services and appointments. Destructive deletes of
-- business data are restricted to admins/managers. The `users` (profile) table
-- is more tightly controlled: staff can read colleagues and edit their own
-- profile, while admins manage everyone.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper: current user's role (SECURITY DEFINER to avoid RLS recursion)
-- ----------------------------------------------------------------------------
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.users where id = (select auth.uid());
$$;

grant execute on function public.current_user_role() to authenticated;

-- ----------------------------------------------------------------------------
-- Auto-provision a profile row when a new auth user is created
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Enable RLS
-- ----------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;

-- ----------------------------------------------------------------------------
-- users policies
-- ----------------------------------------------------------------------------
create policy "users_select_authenticated"
  on public.users for select
  to authenticated
  using (true);

-- A user may edit their own profile but may NOT change their own role.
create policy "users_update_own"
  on public.users for update
  to authenticated
  using (id = (select auth.uid()))
  with check (
    id = (select auth.uid())
    and role = (select u.role from public.users u where u.id = (select auth.uid()))
  );

create policy "users_admin_all"
  on public.users for all
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- ----------------------------------------------------------------------------
-- clients policies
-- ----------------------------------------------------------------------------
create policy "clients_select_authenticated"
  on public.clients for select
  to authenticated
  using (true);

create policy "clients_insert_authenticated"
  on public.clients for insert
  to authenticated
  with check (true);

create policy "clients_update_authenticated"
  on public.clients for update
  to authenticated
  using (true)
  with check (true);

create policy "clients_delete_privileged"
  on public.clients for delete
  to authenticated
  using (public.current_user_role() in ('admin', 'manager'));

-- ----------------------------------------------------------------------------
-- services policies
-- ----------------------------------------------------------------------------
create policy "services_select_authenticated"
  on public.services for select
  to authenticated
  using (true);

create policy "services_insert_privileged"
  on public.services for insert
  to authenticated
  with check (public.current_user_role() in ('admin', 'manager'));

create policy "services_update_privileged"
  on public.services for update
  to authenticated
  using (public.current_user_role() in ('admin', 'manager'))
  with check (public.current_user_role() in ('admin', 'manager'));

create policy "services_delete_privileged"
  on public.services for delete
  to authenticated
  using (public.current_user_role() in ('admin', 'manager'));

-- ----------------------------------------------------------------------------
-- appointments policies
-- ----------------------------------------------------------------------------
create policy "appointments_select_authenticated"
  on public.appointments for select
  to authenticated
  using (true);

create policy "appointments_insert_authenticated"
  on public.appointments for insert
  to authenticated
  with check (true);

create policy "appointments_update_authenticated"
  on public.appointments for update
  to authenticated
  using (true)
  with check (true);

create policy "appointments_delete_privileged"
  on public.appointments for delete
  to authenticated
  using (public.current_user_role() in ('admin', 'manager'));
