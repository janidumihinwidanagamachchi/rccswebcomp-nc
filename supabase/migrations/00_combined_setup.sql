-- ============================================================
-- CampusPulse Combined Setup Migration
-- Run this file once in Supabase SQL Editor, then create the
-- admin user in Authentication > Users, then run 004_seed_data.sql
-- ============================================================

-- ============================================================
-- 001_initial_schema.sql
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table extends Supabase auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'teacher', 'admin')),
  grade INTEGER CHECK (grade >= 1 AND grade <= 13),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories for events and announcements
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#6366f1',
  icon TEXT NOT NULL DEFAULT 'Calendar',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'draft',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER CHECK (capacity > 0),
  registration_opens_at TIMESTAMPTZ NOT NULL,
  registration_closes_at TIMESTAMPTZ NOT NULL,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  organizer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations / tickets table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL UNIQUE,
  qr_code_data TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('registered', 'attended', 'cancelled')) DEFAULT 'registered',
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_grade INTEGER CHECK (attendee_grade >= 1 AND attendee_grade <= 13),
  notes TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Highlights / live feed table
CREATE TABLE IF NOT EXISTS highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('text', 'photo', 'result')) DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket ON registrations(ticket_number);
CREATE INDEX IF NOT EXISTS idx_highlights_event ON highlights(event_id);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(published_at);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, grade)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    (NEW.raw_user_meta_data->>'grade')::INTEGER
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    grade = EXCLUDED.grade,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 002_rls_policies.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

-- Profiles: readable by all, updatable by owner
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: readable by all, manageable by admins
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categories are manageable by admins" ON categories;
CREATE POLICY "Categories are manageable by admins"
  ON categories FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Events: public can read published, admins can manage
DROP POLICY IF EXISTS "Published events are viewable by everyone" ON events;
CREATE POLICY "Published events are viewable by everyone"
  ON events FOR SELECT USING (status = 'published' OR status = 'completed');

DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events"
  ON events FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Announcements: public can read active, admins can manage
DROP POLICY IF EXISTS "Active announcements viewable by everyone" ON announcements;
CREATE POLICY "Active announcements viewable by everyone"
  ON announcements FOR SELECT USING (
    published_at <= NOW() AND (expires_at IS NULL OR expires_at > NOW())
  );

DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Registrations: users read own, admins read all, users create own
DROP POLICY IF EXISTS "Users can view own registrations" ON registrations;
CREATE POLICY "Users can view own registrations"
  ON registrations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all registrations" ON registrations;
CREATE POLICY "Admins can view all registrations"
  ON registrations FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can create own registrations" ON registrations;
CREATE POLICY "Users can create own registrations"
  ON registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update registrations" ON registrations;
CREATE POLICY "Admins can update registrations"
  ON registrations FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Highlights: public read, authenticated can insert, admins can delete
DROP POLICY IF EXISTS "Highlights are viewable by everyone" ON highlights;
CREATE POLICY "Highlights are viewable by everyone"
  ON highlights FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create highlights" ON highlights;
CREATE POLICY "Authenticated users can create highlights"
  ON highlights FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can delete highlights" ON highlights;
CREATE POLICY "Admins can delete highlights"
  ON highlights FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 003_functions.sql
-- ============================================================

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

-- ============================================================
-- 005_site_settings.sql
-- ============================================================

-- Site-wide settings store (appearance, brand, SEO)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings (Royal Navy & Gold preset)
INSERT INTO site_settings (key, value)
VALUES (
  'site_settings',
  '{
    "theme": { "mode": "dark", "radius": "0.75rem" },
    "colors": {
      "light": {
        "background": "#f8fafc",
        "foreground": "#0b132b",
        "card": "#ffffff",
        "cardForeground": "#0b132b",
        "popover": "#ffffff",
        "popoverForeground": "#0b132b",
        "primary": "#ffd700",
        "primaryForeground": "#0b132b",
        "secondary": "#edf2f7",
        "secondaryForeground": "#0b132b",
        "muted": "#f1f5f9",
        "mutedForeground": "#64748b",
        "accent": "#48cae4",
        "accentForeground": "#0b132b",
        "destructive": "#ef4444",
        "destructiveForeground": "#ffffff",
        "border": "#e2e8f0",
        "input": "#e2e8f0",
        "ring": "#ffd700"
      },
      "dark": {
        "background": "#070d1e",
        "foreground": "#f8fafc",
        "card": "#131b33",
        "cardForeground": "#ffffff",
        "popover": "#1a2440",
        "popoverForeground": "#e2e8f0",
        "primary": "#ffd700",
        "primaryForeground": "#070d1e",
        "secondary": "#2b3d54",
        "secondaryForeground": "#ffffff",
        "muted": "#0f1c33",
        "mutedForeground": "#94a3b8",
        "accent": "#48cae4",
        "accentForeground": "#070d1e",
        "destructive": "#ef4444",
        "destructiveForeground": "#ffffff",
        "border": "#22324a",
        "input": "#0e1a2e",
        "ring": "#ffd700"
      }
    },
    "fonts": { "body": "Nunito Sans", "heading": "Shippori Mincho B1", "display": "Bebas Neue" },
    "brand": { "name": "CampusPulse", "motto": "Disce Aut Discede", "logoUrl": "" },
    "seo": { "title": "CampusPulse | School Events Command Center", "description": "Discover, register, and experience every school event in one beautiful command center built for students, teachers, and parents.", "ogImageUrl": "" },
    "hero": { "badge": "BTUI'26 Competition Entry", "headline": "Your school events, reimagined.", "subtitle": "Discover, register, and experience every school event in one beautiful command center built for students, teachers, and parents.", "primaryCta": { "label": "Browse Events", "href": "/events" }, "secondaryCta": { "label": "View Calendar", "href": "/calendar" }, "backgroundImageUrl": "", "showCountdown": true }
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON site_settings;
CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

