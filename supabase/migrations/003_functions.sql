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

  SELECT COUNT(*) INTO registered_count FROM public.registrations WHERE event_id = event_uuid;

  RETURN registered_count >= event_capacity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: function to verify a ticket belongs to a valid registration
CREATE OR REPLACE FUNCTION public.verify_ticket(ticket_text TEXT)
RETURNS TABLE (
  ticket_number TEXT,
  status TEXT,
  event_title TEXT,
  attendee_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.ticket_number, r.status, e.title, r.attendee_name
  FROM public.registrations r
  JOIN public.events e ON r.event_id = e.id
  WHERE r.ticket_number = ticket_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to enforce event capacity before new registrations
CREATE OR REPLACE FUNCTION public.check_registration_capacity()
RETURNS TRIGGER AS $$
BEGIN
  IF public.is_event_full(NEW.event_id) THEN
    RAISE EXCEPTION 'Event has reached its capacity';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_capacity ON public.registrations;
CREATE TRIGGER enforce_capacity
  BEFORE INSERT ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.check_registration_capacity();
