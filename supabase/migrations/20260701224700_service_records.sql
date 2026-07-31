-- ============================================================================
-- Salon CRM — Service records
--
-- A service record captures what was actually done to a client's hair during a
-- completed appointment (treatment performed, products used, color formula,
-- recommendations, before/after images, etc.).
--
-- Conventions follow the initial schema: UUID PKs, timestamptz created_at /
-- updated_at with the shared set_updated_at trigger, snake_case identifiers.
-- ============================================================================

create table public.service_records (
  id               uuid primary key default gen_random_uuid(),
  appointment_id   uuid not null references public.appointments (id) on delete cascade,
  client_id        uuid not null references public.clients (id) on delete cascade,
  service_id       uuid references public.services (id) on delete set null,
  hair_condition   text,
  treatment        text,
  products_used    text,
  color_formula    text,
  notes            text,
  recommendations  text,
  before_image_url text,
  after_image_url  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- One service record per appointment (allows idempotent upsert on complete).
  constraint service_records_appointment_unique unique (appointment_id)
);

comment on table public.service_records is
  'What was actually done to a client''s hair during a completed appointment.';

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------
create index idx_service_records_client_id on public.service_records (client_id);
create index idx_service_records_appointment_id on public.service_records (appointment_id);
create index idx_service_records_created_at on public.service_records (created_at desc);

-- ----------------------------------------------------------------------------
-- updated_at trigger (reuses the shared function from the initial schema)
-- ----------------------------------------------------------------------------
create trigger trg_service_records_set_updated_at
  before update on public.service_records
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Privileges (RLS below governs row access)
-- ----------------------------------------------------------------------------
grant select, insert, update, delete on public.service_records to authenticated;

-- ----------------------------------------------------------------------------
-- Row Level Security
--   * Any authenticated staff member may read / create / update records.
--   * Only admins and managers may delete them.
-- ----------------------------------------------------------------------------
alter table public.service_records enable row level security;

create policy "service_records_select_authenticated"
  on public.service_records for select
  to authenticated
  using (true);

create policy "service_records_insert_authenticated"
  on public.service_records for insert
  to authenticated
  with check ((select auth.uid()) is not null);

create policy "service_records_update_authenticated"
  on public.service_records for update
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

create policy "service_records_delete_privileged"
  on public.service_records for delete
  to authenticated
  using (public.current_user_role() in ('admin', 'manager'));
