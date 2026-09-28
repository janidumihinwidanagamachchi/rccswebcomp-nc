-- Event cover photos. Run in the Supabase SQL editor.

-- bucket
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

-- public read
drop policy if exists "event covers are public" on storage.objects;
create policy "event covers are public" on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'event-covers');

-- admin write
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

-- confirm
select id, name, public, file_size_limit
from storage.buckets
where id = 'event-covers';

select policyname, cmd
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and policyname like '%event cover%'
order by policyname;
