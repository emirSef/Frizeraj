-- Seed data for local development (`supabase db reset` runs this automatically).
-- Only reference/business data that does not depend on auth users is seeded here.

insert into public.services (name, duration, default_price, color)
values
  ('Women''s Haircut', 60, 45.00, '#ec4899'),
  ('Men''s Haircut', 30, 25.00, '#3b82f6'),
  ('Blow Dry & Style', 45, 35.00, '#f59e0b'),
  ('Full Color', 120, 90.00, '#8b5cf6'),
  ('Highlights', 150, 120.00, '#eab308'),
  ('Balayage', 180, 160.00, '#14b8a6'),
  ('Root Touch-Up', 90, 65.00, '#ef4444'),
  ('Deep Conditioning Treatment', 30, 30.00, '#22c55e'),
  ('Keratin Treatment', 150, 200.00, '#06b6d4'),
  ('Beard Trim', 20, 15.00, '#64748b')
on conflict (lower(name)) do nothing;
