# RCCSWebComp-NC

RCCSWebComp-NC is a school events hub I built for BTUI'26. Students, teachers, and parents can see what's happening at school, register for events, and get a QR ticket right away. Admins get their own dashboard to run the whole thing.

The idea came from a simple annoyance: events get announced in five different places and half the school still misses them. This puts all of it in one spot.

## What it does

- **Events** — a public events page with search and category filters, plus a detail page for each event with the schedule, location, capacity, and a countdown that changes meaning as the event timeline moves (registration opens, registration closes, happening now, ended).
- **Registration and tickets** — sign in, fill out a short form, get a ticket with a unique number and a QR code. Capacity is enforced, and you can't register twice for the same event.
- **Calendar** — month, week, and agenda views with category filters, month/year jump-to pickers, URL-shareable dates, and `.ics` / Google Calendar export for events.
- **Announcements** — with priority levels, and they drop off the site on their own once they expire.
- **Highlights** — a live feed on each event page where people post updates and photos. New posts appear instantly through Supabase Realtime.
- **Admin dashboard** — create and edit events, post announcements, and see who's registered. Check-in happens through a dedicated ticket-validation page with a camera QR scanner or manual ticket entry.
- **Event Passport** — a small gamified touch. Attending events collects stamps on your profile.

A couple of extras that made the cut: full theme customization from the admin settings (colors, fonts, radius, and the homepage hero text), dark/light mode, and an interactive grid background that follows your cursor.

## Built with

React 19 and TypeScript on Vite, Tailwind v4, and a component library I wrote by hand rather than pulling one in. Supabase covers the database, auth, and realtime. TanStack Query handles server data, Zustand holds the small bits of client state, React Hook Form and Zod take care of forms, and CSS keyframes drive the animations with `prefers-reduced-motion` support.

## Running it locally

You'll need Node 18+, a Supabase project, and a Vercel account if you plan to deploy.

1. Install dependencies.

   ```bash
   npm install
   ```

2. Copy the env template and add your Supabase URL and anon key (found under Project Settings > API).

   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. In the Supabase SQL editor, run `supabase/migrations/00_combined_setup.sql`. One file sets up the tables, RLS policies, functions, and default settings.

4. Create the demo admin under Authentication > Users > Add User, using `admin@rccswebcomp.demo` and `DemoAdmin123!`. A trigger creates the matching profile for you. You can also set the user metadata to `{"role": "admin"}` when creating the user so the profile starts with the right role.

5. Run `supabase/migrations/004_seed_data.sql`. Do this after the admin user exists, since it sets the admin role and adds the sample categories and events.

6. Start the dev server and open http://localhost:5173.

   ```bash
   npm run dev
   ```

The admin login is `admin@rccswebcomp.demo` / `DemoAdmin123!`. Everyone else can sign up at `/auth/register`.

### Admin panel not showing?

If you log in with the admin account but you don't see the admin icon in the navbar, or `/admin` redirects you back home, the profile's `role` isn't set to `admin`. This usually happens when the admin user is created in the Supabase dashboard without `{"role": "admin"}` metadata.

Run this in the Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@rccswebcomp.demo' LIMIT 1
);
```

Or run `supabase/migrations/007_fix_admin_role.sql`, then refresh the app and sign in again.

## Recent updates

- **Design-token refactor** — replaced `background`/`foreground`/`card`/`primary`/etc. with a custom naming scheme (`canvas`, `ink`, `panel`, `brand`, `quiet`, `highlight`, `danger`, `line`, `field`, `focus`) across the UI and database seeds.
- **Removed Framer Motion and `class-variance-authority`** — components now use React 19 ref-as-prop functions and CSS keyframes, shrinking the bundle.
- **Calendar upgrade** — added week/agenda views, multi-day event bars, month/year pickers, category filtering, URL state, and `.ics` / Google Calendar export.
- **Ticket validation page** — new `/admin/validate` route with a lazy-loaded ZXing QR scanner and manual ticket lookup.
- **Admin role fix** — `007_fix_admin_role.sql` makes it easy to recover when the demo admin is created without the right role metadata.

## Deploying

### GitHub Pages

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the app and deploys the `dist/` folder to GitHub Pages on every push to `main`.

Before the first deploy:

1. Push this repo to GitHub.
2. Go to **Settings > Pages** and set the source to **GitHub Actions**.
3. Add two repository secrets under **Settings > Secrets and variables > Actions**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Push to `main`. The workflow will build and deploy to `https://yourusername.github.io/rccswebcomp-nc/`.

Because this is a single-page app, the workflow also copies `dist/index.html` to `dist/404.html` so refreshing on any route works.

### Vercel

Alternatively, push to GitHub and import the project in Vercel with the Vite preset. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables. The rewrite rule in `vercel.json` keeps client-side routing working on refresh.

## How it's put together

A few decisions worth calling out:

**Security lives in the database, not the UI.** Supabase RLS policies decide who can read and write each table, so a wrong query in the frontend can't leak anything. Event capacity is enforced by a trigger on `registrations` — a registration that would overflow an event gets rejected by Postgres itself, not just hidden in the interface. There's also a unique constraint on `(event_id, user_id)` so double registration is impossible.

**Server state and client state are kept apart.** Anything that comes from Supabase goes through TanStack Query for caching and loading states. Zustand only holds things that are truly local: the auth session, the theme choice, and the mobile menu.

**Theming is done with CSS variables.** Every color, font, and radius is a custom property applied at runtime, which is why the admin settings page can preview changes live without re-rendering anything.

**The folder layout:**

```
src/
├── app/          router, providers, entry
├── components/   ui primitives, layout, and feature components
├── hooks/        data hooks (events, registrations, highlights, settings)
├── lib/          supabase client, validators, theme and font helpers
├── pages/        route pages, with admin pages under pages/admin
├── stores/       zustand auth and UI stores
├── styles/       global CSS and theme variables
└── types/        shared TypeScript types

supabase/
└── migrations/   schema, RLS, functions, seeds, combined setup
```

## What I'd add next

The honest list: email notifications for upcoming events, waitlists when an event fills up, and moving the registration count on event cards to a realtime subscription so it updates without a refresh. I'd also add recurring events and a bulk-import flow for term schedules.

## License

Written for BTUI'26. All code is original.

## Note on AI use

AI was used only to help write the demo content — the sample events, announcements, and some
interface copy. It was not used to build the application itself.

Examples of AI-assisted content:

- Sample event descriptions, such as the Cricket Match ("The inter-house cricket tournament runs
  all day across two pitches. Come play or come cheer.") and the Science Fair ("Projects from
  Grades 6 to 13, from simple circuits to full builds.")
- Sample announcements, such as "Buses leave at 7:15 on Sports Day" and "Lost and found at the
  front office"
- Interface copy, such as the homepage headline "What's on at school, without the guesswork."
