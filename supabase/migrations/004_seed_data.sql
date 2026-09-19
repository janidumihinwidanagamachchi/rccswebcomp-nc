-- Seed default categories
INSERT INTO categories (name, slug, color, icon, sort_order) VALUES
  ('Academic', 'academic', '#3b82f6', 'GraduationCap', 1),
  ('Sports', 'sports', '#f97316', 'Trophy', 2),
  ('Arts', 'arts', '#ec4899', 'Palette', 3),
  ('Culture', 'culture', '#a855f7', 'Globe', 4),
  ('Tech', 'tech', '#06b6d4', 'Cpu', 5),
  ('Music', 'music', '#f43f5e', 'Music', 6)
ON CONFLICT (slug) DO NOTHING;

-- Seed demo admin user
-- IMPORTANT: Run this file AFTER creating the admin user in Supabase Auth.
-- Authentication > Users > Add User
-- Email: admin@campuspulse.demo
-- Password: DemoAdmin123!
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Try to find an existing user with the demo email
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@campuspulse.demo' LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET role = 'admin',
        full_name = 'Demo Admin',
        updated_at = NOW()
    WHERE id = admin_user_id;
  END IF;
END $$;

-- Seed sample events (optional, remove if not needed)
INSERT INTO events (
  title, slug, short_description, description, category_id, status,
  start_date, end_date, location, capacity, registration_opens_at, registration_closes_at,
  featured, organizer_id
)
SELECT
  'Annual Sports Day',
  'annual-sports-day',
  'A full day of athletic competitions, team games, and house spirit.',
  'Join us for the biggest sports event of the year. Students from all grades will compete in track and field, team sports, and fun challenges. Parents and teachers are welcome to cheer!',
  id,
  'published',
  NOW() + INTERVAL '14 days',
  NOW() + INTERVAL '14 days 6 hours',
  'School Sports Ground',
  200,
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '12 days',
  true,
  NULL
FROM categories WHERE slug = 'sports'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO events (
  title, slug, short_description, description, category_id, status,
  start_date, end_date, location, capacity, registration_opens_at, registration_closes_at,
  featured, organizer_id
)
SELECT
  'Spring Arts Exhibition',
  'spring-arts-exhibition',
  'Showcasing creative works from students across all grade levels.',
  'Explore paintings, sculptures, digital art, and photography created by our talented student body. Light refreshments will be served.',
  id,
  'published',
  NOW() + INTERVAL '21 days',
  NOW() + INTERVAL '21 days 4 hours',
  'School Auditorium',
  150,
  NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '19 days',
  true,
  NULL
FROM categories WHERE slug = 'arts'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO events (
  title, slug, short_description, description, category_id, status,
  start_date, end_date, location, capacity, registration_opens_at, registration_closes_at,
  featured, organizer_id
)
SELECT
  'Robotics Workshop',
  'robotics-workshop',
  'Hands-on coding and robotics session for aspiring engineers.',
  'Build and program your own robot in this beginner-friendly workshop. No prior experience needed. Materials provided.',
  id,
  'published',
  NOW() + INTERVAL '10 days',
  NOW() + INTERVAL '10 days 3 hours',
  'STEM Lab',
  30,
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '8 days',
  false,
  NULL
FROM categories WHERE slug = 'tech'
ON CONFLICT (slug) DO NOTHING;

-- Seed sample announcement
INSERT INTO announcements (title, content, priority, published_at, expires_at)
VALUES (
  'Welcome to CampusPulse',
  'The new digital command center for school events is now live. Browse events, register for tickets, and stay updated with real-time announcements.',
  'high',
  NOW(),
  NOW() + INTERVAL '30 days'
)
ON CONFLICT DO NOTHING;
