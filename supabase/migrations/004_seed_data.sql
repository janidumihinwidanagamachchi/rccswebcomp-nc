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
-- Run this file AFTER creating the admin user in Supabase Auth.
-- Authentication > Users > Add User
-- Email: admin@rccswebcomp.demo
-- Password: DemoAdmin123!
-- Optional user metadata: {"role": "admin"} (the seed below fixes it either way)
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@rccswebcomp.demo' LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
    VALUES (admin_user_id, 'Demo Admin', 'admin', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin',
        full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name, 'Demo Admin'),
        updated_at = NOW();
  END IF;
END $$;

-- Sample events
INSERT INTO events (
  title, slug, short_description, description, category_id, status,
  start_date, end_date, location, capacity, registration_opens_at, registration_closes_at,
  featured, organizer_id
)
SELECT v.title, v.slug, v.short_description, v.description, c.id, 'published',
       v.start_date, v.end_date, v.location, v.capacity, v.reg_opens, v.reg_closes,
       v.featured, NULL
FROM (VALUES
  ('Annual Sports Day', 'annual-sports-day',
   'A full day of athletics, team games, and house events.',
   'Sprints, relays, team games and house events spread across the day. Students from every grade compete, and parents and teachers are welcome to watch.',
   'sports', '2026-10-23 08:00:00+05:30'::timestamptz, '2026-10-23 14:00:00+05:30'::timestamptz,
   'School Sports Ground', 200, '2026-09-15 08:00:00+05:30'::timestamptz, '2026-10-20 17:00:00+05:30'::timestamptz, true),

  ('Spring Arts Exhibition', 'spring-arts-exhibition',
   'Student work from every grade, on display.',
   'Paintings, sculpture, digital art, and photography from students in every grade. Refreshments in the hall.',
   'arts', '2026-11-06 10:00:00+05:30'::timestamptz, '2026-11-06 16:00:00+05:30'::timestamptz,
   'School Auditorium', 150, '2026-09-15 08:00:00+05:30'::timestamptz, '2026-11-03 17:00:00+05:30'::timestamptz, true),

  ('Robotics Workshop', 'robotics-workshop',
   'Build and program a robot in three hours.',
   'You get to build and program a small robot. No experience needed — all the parts are provided.',
   'tech', '2026-10-09 10:00:00+05:30'::timestamptz, '2026-10-09 13:00:00+05:30'::timestamptz,
   'STEM Lab', 30, '2026-09-15 08:00:00+05:30'::timestamptz, '2026-10-07 17:00:00+05:30'::timestamptz, false),

  ('Inter-House Cricket Match', 'inter-house-cricket',
   'Eight houses, one trophy.',
   'The inter-house cricket tournament runs all day across two pitches. Come play or come cheer. Teams are drawn by house.',
   'sports', '2026-10-30 08:00:00+05:30'::timestamptz, '2026-10-30 16:00:00+05:30'::timestamptz,
   'School Grounds', 120, '2026-09-19 08:00:00+05:30'::timestamptz, '2026-10-27 17:00:00+05:30'::timestamptz, true),

  ('Science Fair', 'science-fair',
   'Student projects and experiments from every grade.',
   'Projects from Grades 6 to 13, from simple circuits to full builds. Visitors can vote for the People''s Choice award.',
   'academic', '2026-11-06 09:00:00+05:30'::timestamptz, '2026-11-06 15:00:00+05:30'::timestamptz,
   'Main Hall', 200, '2026-09-19 08:00:00+05:30'::timestamptz, '2026-11-03 17:00:00+05:30'::timestamptz, false),

  ('Drama Night', 'drama-night',
   'Two one-act plays from the drama club.',
   'Doors open at 5:30. Free entry, limited seating.',
   'arts', '2026-11-13 18:00:00+05:30'::timestamptz, '2026-11-13 20:30:00+05:30'::timestamptz,
   'Auditorium', 250, '2026-09-19 08:00:00+05:30'::timestamptz, '2026-11-10 17:00:00+05:30'::timestamptz, false),

  ('Music Evening', 'music-evening',
   'Choir, band, and solo performances.',
   'An evening of performances across grades. Snacks after the show.',
   'music', '2026-11-20 18:30:00+05:30'::timestamptz, '2026-11-20 21:00:00+05:30'::timestamptz,
   'Auditorium', 200, '2026-09-19 08:00:00+05:30'::timestamptz, '2026-11-17 17:00:00+05:30'::timestamptz, false),

  ('Culture Day', 'culture-day',
   'Food, performances, and stalls from different cultures.',
   'Stalls, food, and performances put together by students. Wear something from your culture if you''d like.',
   'culture', '2026-10-16 09:00:00+05:30'::timestamptz, '2026-10-16 14:00:00+05:30'::timestamptz,
   'School Grounds', 300, '2026-09-19 08:00:00+05:30'::timestamptz, '2026-10-13 17:00:00+05:30'::timestamptz, true),

  ('Inter-House Football Tournament', 'inter-house-football',
   'Knockout rounds all day, house against house.',
   'Group matches in the morning, knockouts after lunch. Bring water and your house colours.',
   'sports', '2026-09-26 08:00:00+05:30'::timestamptz, '2026-09-26 15:00:00+05:30'::timestamptz,
   'School Grounds', 150, '2026-09-19 08:00:00+05:30'::timestamptz, '2026-09-24 17:00:00+05:30'::timestamptz, false),

  ('Chess Championship', 'chess-championship',
   'Swiss rounds, then a final table.',
   'Open to all grades. Bring your own board if you have one; clocks are provided.',
   'sports', '2026-10-07 13:00:00+05:30'::timestamptz, '2026-10-07 17:00:00+05:30'::timestamptz,
   'Library', 40, '2026-09-19 08:00:00+05:30'::timestamptz, '2026-10-05 17:00:00+05:30'::timestamptz, false),

  ('Coding Hackathon', 'coding-hackathon',
   'Six hours, one build, any language.',
   'Teams of up to four. Pick from three challenge briefs on the day. Lunch provided.',
   'tech', '2026-10-10 09:00:00+05:30'::timestamptz, '2026-10-10 18:00:00+05:30'::timestamptz,
   'STEM Lab', 60, '2026-09-19 08:00:00+05:30'::timestamptz, '2026-10-07 17:00:00+05:30'::timestamptz, false),

  ('Debate Finals', 'debate-finals',
   'The final rounds of the inter-house debate.',
   'Four houses, two motions, one winner. Open to watch for all students.',
   'academic', '2026-10-09 14:00:00+05:30'::timestamptz, '2026-10-09 17:00:00+05:30'::timestamptz,
   'Main Hall', 120, '2026-09-19 08:00:00+05:30'::timestamptz, '2026-10-07 17:00:00+05:30'::timestamptz, false),

  ('Movie Night', 'movie-night',
   'A film on the big screen, voted by students.',
   'Bring a cushion. Entry is free and snacks are on sale at the door.',
   'culture', '2026-10-02 18:00:00+05:30'::timestamptz, '2026-10-02 21:00:00+05:30'::timestamptz,
   'Auditorium', 200, '2026-09-19 08:00:00+05:30'::timestamptz, '2026-09-30 17:00:00+05:30'::timestamptz, false)
) AS v(title, slug, short_description, description, category_slug, start_date, end_date,
       location, capacity, reg_opens, reg_closes, featured)
JOIN categories c ON c.slug = v.category_slug
ON CONFLICT (slug) DO NOTHING;

-- Welcome announcement
INSERT INTO announcements (title, content, priority, published_at, expires_at)
SELECT
  'Welcome to RCCSWebComp-NC',
  $c$Browse what's on this term, register for events, and get your tickets here. Announcements show up on this page as they are posted.$c$,
  'high',
  NOW(),
  NOW() + INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = 'Welcome to RCCSWebComp-NC');

-- Sample announcements
INSERT INTO announcements (title, content, priority, category_id, event_id, published_at, expires_at)
SELECT v.title, v.content, v.priority, c.id, e.id,
       NOW() - (v.days_ago || ' days')::interval,
       NOW() + (v.days_left || ' days')::interval
FROM (VALUES
  ('Cricket team lists are up',
   'House captains have posted the team lists outside the sports office. Check your name before Friday.',
   'normal', 'sports', 'inter-house-cricket', 1, 40),

  ('Buses leave at 7:15 on Sports Day',
   'If you are competing, be at the main gate by 7:10. Buses leave at 7:15 sharp.',
   'high', 'sports', 'annual-sports-day', 2, 35),

  ('Hackathon teams: register by Friday',
   'You can sign up on your own and we will place you in a team. Four people per team, maximum.',
   'normal', 'tech', 'coding-hackathon', 1, 25),

  ('Library closed Wednesday afternoon',
   'The library is closed from 12:30 to 5:00 on Wednesday for the chess championship.',
   'normal', 'academic', 'chess-championship', 3, 20),

  ('Lost and found at the front office',
   'Two water bottles, a blazer, and a calculator were handed in this week. Collect them from the front office.',
   'low', NULL::text, NULL::text, 2, 14),

  ('Culture Day stalls: sign up by Monday',
   'Want to run a stall? Put your name on the sheet outside the staff room by Monday.',
   'normal', 'culture', 'culture-day', 1, 30)
) AS v(title, content, priority, category_slug, event_slug, days_ago, days_left)
LEFT JOIN categories c ON c.slug = v.category_slug
LEFT JOIN events e ON e.slug = v.event_slug
WHERE NOT EXISTS (SELECT 1 FROM announcements a WHERE a.title = v.title);
