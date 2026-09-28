# RCCSWebComp-NC

School events site for BTUI'26. Public pages list events and a calendar, signed-in students register and get a QR ticket, and admins run events, announcements and check-in from a dashboard.

Live: <https://janidumihinwidanagamachchi.github.io/rccswebcomp-nc/>

## Accounts

Sign-in runs on Supabase Auth, and the demo accounts were created by hand in the Supabase dashboard — they are not seeded by anything in this repo. The admin account opens `/admin`.

## What it does

- **Events** — public list with search and category filters, and a countdown per event.
- **Registration** — a signed-in student fills a short form and gets a ticket number and QR code. The registration window and the capacity are checked in the browser, not the server, so neither is actually enforced.
- **Calendar** — month, week and agenda views, shareable date URLs, and `.ics` or Google Calendar export per event.
- **Announcements** — priority levels, expiring on their own.
- **Highlights** — text feed on each event page over Supabase realtime, writable only while the event is running.
- **Admin** — create and edit events, post announcements, see registrations, check people in by camera or ticket number.
- **Event Passport** — badges for the events you attend, with a leaderboard. Sign-in required.
- **Theming** — colors, fonts, homepage copy and site name editable from admin, plus light/dark/system.

## Stack

React 19, TypeScript, Vite, Tailwind v4, Supabase (Postgres, auth, realtime, storage), TanStack Query, React Hook Form with Zod, Radix UI, `motion`. Static bundle on GitHub Pages, no server component.

## Notes

**The build will not fail on missing Supabase keys — it ships a broken page.** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are inlined at build time, and the check in `src/lib/supabase.ts` only runs when the browser loads the bundle, so a missing value surfaces as a white screen. CI has both as repository secrets.

**There is no `dev` script.** `vite.config.ts` hardcodes the Pages base path, so the build output is deployable as-is. `npx vite` works if you want a server.

**The database schema is not in this repo.** It lives in the live Supabase project. `supabase/migrations/` holds only the storage policies and one grant revocation, and `supabase db push` will not apply them — there is no `config.toml` and the filenames are not timestamped. Run them in the SQL editor.
**Event status decides whether anyone sees it.** Only `published` and `completed` appear on `/events` and `/calendar`, and the homepage shows only `published`. A `draft` stays invisible until the status changes.
