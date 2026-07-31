-- ============================================================================
-- Salon CRM — Repeatable demo data seed
--
-- Seeds 20 services, 100 clients and 300–500 appointments (each client gets
-- between 1 and 8). Safe to run multiple times: it first clears existing
-- customers, services and appointments, then regenerates a fresh dataset.
--
-- Run with the Supabase SQL editor, or:
--   psql "$DATABASE_URL" -f supabase/seed_demo.sql
--
-- This script does NOT modify the schema.
-- ============================================================================

-- 1) Reset existing data (appointments cascade from clients; delete explicitly).
delete from public.appointments;
delete from public.clients;
delete from public.services;

-- 2) Services — exactly 20.
insert into public.services (name, duration, default_price, color) values
  ('Haircut', 45, 30, '#6366f1'),
  ('Beard Trim', 20, 15, '#64748b'),
  ('Hair Wash', 15, 10, '#0ea5e9'),
  ('Hair Coloring', 120, 90, '#8b5cf6'),
  ('Highlights', 150, 120, '#eab308'),
  ('Balayage', 180, 160, '#14b8a6'),
  ('Keratin Treatment', 150, 200, '#06b6d4'),
  ('Hair Botox', 120, 150, '#ec4899'),
  ('Blow Dry', 30, 25, '#f59e0b'),
  ('Hair Styling', 40, 35, '#f97316'),
  ('Children Haircut', 30, 18, '#22c55e'),
  ('Buzz Cut', 20, 12, '#71717a'),
  ('Fade Haircut', 45, 35, '#3b82f6'),
  ('Women''s Haircut', 60, 45, '#d946ef'),
  ('Men''s Haircut', 30, 25, '#2563eb'),
  ('Root Touch-up', 90, 65, '#ef4444'),
  ('Deep Conditioning', 30, 30, '#10b981'),
  ('Scalp Treatment', 45, 50, '#84cc16'),
  ('Perm', 150, 130, '#a855f7'),
  ('Extensions', 180, 250, '#db2777');

-- 3) Clients + appointments.
do $$
declare
  male_names text[] := array['Amar','Emir','Haris','Tarik','Adnan','Faris','Vedad','Kenan','Nedim','Mirza','Luka','Marko','Ivan','Ante','Josip','Nikola','Stefan','Nemanja','Milos','Aleksandar','Dario','Goran','Damir','Sanjin','Denis','Armin','Benjamin','Dino','Edin','Bojan'];
  female_names text[] := array['Amina','Lejla','Emina','Ajla','Selma','Hana','Merima','Dzenana','Ivana','Ana','Marija','Petra','Katarina','Nikolina','Jelena','Milica','Sara','Lana','Nina','Maja','Dragana','Tijana','Sanja','Elma','Adna','Ena','Larisa','Melisa','Vanja','Iva'];
  last_names text[] := array['Hodzic','Kovacevic','Begic','Delic','Softic','Mujic','Hadzic','Suljic','Imamovic','Halilovic','Horvat','Kovac','Babic','Maric','Juric','Knezevic','Petrovic','Jovanovic','Nikolic','Popovic','Djuric','Ilic','Tomic','Vukovic','Bozic','Blazevic','Matic','Radic','Peric','Lukic'];
  locations text[] := array['Sarajevo|Bosnia and Herzegovina','Mostar|Bosnia and Herzegovina','Banja Luka|Bosnia and Herzegovina','Tuzla|Bosnia and Herzegovina','Zenica|Bosnia and Herzegovina','Zagreb|Croatia','Split|Croatia','Rijeka|Croatia','Belgrade|Serbia','Novi Sad|Serbia','Ljubljana|Slovenia','Maribor|Slovenia','Skopje|North Macedonia','Podgorica|Montenegro','Pristina|Kosovo','Vienna|Austria','Munich|Germany','Zurich|Switzerland'];
  notes_pool text[] := array['Customer prefers low fade.','Sensitive scalp.','Uses ammonia-free color.','Prefers natural finish.','Allergic to one product.','Likes short sides.','Always books morning appointments.','Prefers a female stylist.','Wants minimal layers.','Books every 4 weeks.'];
  products_pool text[] := array['Moroccanoil Treatment','Olaplex No.3','L''Oreal Professionnel','Wella Color Touch','Redken Shades EQ','Schwarzkopf BlondMe','Kerastase Nutritive','American Crew Fiber','Reuzel Pomade','Davines OI Oil'];
  statuses_past text[] := array['completed','completed','completed','completed','completed','completed','cancelled','no_show'];
  statuses_future text[] := array['scheduled','scheduled','confirmed'];

  svc_ids uuid[];
  svc_names text[];
  svc_dur int[];
  svc_price numeric[];

  n_clients int := 100;
  client_ids uuid[] := '{}';
  cnt int[] := '{}';

  v_id uuid;
  v_first text;
  v_last text;
  v_gender public.client_gender;
  v_loc text[];
  v_notes text;
  r double precision;

  target int;
  remaining int;
  idx int;
  i int;
begin
  select
    array_agg(id order by name),
    array_agg(name order by name),
    array_agg(duration order by name),
    array_agg(default_price order by name)
  into svc_ids, svc_names, svc_dur, svc_price
  from public.services;

  -- Clients
  for i in 1..n_clients loop
    r := random();
    if r < 0.5 then
      v_gender := 'male';
      v_first := male_names[1 + floor(random() * array_length(male_names, 1))::int];
    elsif r < 0.96 then
      v_gender := 'female';
      v_first := female_names[1 + floor(random() * array_length(female_names, 1))::int];
    elsif r < 0.98 then
      v_gender := 'other';
      v_first := (male_names || female_names)[1 + floor(random() * (array_length(male_names, 1) + array_length(female_names, 1)))::int];
    else
      v_gender := 'prefer_not_to_say';
      v_first := (male_names || female_names)[1 + floor(random() * (array_length(male_names, 1) + array_length(female_names, 1)))::int];
    end if;

    v_last := last_names[1 + floor(random() * array_length(last_names, 1))::int];
    v_loc := string_to_array(locations[1 + floor(random() * array_length(locations, 1))::int], '|');
    v_notes := case when random() < 0.6 then notes_pool[1 + floor(random() * array_length(notes_pool, 1))::int] else null end;

    insert into public.clients (first_name, last_name, phone, email, birth_date, gender, country, city, notes)
    values (
      v_first,
      v_last,
      '+387 ' || (60 + floor(random() * 5)::int) || ' ' || lpad(floor(random() * 1000)::int::text, 3, '0') || ' ' || lpad(floor(random() * 1000)::int::text, 3, '0'),
      lower(v_first) || '.' || lower(v_last) || i || '@example.com',
      (current_date - ((6570 + floor(random() * 19000)::int) || ' days')::interval)::date,
      v_gender,
      v_loc[2],
      v_loc[1],
      v_notes
    )
    returning id into v_id;

    client_ids := array_append(client_ids, v_id);
    cnt := array_append(cnt, 1); -- guarantee at least one appointment per client
  end loop;

  -- Choose a total between 300 and 500, then distribute the remainder
  -- (each client capped at 8 appointments).
  target := 300 + floor(random() * 201)::int;
  remaining := target - n_clients;
  while remaining > 0 loop
    idx := 1 + floor(random() * n_clients)::int;
    if cnt[idx] < 8 then
      cnt[idx] := cnt[idx] + 1;
      remaining := remaining - 1;
    end if;
  end loop;

  -- Appointments — generated set-based (one INSERT) for speed.
  -- `cnt` rows per client are expanded via generate_series. The random service
  -- index / date / start time are computed in an inner subquery fenced with
  -- `offset 0` so the planner evaluates random() once PER ROW (not once total)
  -- and the chosen index stays consistent across all derived columns.
  insert into public.appointments
    (client_id, service_id, date, start_time, end_time, treatment, products, notes, price, status)
  select
    x.cid,
    svc_ids[x.si],
    x.a_date,
    x.a_start,
    x.a_start + make_interval(mins => svc_dur[x.si]),
    svc_names[x.si] || case when random() < 0.3 then ' + Blow Dry' else '' end,
    case
      when random() < 0.6 then
        products_pool[1 + floor(random() * array_length(products_pool, 1))::int]
        || case when random() < 0.4 then ' + ' || products_pool[1 + floor(random() * array_length(products_pool, 1))::int] else '' end
      else null
    end,
    case when random() < 0.5 then notes_pool[1 + floor(random() * array_length(notes_pool, 1))::int] else null end,
    round((svc_price[x.si] * (0.9 + random() * 0.4)::numeric), 2),
    (case
      when x.a_date <= current_date then statuses_past[1 + floor(random() * array_length(statuses_past, 1))::int]
      else statuses_future[1 + floor(random() * array_length(statuses_future, 1))::int]
    end)::public.appointment_status
  from (
    select
      t.cid as cid,
      (1 + floor(random() * array_length(svc_ids, 1))::int) as si,
      (case
        when random() < 0.85 then current_date - floor(random() * 365)::int
        else current_date + (1 + floor(random() * 30)::int)
      end) as a_date,
      make_time(9 + floor(random() * 8)::int, case when random() < 0.5 then 0 else 30 end, 0) as a_start
    from unnest(client_ids, cnt) as t(cid, n)
    cross join lateral generate_series(1, t.n) as g
    offset 0
  ) as x;
end $$;
