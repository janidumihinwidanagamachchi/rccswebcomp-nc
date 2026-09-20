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
- `supabase/` — SQL migrations and demo data
- `scripts/` — build/theme and data-export helpers
- `public/` — static assets
- `.github/` — GitHub Pages deploy workflow

## Live

- Website: https://janidumihinwidanagamachchi.github.io/rccswebcomp-nc/
- Admin login: `admin@rccswebcomp.demo` / `DemoAdmin123!`
- Student login: `passport2@rccswebcomp.demo` (Binuka Silva) / `Student123!`
- Student login: `passport3@rccswebcomp.demo` (Chamari Fernando) / `Student123!`