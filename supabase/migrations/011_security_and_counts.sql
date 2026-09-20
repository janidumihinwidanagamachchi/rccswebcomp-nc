-- ============================================================
-- 011_security_and_counts.sql
-- Hardening migration for live projects.
-- Run this in Supabase SQL Editor after previous migrations.
-- ============================================================

-- 1. Secure handle_new_user: never allow client metadata to grant admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role TEXT;
  safe_role TEXT;
  requested_grade TEXT;
BEGIN
  requested_role := NEW.raw_user_meta_data->>'role';
  safe_role := CASE
    WHEN requested_role IN ('student', 'parent', 'teacher') THEN requested_role
    ELSE 'student'
  END;

  requested_grade := NEW.raw_user_meta_data->>'grade';

  INSERT INTO public.profiles (id, full_name, role, grade)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    safe_role,
    CASE WHEN requested_grade ~ '^\d+$' THEN requested_grade::INTEGER ELSE NULL END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = CASE
      WHEN EXCLUDED.role = 'admin' THEN public.profiles.role
      ELSE EXCLUDED.role
    END,
    grade = EXCLUDED.grade,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Prevent users from changing their own role
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
      RETURN NEW;
    END IF;
    RAISE EXCEPTION 'Role can only be changed by an admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS prevent_profile_role_change ON public.profiles;
CREATE TRIGGER prevent_profile_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_change();

-- 3. Tighten profiles UPDATE policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Secure helper functions
CREATE OR REPLACE FUNCTION public.is_event_full(event_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  event_capacity INTEGER;
  registered_count INTEGER;
BEGIN
  SELECT capacity INTO event_capacity FROM public.events WHERE id = event_uuid;
  IF event_capacity IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT COUNT(*) INTO registered_count
  FROM public.registrations
  WHERE event_id = event_uuid AND status IN ('registered', 'attended');

  RETURN registered_count >= event_capacity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.verify_ticket(ticket_text TEXT)
RETURNS TABLE (
  ticket_number TEXT,
  status TEXT,
  event_title TEXT,
  attendee_name TEXT
) AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT r.ticket_number, r.status, e.title, r.attendee_name
  FROM public.registrations r
  JOIN public.events e ON r.event_id = e.id
  WHERE r.ticket_number = ticket_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Capacity enforcement with row lock and correct status count
CREATE OR REPLACE FUNCTION public.check_registration_capacity()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM 1 FROM public.events WHERE id = NEW.event_id FOR UPDATE;

  IF EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = NEW.event_id
      AND e.capacity IS NOT NULL
      AND e.capacity <= (
        SELECT COUNT(*) FROM public.registrations r
        WHERE r.event_id = e.id AND r.status IN ('registered', 'attended')
      )
  ) THEN
    RAISE EXCEPTION 'Event has reached its capacity';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS enforce_capacity ON public.registrations;
CREATE TRIGGER enforce_capacity
  BEFORE INSERT ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.check_registration_capacity();

-- 6. Add registration_count column and backfill
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_count INTEGER NOT NULL DEFAULT 0;

UPDATE public.events e
SET registration_count = COALESCE((
  SELECT COUNT(*) FROM public.registrations r
  WHERE r.event_id = e.id AND r.status IN ('registered', 'attended')
), 0);

-- 7. Maintain registration_count automatically
CREATE OR REPLACE FUNCTION public.maintain_registration_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status IN ('registered', 'attended') THEN
      UPDATE public.events SET registration_count = registration_count + 1 WHERE id = NEW.event_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IN ('registered', 'attended') AND NEW.status NOT IN ('registered', 'attended') THEN
      UPDATE public.events SET registration_count = registration_count - 1 WHERE id = NEW.event_id;
    ELSIF OLD.status NOT IN ('registered', 'attended') AND NEW.status IN ('registered', 'attended') THEN
      UPDATE public.events SET registration_count = registration_count + 1 WHERE id = NEW.event_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status IN ('registered', 'attended') THEN
      UPDATE public.events SET registration_count = registration_count - 1 WHERE id = OLD.event_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS maintain_registration_count ON public.registrations;
CREATE TRIGGER maintain_registration_count
  AFTER INSERT OR UPDATE OR DELETE ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.maintain_registration_count();

-- 8. Server-side ticket number generation for empty client values
CREATE OR REPLACE FUNCTION public.set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := 'EVT-' || upper(substring(NEW.event_id::text from 1 for 6)) || '-' || upper(substring(gen_random_uuid()::text from 1 for 4));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS set_ticket_number ON public.registrations;
CREATE TRIGGER set_ticket_number
  BEFORE INSERT ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.set_ticket_number();

-- 9. Restrict registration INSERT to published, open events and status='registered'
DROP POLICY IF EXISTS "Users can create own registrations" ON registrations;
CREATE POLICY "Users can create own registrations"
  ON registrations FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND status = 'registered'
    AND EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id
        AND e.status = 'published'
        AND e.registration_opens_at <= NOW()
        AND e.registration_closes_at >= NOW()
    )
  );

-- 10. Allow users to cancel their own registrations
DROP POLICY IF EXISTS "Users can cancel own registrations" ON registrations;
CREATE POLICY "Users can cancel own registrations"
  ON registrations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status = 'cancelled');

-- 11. Restrict highlights to published/completed events
DROP POLICY IF EXISTS "Authenticated users can create highlights" ON highlights;
CREATE POLICY "Authenticated users can create highlights"
  ON highlights FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id AND e.status IN ('published', 'completed')
    )
  );
