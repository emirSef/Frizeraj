-- ============================================================================
-- Salon CRM — service record before/after photos
--
-- Creates a public storage bucket for appointment service-record images.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-record-photos',
  'service-record-photos',
  true,
  5242880, -- 5 MB (after client-side compression)
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "service_record_photos_select_public" on storage.objects;
drop policy if exists "service_record_photos_insert_authenticated" on storage.objects;
drop policy if exists "service_record_photos_update_authenticated" on storage.objects;
drop policy if exists "service_record_photos_delete_authenticated" on storage.objects;

create policy "service_record_photos_select_public"
  on storage.objects for select
  to public
  using (bucket_id = 'service-record-photos');

create policy "service_record_photos_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'service-record-photos');

create policy "service_record_photos_update_authenticated"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'service-record-photos')
  with check (bucket_id = 'service-record-photos');

create policy "service_record_photos_delete_authenticated"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'service-record-photos');
