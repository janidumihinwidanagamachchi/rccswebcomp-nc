-- Function to check event capacity before allowing registration
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

-- Ticket verification: admin only
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

REVOKE EXECUTE ON FUNCTION public.verify_ticket(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_ticket(TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_event_full(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_event_full(UUID) TO authenticated;

-- Trigger to enforce event capacity before new registrations
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

-- Maintain a cached registration_count on events (excludes cancelled)
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

-- Generate a server-side ticket number if the client leaves it empty
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
