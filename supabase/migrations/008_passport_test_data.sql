-- Passport test data: adds 4 test students + attended registrations so the Event Passport page shows real stats.
-- Run this in the Supabase SQL Editor after the admin user exists.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create test auth users (password: DemoPass123!)
--    If inserting into auth.users fails in your project, create these 4 users manually
--    in Authentication > Users with the same emails, then re-run this file.
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'authenticated', 'authenticated', 'passport1@rccswebcomp.demo', crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name": "Aisha Perera", "role": "student"}'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), 'authenticated', 'authenticated', 'passport2@rccswebcomp.demo', crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name": "Binuka Silva", "role": "student"}'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), 'authenticated', 'authenticated', 'passport3@rccswebcomp.demo', crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name": "Chamari Fernando", "role": "student"}'::jsonb, NOW(), NOW()),
  (gen_random_uuid(), 'authenticated', 'authenticated', 'passport4@rccswebcomp.demo', crypt('DemoPass123!', gen_salt('bf')), NOW(), '{"full_name": "Dinuka Ranasinghe", "role": "student"}'::jsonb, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 2. Seed attended registrations for test users + the demo admin.
--    registered_at is set 5 days ago so most events count as early-bird registrations.
WITH test_users AS (
  SELECT id, email, full_name
  FROM profiles
  WHERE email IN (
    'passport1@rccswebcomp.demo',
    'passport2@rccswebcomp.demo',
    'passport3@rccswebcomp.demo',
    'passport4@rccswebcomp.demo',
    'admin@rccswebcomp.demo',
    'admin@campuspulse.demo'
  )
),
registrations_to_seed AS (
  SELECT
    tu.id AS user_id,
    tu.email AS attendee_email,
    tu.full_name AS attendee_name,
    e.id AS event_id
  FROM test_users tu
  JOIN (VALUES
    -- Aisha: 3 sports events (Sports Fanatic) + academic + culture
    ('passport1@rccswebcomp.demo', 'annual-sports-day'),
    ('passport1@rccswebcomp.demo', 'inter-house-cricket'),
    ('passport1@rccswebcomp.demo', 'inter-house-football'),
    ('passport1@rccswebcomp.demo', 'chess-championship'),
    ('passport1@rccswebcomp.demo', 'culture-day'),

    -- Binuka: 6 categories (All-Rounder)
    ('passport2@rccswebcomp.demo', 'robotics-workshop'),
    ('passport2@rccswebcomp.demo', 'coding-hackathon'),
    ('passport2@rccswebcomp.demo', 'science-fair'),
    ('passport2@rccswebcomp.demo', 'spring-arts-exhibition'),
    ('passport2@rccswebcomp.demo', 'music-evening'),
    ('passport2@rccswebcomp.demo', 'culture-day'),

    -- Chamari: mix of culture, arts, sports, academic
    ('passport3@rccswebcomp.demo', 'movie-night'),
    ('passport3@rccswebcomp.demo', 'culture-day'),
    ('passport3@rccswebcomp.demo', 'spring-arts-exhibition'),
    ('passport3@rccswebcomp.demo', 'annual-sports-day'),
    ('passport3@rccswebcomp.demo', 'inter-house-football'),
    ('passport3@rccswebcomp.demo', 'debate-finals'),

    -- Dinuka: 3 sports events (Sports Fanatic)
    ('passport4@rccswebcomp.demo', 'annual-sports-day'),
    ('passport4@rccswebcomp.demo', 'inter-house-cricket'),
    ('passport4@rccswebcomp.demo', 'inter-house-football'),

    -- Demo admin: a few stamps
    ('admin@rccswebcomp.demo', 'annual-sports-day'),
    ('admin@rccswebcomp.demo', 'culture-day'),
    ('admin@campuspulse.demo', 'annual-sports-day'),
    ('admin@campuspulse.demo', 'culture-day')
  ) AS v(email, event_slug) ON tu.email = v.email
  JOIN events e ON e.slug = v.event_slug
)
INSERT INTO registrations (event_id, user_id, ticket_number, qr_code_data, status, attendee_name, attendee_email, registered_at)
SELECT
  rts.event_id,
  rts.user_id,
  'EVT-' || upper(substring(rts.user_id::text from 1 for 6)) || '-' || upper(substring(gen_random_uuid()::text from 1 for 4)),
  '{}'::text,
  'attended',
  rts.attendee_name,
  rts.attendee_email,
  NOW() - INTERVAL '5 days'
FROM registrations_to_seed rts
ON CONFLICT (event_id, user_id) DO NOTHING;
