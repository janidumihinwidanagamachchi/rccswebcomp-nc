-- Content expansion: more events, announcements, highlights, and registrations.
-- Safe to re-run; uses ON CONFLICT / WHERE NOT EXISTS guards.
-- Run this AFTER 004_seed_data.sql, 006_content_update.sql, and 008_passport_test_data.sql.

-- 1. New events (completed, published, draft, cancelled)
WITH admin_user AS (
  SELECT p.id
  FROM profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE u.email = 'admin@rccswebcomp.demo'
  LIMIT 1
)
INSERT INTO events (
  title, slug, short_description, description, category_id, status,
  start_date, end_date, location, capacity, registration_opens_at, registration_closes_at,
  featured, organizer_id
)
SELECT
  v.title, v.slug, v.short_description, v.description, c.id, v.status,
  v.start_date, v.end_date, v.location, v.capacity, v.reg_opens, v.reg_closes,
  v.featured, au.id
FROM (VALUES
  ('Founders'' Day Assembly', 'founders-day-assembly',
   'Annual assembly honouring the school''s founders.',
   'Speeches, prize-giving and performances in Main Hall. The whole school files in for the morning, parents welcome.',
   'academic', 'completed',
   '2026-08-15 08:30:00+05:30'::timestamptz, '2026-08-15 11:00:00+05:30'::timestamptz,
   'Main Hall', 500, '2026-08-01 08:00:00+05:30'::timestamptz, '2026-08-14 17:00:00+05:30'::timestamptz, true),

  ('Inter-House Swimming Gala', 'inter-house-swimming-gala',
   'Fifty metres, four strokes, eight houses.',
   'Heats in the morning, finals after lunch. Bring towels and house colours; spectators can cheer from the stands.',
   'sports', 'completed',
   '2026-08-22 09:00:00+05:30'::timestamptz, '2026-08-22 15:00:00+05:30'::timestamptz,
   'School Swimming Pool', 200, '2026-08-08 08:00:00+05:30'::timestamptz, '2026-08-20 17:00:00+05:30'::timestamptz, true),

  ('Book Week Quiz', 'book-week-quiz',
   'Team trivia for book lovers.',
   'Questions cover classics, local authors, and recent releases. Teams can register through the library by Wednesday.',
   'culture', 'completed',
   '2026-09-05 14:00:00+05:30'::timestamptz, '2026-09-05 16:00:00+05:30'::timestamptz,
   'Library', 80, '2026-08-25 08:00:00+05:30'::timestamptz, '2026-09-04 17:00:00+05:30'::timestamptz, false),

  ('Parents'' Evening', 'parents-evening',
   'Meet teachers and discuss progress.',
   'Appointments run from 4pm to 7pm. Book a slot through the form sent by email, or walk in if time permits.',
   'academic', 'published',
   '2026-10-05 16:00:00+05:30'::timestamptz, '2026-10-05 19:00:00+05:30'::timestamptz,
   'Classroom Block', 300, '2026-09-20 08:00:00+05:30'::timestamptz, '2026-10-04 17:00:00+05:30'::timestamptz, true),

  ('Inter-House Netball Tournament', 'inter-house-netball',
   'Round-robin first, then the finals.',
   'Teams of seven per house. Matches run on both courts; the final is at 3pm.',
   'sports', 'published',
   '2026-10-12 09:00:00+05:30'::timestamptz, '2026-10-12 16:00:00+05:30'::timestamptz,
   'Indoor Courts', 200, '2026-09-22 08:00:00+05:30'::timestamptz, '2026-10-10 17:00:00+05:30'::timestamptz, true),

  ('Photography Walk', 'photography-walk',
   'A guided walk around the campus with cameras.',
   'Open to all skill levels. Bring a phone or camera; the best shots go into the term exhibition.',
   'arts', 'published',
   '2026-10-25 15:00:00+05:30'::timestamptz, '2026-10-25 17:30:00+05:30'::timestamptz,
   'Main Gate', 40, '2026-09-25 08:00:00+05:30'::timestamptz, '2026-10-24 17:00:00+05:30'::timestamptz, false),

  ('Diwali Celebration', 'diwali-celebration',
   'Lights, music, and sweets after school.',
   'Students and families are invited to celebrate with performances, rangoli, and traditional sweets.',
   'culture', 'published',
   '2026-10-31 17:00:00+05:30'::timestamptz, '2026-10-31 20:00:00+05:30'::timestamptz,
   'School Grounds', 400, '2026-09-26 08:00:00+05:30'::timestamptz, '2026-10-30 17:00:00+05:30'::timestamptz, true),

  ('AI & Robotics Club Demo Day', 'ai-robotics-club-demo',
   'See what the club has built this term.',
   'Robots, machine-learning demos, and short talks by club members. Open to all grades.',
   'tech', 'published',
   '2026-11-08 13:00:00+05:30'::timestamptz, '2026-11-08 16:00:00+05:30'::timestamptz,
   'STEM Lab', 80, '2026-10-01 08:00:00+05:30'::timestamptz, '2026-11-06 17:00:00+05:30'::timestamptz, false),

  ('Winter Concert', 'winter-concert',
   'Band, choir, and solo performances.',
   'An evening of music from the school ensembles. Tickets at the door; seats are unreserved.',
   'music', 'published',
   '2026-11-18 18:00:00+05:30'::timestamptz, '2026-11-18 20:30:00+05:30'::timestamptz,
   'Auditorium', 250, '2026-10-10 08:00:00+05:30'::timestamptz, '2026-11-16 17:00:00+05:30'::timestamptz, true),

  ('Spring Musical Auditions', 'spring-musical-auditions',
   'Auditions for the term musical.',
   'Prepare a one-minute song and a short monologue. Sign-up sheets are outside the drama room.',
   'arts', 'draft',
   '2026-11-20 15:30:00+05:30'::timestamptz, '2026-11-20 18:00:00+05:30'::timestamptz,
   'Drama Room', 60, '2026-11-01 08:00:00+05:30'::timestamptz, '2026-11-19 17:00:00+05:30'::timestamptz, false),

  ('Outdoor Cinema Night', 'outdoor-cinema-night',
   'A film under the stars — cancelled due to weather.',
   'This event has been cancelled. We will reschedule for later in the term.',
   'culture', 'cancelled',
   '2026-10-01 18:00:00+05:30'::timestamptz, '2026-10-01 21:30:00+05:30'::timestamptz,
   'School Grounds', 300, '2026-09-15 08:00:00+05:30'::timestamptz, '2026-09-30 17:00:00+05:30'::timestamptz, false)
) AS v(title, slug, short_description, description, category_slug, status,
        start_date, end_date, location, capacity, reg_opens, reg_closes, featured)
JOIN categories c ON c.slug = v.category_slug
CROSS JOIN admin_user au
ON CONFLICT (slug) DO NOTHING;

-- 2. More announcements
INSERT INTO announcements (title, content, priority, category_id, event_id, published_at, expires_at)
SELECT v.title, v.content, v.priority, c.id, e.id,
       NOW() - (v.days_ago || ' days')::interval,
       NOW() + (v.days_left || ' days')::interval
FROM (VALUES
  ('Term exam schedule released',
   'The end-of-term exam timetable is now available on the student portal. Check your room allocations carefully.',
   'urgent', 'academic', NULL::text, 1, 45),

  ('Sports Day volunteer sign-ups close tomorrow',
   'We still need helpers for timing and refreshments. Sign up at the sports office before 3pm.',
   'high', 'sports', 'annual-sports-day', 1, 5),

  ('New books in the library',
   'A fresh batch of fiction and reference books has arrived. Borrowing starts on Monday.',
   'normal', 'academic', NULL::text, 2, 30),

  ('School bus route changes',
   'Route C will stop at the new gate from Monday. Route A and B are unchanged.',
   'high', NULL::text, NULL::text, 1, 20),

  ('Photography club exhibition this Friday',
   'Selected shots from the photography walk will be on display in the foyer all day Friday.',
   'normal', 'arts', 'photography-walk', 1, 10),

  ('Diwali celebration: all welcome',
   'Families are welcome to join the Diwali celebration on Friday evening. Performances start at 5:30pm.',
   'normal', 'culture', 'diwali-celebration', 2, 15),

  ('Lost: school blazer',
   'A navy school blazer was left in the cafeteria on Tuesday. Hand it in at the front office if found.',
   'low', NULL::text, NULL::text, 3, 7),

  ('Winter Concert tickets on sale',
   'Tickets for the Winter Concert are now on sale at the front office and online. Get yours before they sell out.',
   'normal', 'music', 'winter-concert', 2, 25),

  ('Book Week Quiz reminder',
   'The quiz is this Thursday after school. Teams must be registered by Wednesday.',
   'normal', 'academic', 'book-week-quiz', 45, -30)
) AS v(title, content, priority, category_slug, event_slug, days_ago, days_left)
LEFT JOIN categories c ON c.slug = v.category_slug
LEFT JOIN events e ON e.slug = v.event_slug
WHERE NOT EXISTS (SELECT 1 FROM announcements a WHERE a.title = v.title);

-- 3. Highlights (live updates) for completed and upcoming events
WITH authors AS (
  SELECT p.id, u.email
  FROM profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE u.email IN (
    'admin@rccswebcomp.demo',
    'passport1@rccswebcomp.demo',
    'passport2@rccswebcomp.demo',
    'passport3@rccswebcomp.demo',
    'passport4@rccswebcomp.demo'
  )
),
events_lookup AS (
  SELECT id, slug FROM events WHERE slug IN (
    'annual-sports-day',
    'culture-day',
    'founders-day-assembly',
    'inter-house-swimming-gala',
    'book-week-quiz',
    'spring-arts-exhibition',
    'coding-hackathon',
    'ai-robotics-club-demo',
    'winter-concert'
  )
),
highlights_to_seed AS (
  SELECT
    e.id AS event_id,
    a.id AS author_id,
    v.content,
    v.type,
    v.media_url
  FROM (VALUES
    ('annual-sports-day', 'admin@rccswebcomp.demo', 'House points have been updated after the track events.', 'text', NULL),
    ('annual-sports-day', 'passport1@rccswebcomp.demo', 'Thanks to all the volunteers and teachers who helped today.', 'text', NULL),
    ('culture-day', 'admin@rccswebcomp.demo', 'Food stalls are now open — visit the culture room.', 'text', NULL),
    ('culture-day', 'passport2@rccswebcomp.demo', 'Performances are underway in the culture room.', 'text', NULL),
    ('founders-day-assembly', 'admin@rccswebcomp.demo', 'Chief guest has arrived and the programme is starting.', 'text', NULL),
    ('founders-day-assembly', 'passport3@rccswebcomp.demo', 'Prize distribution is underway. Congratulations to the winners.', 'text', NULL),
    ('inter-house-swimming-gala', 'admin@rccswebcomp.demo', 'Records were broken in the under-16 freestyle today.', 'result', NULL),
    ('inter-house-swimming-gala', 'passport4@rccswebcomp.demo', 'Final medal tally: 1st Mars, 2nd Venus, 3rd Jupiter.', 'result', NULL),
    ('book-week-quiz', 'admin@rccswebcomp.demo', 'Winners have been announced. Well done to all teams.', 'result', NULL),
    ('book-week-quiz', 'passport1@rccswebcomp.demo', 'A great turnout in the library this afternoon.', 'text', NULL),
    ('spring-arts-exhibition', 'admin@rccswebcomp.demo', 'Doors are open. Come see the student work in the hall.', 'text', NULL),
    ('coding-hackathon', 'passport2@rccswebcomp.demo', 'First team has submitted their project. Demo presentations begin at 2pm.', 'text', NULL),
    ('ai-robotics-club-demo', 'admin@rccswebcomp.demo', 'Demo schedule is now live. Talks start at 1:30pm.', 'text', NULL),
    ('winter-concert', 'admin@rccswebcomp.demo', 'Rehearsals are going well. Tickets are still available at the door.', 'text', NULL),
    ('winter-concert', 'passport3@rccswebcomp.demo', 'Rehearsals are sounding great.', 'text', NULL)
  ) AS v(event_slug, author_email, content, type, media_url)
  JOIN events_lookup e ON e.slug = v.event_slug
  JOIN authors a ON a.email = v.author_email
)
INSERT INTO highlights (event_id, author_id, content, media_url, type)
SELECT event_id, author_id, content, media_url, type
FROM highlights_to_seed hts
WHERE NOT EXISTS (
  SELECT 1 FROM highlights h
  WHERE h.event_id = hts.event_id
    AND h.author_id = hts.author_id
    AND h.content = hts.content
);

-- 4. More registrations for new events (registered, attended, cancelled)
WITH users AS (
  SELECT p.id, p.full_name, u.email
  FROM profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE u.email IN (
    'admin@rccswebcomp.demo',
    'passport1@rccswebcomp.demo',
    'passport2@rccswebcomp.demo',
    'passport3@rccswebcomp.demo',
    'passport4@rccswebcomp.demo'
  )
),
events_for_regs AS (
  SELECT id, slug, start_date, status FROM events WHERE slug IN (
    'founders-day-assembly',
    'inter-house-swimming-gala',
    'book-week-quiz',
    'parents-evening',
    'inter-house-netball',
    'photography-walk',
    'diwali-celebration',
    'ai-robotics-club-demo',
    'winter-concert'
  )
),
registrations_to_seed AS (
  SELECT
    u.id AS user_id,
    u.email AS attendee_email,
    u.full_name AS attendee_name,
    e.id AS event_id,
    e.status AS event_status,
    CASE
      WHEN e.status = 'completed' THEN 'attended'
      WHEN u.email IN ('passport3@rccswebcomp.demo', 'passport4@rccswebcomp.demo') AND e.slug IN ('photography-walk', 'ai-robotics-club-demo') THEN 'cancelled'
      WHEN u.email = 'admin@rccswebcomp.demo' AND e.slug = 'winter-concert' THEN 'registered'
      ELSE 'registered'
    END AS status
  FROM users u
  CROSS JOIN events_for_regs e
  WHERE NOT (e.slug = 'photography-walk' AND u.email IN ('passport1@rccswebcomp.demo', 'passport2@rccswebcomp.demo'))
)
INSERT INTO registrations (event_id, user_id, ticket_number, qr_code_data, status, attendee_name, attendee_email, registered_at)
SELECT
  rts.event_id,
  rts.user_id,
  'EVT-' || upper(substring(rts.user_id::text from 1 for 6)) || '-' || upper(substring(gen_random_uuid()::text from 1 for 4)),
  '{}'::text,
  rts.status,
  rts.attendee_name,
  rts.attendee_email,
  CASE
    WHEN rts.status = 'attended' AND rts.event_status = 'completed' THEN (SELECT start_date FROM events_for_regs e WHERE e.id = rts.event_id) - INTERVAL '7 days'
    WHEN rts.status = 'cancelled' THEN NOW() - INTERVAL '2 days'
    ELSE NOW() - INTERVAL '1 day'
  END
FROM registrations_to_seed rts
ON CONFLICT (event_id, user_id) DO NOTHING;

-- END