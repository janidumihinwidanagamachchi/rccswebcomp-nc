-- Fix demo admin role
-- Run this in Supabase SQL Editor if you log in as the admin account but don't see
-- the admin dashboard or the admin icon in the navbar.
-- The signup trigger only allows student/parent/teacher roles from client metadata,
-- so admin users created through Authentication > Users > Add User need this one-time fix.

DO $$
DECLARE
  admin_email TEXT := 'admin@rccswebcomp.demo'; -- change this if your admin email is different
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email
  LIMIT 1;

  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'No auth user found with email %. Skipping.', admin_email;
    RETURN;
  END IF;

  INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
  VALUES (admin_user_id, 'Demo Admin', 'admin', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin',
      full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name, 'Demo Admin'),
      updated_at = NOW();

  RAISE NOTICE 'Set role=admin for % (id=%). Refresh the app and sign in again.', admin_email, admin_user_id;
END $$;
