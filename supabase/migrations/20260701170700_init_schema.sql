-- ============================================================================
-- Salon CRM — Initial schema
-- Tables: users, clients, services, appointments
-- Conventions:
--   * UUID primary keys (gen_random_uuid)
--   * timestamptz created_at / updated_at with an auto-update trigger
--   * snake_case identifiers, singular column names, plural table names
--   * enums for constrained value sets
--   * money stored as numeric(10,2)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type public.user_role as enum ('admin', 'manager', 'stylist', 'receptionist');

create type public.client_gender as enum ('male', 'female', 'other', 'prefer_not_to_say');

create type public.appointment_status as enum (
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

-- ----------------------------------------------------------------------------
-- Shared trigger function: keep updated_at in sync
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- users  (application profile, 1:1 with auth.users)
-- ----------------------------------------------------------------------------
create table public.users (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null default '',
  role       public.user_role not null default 'stylist',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.users is 'Staff profiles, one row per auth.users record.';

create index idx_users_role on public.users (role);

create trigger trg_users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- clients
-- ----------------------------------------------------------------------------
create table public.clients (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text not null,
  phone       text,
  email       text,
  birth_date  date,
  gender      public.client_gender,
  country     text,
  city        text,
  notes       text,
  avatar_url  text,
  created_by  uuid references public.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint clients_email_format check (
    email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  )
);

comment on table public.clients is 'Salon customers.';

create index idx_clients_last_first on public.clients (last_name, first_name);
create index idx_clients_email on public.clients (email) where email is not null;
create index idx_clients_phone on public.clients (phone) where phone is not null;
create index idx_clients_created_at on public.clients (created_at desc);
create index idx_clients_created_by on public.clients (created_by);

create trigger trg_clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- services
-- ----------------------------------------------------------------------------
create table public.services (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  duration      integer not null default 30,   -- minutes
  default_price numeric(10, 2) not null default 0,
  color         text not null default '#6366f1',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint services_duration_positive check (duration > 0),
  constraint services_price_non_negative check (default_price >= 0),
  constraint services_color_hex check (color ~* '^#[0-9a-f]{6}$')
);

comment on table public.services is 'Offered treatments/services with default pricing.';
comment on column public.services.duration is 'Duration in minutes.';

create unique index idx_services_name_unique on public.services (lower(name));
create index idx_services_is_active on public.services (is_active);

create trigger trg_services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- appointments
-- ----------------------------------------------------------------------------
create table public.appointments (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients (id) on delete cascade,
  service_id uuid references public.services (id) on delete set null,
  date       date not null,
  start_time time not null,
  end_time   time not null,
  treatment  text,
  products   text,
  notes      text,
  price      numeric(10, 2),
  status     public.appointment_status not null default 'scheduled',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_time_valid check (end_time > start_time),
  constraint appointments_price_non_negative check (price is null or price >= 0)
);

comment on table public.appointments is 'Booked appointments linking a client to a service.';

create index idx_appointments_client_id on public.appointments (client_id);
create index idx_appointments_service_id on public.appointments (service_id);
create index idx_appointments_date on public.appointments (date);
create index idx_appointments_status on public.appointments (status);
create index idx_appointments_date_start on public.appointments (date, start_time);
create index idx_appointments_created_by on public.appointments (created_by);

create trigger trg_appointments_set_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Privileges
-- RLS (added in the next migration) governs row access; these grants govern
-- table-level access. `anon` is intentionally left without privileges.
-- ----------------------------------------------------------------------------
grant usage on schema public to authenticated;

grant select, insert, update, delete on
  public.users,
  public.clients,
  public.services,
  public.appointments
to authenticated;
