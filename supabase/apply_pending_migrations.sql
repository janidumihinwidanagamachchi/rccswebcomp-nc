-- One-time Supabase setup for the event-covers photo bucket.
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- Safe to run more than once: every statement is idempotent.
--
-- Situation this fixes (verified against the live project):
--   * `event-covers` exists as a row in storage.buckets, but the Storage API
--     reported zero buckets and uploads failed. The row was inserted with no
--     matching access policies, so anon/authenticated had nothing authorising
--     reads or writes.
--   * Migration 0001 aborted partway, so the policies it defines were never
--     reliably created.
--   * anon could also read every row of public.registrations (attendee names,
--     emails, raw QR payloads). That revoke did land, and is repeated here so
--     this file is safe to apply to a fresh project too.
--
-- After running, no code change is needed: src/lib/uploadImage.ts already
-- targets 'event-covers' and writes under the events/ prefix these policies
-- allow.

-- ---------------------------------------------------------------------------
-- 1. Bucket
-- ---------------------------------------------------------------------------
-- ON CONFLICT DO UPDATE deliberately re-asserts every column. That is what
-- nudges Storage's API layer to pick the bucket up; a bare ON CONFLICT DO
-- NOTHING can leave the API layer unaware of an externally-inserted row.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-covers',
  'event-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- 2. Policies
-- ---------------------------------------------------------------------------
-- Public read: event photos appear in plain <img> and og:image tags, which
-- cannot carry a signed URL.
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

-- ---------------------------------------------------------------------------
-- 3. Stop exposing registrations to anonymous visitors
-- ---------------------------------------------------------------------------
-- Without this, GET /rest/v1/registrations with the anon key returns 200 and
-- leaks attendee_name, attendee_email and qr_code_data for every ticket.
-- Every read in src/hooks/useRegistrations.ts and src/pages/EventDetailPage.tsx
-- runs as a signed-in user, so revoking anon select only changes nothing in
-- the app. Do NOT also revoke insert/update: signup inserts directly and
-- check-in updates directly.
revoke select on table public.registrations from anon;

-- ---------------------------------------------------------------------------
-- 4. Confirm (read-only, safe to ignore the output)
-- ---------------------------------------------------------------------------
-- Expect exactly one row.
select id, name, public, file_size_limit
from storage.buckets
where id = 'event-covers';

-- Expect four rows: the public select plus the three admin policies.
select policyname, cmd
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname like '%event cover%'
order by policyname;

-- Should return no rows, or a permission error. Both mean it is locked down.
-- select attendee_email from public.registrations;
