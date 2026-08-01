-- Run this once in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rjzhmkrjdwtiviusjets/sql/new
--
-- Creates the storage bucket + policies needed for customer image upload.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-avatars',
  'client-avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "client_avatars_select_public" on storage.objects;
drop policy if exists "client_avatars_insert_authenticated" on storage.objects;
drop policy if exists "client_avatars_update_authenticated" on storage.objects;
drop policy if exists "client_avatars_delete_authenticated" on storage.objects;

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
