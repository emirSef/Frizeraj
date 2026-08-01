-- ============================================================================
-- Salon CRM — client avatars + personal ID
--
--   * Add optional personal_id / passport field on clients
--   * Create a public storage bucket for customer profile images
-- ============================================================================

alter table public.clients
  add column if not exists personal_id text;

comment on column public.clients.personal_id is 'Optional personal ID / passport number.';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-avatars',
  'client-avatars',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "client_avatars_select_public"
  on storage.objects for select
  to public
  using (bucket_id = 'client-avatars');

create policy "client_avatars_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'client-avatars');

create policy "client_avatars_update_authenticated"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'client-avatars')
  with check (bucket_id = 'client-avatars');

create policy "client_avatars_delete_authenticated"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'client-avatars');
