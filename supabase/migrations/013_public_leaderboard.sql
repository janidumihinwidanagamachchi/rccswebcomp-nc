-- Public Passport leaderboard.
-- Profiles are viewable by everyone, but registrations are owner-only under RLS,
-- so a non-admin cannot read other users' registrations. This SECURITY DEFINER
-- function aggregates the leaderboard server-side and exposes only counts and
-- category names/colors (no emails, ticket data, or notes).

CREATE OR REPLACE FUNCTION public.get_passport_leaderboard()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  board jsonb;
BEGIN
  SELECT COALESCE(jsonb_agg(j), '[]'::jsonb) INTO board
  FROM (
    SELECT jsonb_build_object(
      'user_id', p.id,
      'full_name', p.full_name,
      'role', p.role,
      'attended_count', COUNT(r.id) FILTER (WHERE r.status = 'attended'),
      'unique_categories', COUNT(DISTINCT e.category_id) FILTER (WHERE r.status = 'attended'),
      'early_bird_count', COUNT(r.id) FILTER (
        WHERE r.status <> 'cancelled'
          AND r.event_id IS NOT NULL
          AND r.registered_at < e.start_date
      ),
      'categories', COALESCE(
        (
          SELECT jsonb_agg(DISTINCT jsonb_build_object('slug', c.slug, 'color', c.color))
          FROM public.registrations ra
          JOIN public.events ev ON ev.id = ra.event_id
          JOIN public.categories c ON c.id = ev.category_id
          WHERE ra.user_id = p.id AND ra.status = 'attended'
        ),
        '[]'::jsonb
      )
    ) AS j
    FROM public.profiles p
    LEFT JOIN public.registrations r ON r.user_id = p.id
    LEFT JOIN public.events e ON e.id = r.event_id
    GROUP BY p.id, p.full_name, p.role
    ORDER BY COUNT(r.id) FILTER (WHERE r.status = 'attended') DESC, p.full_name ASC
  ) s;

  RETURN board;
END;
$$;

REVOKE ALL ON FUNCTION public.get_passport_leaderboard() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_passport_leaderboard() TO anon, authenticated;

COMMENT ON FUNCTION public.get_passport_leaderboard() IS
  'Aggregated Passport leaderboard (attended count, categories, early-bird count) for all players.';