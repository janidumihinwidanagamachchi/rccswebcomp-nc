-- Event cover photos.
-- Apply in the Supabase SQL editor (or `supabase db push`) before using the
-- admin uploader: the frontend uploads straight to this bucket with the anon key,
-- so the policies below are the only thing authorising writes.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-covers',
  'event-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read: event photos are shown in plain <img> tags and og:image tags,
-- which cannot carry a signed URL.
drop policy if exists "event covers are public" on storage.objects;
create policy "event covers are public" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'event-covers');

-- Writes are admin-only and confined to the events/ prefix.
-- roles live in public.profiles; this mirrors isAdmin in src/stores/authStore.ts.
drop policy if exists "admins upload event covers" on storage.objects;
create policy "admins upload event covers" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'event-covers'
    and (storage.foldername(name))[1] = 'events'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "admins update event covers" on storage.objects;
create policy "admins update event covers" on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'event-covers'
    and (storage.foldername(name))[1] = 'events'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "admins delete event covers" on storage.objects;
create policy "admins delete event covers" on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'event-covers'
    and (storage.foldername(name))[1] = 'events'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
