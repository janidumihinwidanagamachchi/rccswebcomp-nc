# RCCSWebComp-NC

School events hub built for BTUI'26. Students, teachers, and parents can see what's happening at school, register for events, and get a QR ticket right away. Admins get their own dashboard to run the whole thing.

The idea came from a simple annoyance: events get announced in five different places and half the school still misses them. This puts it all in one spot.

## What it does

- **Events** — public events page with search and category filters; each event has its schedule, location, capacity, and a countdown that changes as the event moves along.
- **Registration and tickets** — sign in, fill a short form, get a ticket with a unique number and a QR code. Capacity is enforced and you can't register twice.
- **Calendar** — month, week, and agenda views, month/year pickers, shareable date URLs, and `.ics` / Google Calendar export.
- **Announcements** — priority levels; they expire on their own.
- **Highlights** — live feed on each event page; updates and photos show up instantly.
- **Admin dashboard** — create and edit events, post announcements, see who's registered, and check people in with a QR camera scanner or manual entry.
- **Event Passport** — attending events collects stamps on your profile, with a public leaderboard of everyone's stamps.

A couple of extras too: theme customization from admin settings (colors, fonts, homepage text), dark/light mode, and a homepage gradient.

## Built with

React and TypeScript, Tailwind CSS for styling, Supabase for the database, auth, and realtime.

## File structure

- `src/` — React frontend (pages, components, hooks, stores, styles)
- `scripts/` — build/theme helper
- `supabase/` — site theme settings used at build time
- `public/` — static assets
- `.github/` — GitHub Pages deploy workflow

## Accessing the app

The app is hosted on GitHub Pages and is already live — no setup required.

1. Open https://janidumihinwidanagamachchi.github.io/rccswebcomp-nc/
2. Browse events on the homepage, or use **Events** for the full list with search and category filters.
3. Open **Calendar** for month, week, and agenda views, with `.ics` and Google Calendar export.
4. Sign in with one of the demo accounts below to register for an event and receive a QR ticket.

Sign-in accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@rccswebcomp.demo` | `DemoAdmin123!` |
| Student | `passport2@rccswebcomp.demo` (Binuka Silva) | `Student123!` |
| Student | `passport3@rccswebcomp.demo` (Chamari Fernando) | `Student123!` |

The admin account unlocks the dashboard at `/admin`: create and edit events, post
announcements, see registrations, and check people in with the QR scanner.

Source is in this repository. Every push to `main` is built and deployed
automatically by GitHub Actions, so the live site always matches the latest commit.

## Admin notes

When adding or editing an event, make sure to select the status. Only
`published` and `completed` events appear on the public site, so an event left as
`draft` is invisible to students until the status is changed.

Supabase image uploads require the storage migration to be applied once. Run
`supabase/apply_pending_migrations.sql` in the Supabase SQL editor, which creates
the `event-covers` bucket and its access policies.