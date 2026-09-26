-- Applies both pending migrations. Safe to run more than once.
--
--   0001_event_cover_storage.sql   creates the event-covers bucket + policies
--   0002_lock_down_registrations.sql   revokes anon read on registrations
--
-- Neither had been applied to project njcaznhkvlokgbjeqpan: the storage
-- project reported zero buckets, and anon could still select from
-- registrations. Run this in the Supabase SQL editor, or `supabase db push`
-- if the CLI is linked.
--
-- Verified before writing: public.profiles and public.events both exist, and
-- profiles has the role column the policies below check against.

-- 0001 ---------------------------------------------------------------------

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

-- Public read: event photos appear in plain <img> and og:image tags, which
-- cannot carry a signed URL.
drop policy if exists "event covers are public" on storage.objects;
create policy "event covers are public" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'event-covers');

-- Writes are admin-only and confined to the events/ prefix. roles live in
-- public.profiles; this mirrors isAdmin in src/stores/authStore.ts.
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

-- 0002 ---------------------------------------------------------------------

-- Without this, GET /rest/v1/registrations with the anon key returns 200 and
-- exposes attendee_name, attendee_email and qr_code_data for every ticket.
-- The table was empty when checked, so nothing had leaked. Every read in
-- src/hooks/useRegistrations.ts and src/pages/EventDetailPage.tsx runs as a
-- signed-in user, so revoking anon select only changes nothing in the app.
revoke select on table public.registrations from anon;
