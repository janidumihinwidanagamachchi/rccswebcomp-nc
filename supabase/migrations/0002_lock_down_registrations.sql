-- Stop exposing registrations to anonymous visitors. Run in the SQL editor.

revoke select on table public.registrations from anon;

-- Not applied. Tightening this breaks registration and check-in until those
-- writes move into SECURITY DEFINER RPCs.
-- revoke all on table public.registrations from anon, authenticated;
--
-- create policy "read own registrations" on public.registrations
--   for select to authenticated
--   using (user_id = auth.uid());

-- confirm
-- select attendee_email from public.registrations;
