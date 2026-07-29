# Quality Inspection Tracker

Mobile-first web app for shop-floor supervisors to log, track, and resolve textile quality defects — replacing paper registers.

## Tech Stack

- **Backend** (`server/`): NestJS 11, Prisma 7 + SQLite (`better-sqlite3` adapter), JWT auth (`@nestjs/jwt`, `passport-jwt`, `bcrypt`), Swagger
- **Frontend** (`client/`): React 19 + Vite + TypeScript, Material UI + Tailwind CSS, React Router, React Hook Form, Axios, `localforage`

## Setup (under 5 minutes)

**Docker (recommended):**
```bash
docker compose up --build
```
Frontend `localhost:5173` · Backend `localhost:3000` · Swagger `localhost:3000/api` · stop with `docker compose down`

**Local dev:**
```bash
cd server && npm install && npx prisma generate && npx prisma migrate dev && npm run start:dev
cd client && npm install && npm run dev
```

`server/.env`: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT` · `client/.env`: `VITE_API_URL=http://localhost:3000`

No seeded account — register via the app's Register page or `POST /auth/register`.

## Architecture Decisions

**NestJS + Prisma + SQLite.** Modules keep auth/inspections/dashboard separated; Prisma's typed client avoids a class of query bugs. SQLite meets "no cloud database" with zero infra — trade-off is weak concurrent-write handling, fine for one shop floor.

**JWT over sessions.** Separate SPA + API, so a stateless bearer token skips shared session storage. Stored in `localStorage`, attached via an Axios interceptor; 401 redirects to `/login`.

**MUI + Tailwind.** MUI gives accessible pre-built components; Tailwind covers severity/status badges (their exact colors match Tailwind's default palette). No SSR — internal tool behind auth, no SEO need.

**`localforage` queue, not a PWA.** The bonus needs offline logging that syncs later, not offline page loads — a queue + `online` listener does that far more simply than a service worker.

**SAP webhook, both directions.** `POST /api/sap-webhook` is inbound (SAP creates an inspection here); `POST /sap/inspection` is an outbound mock fired on create/resolve. Both were cheap to add and show the pattern each way.

## API Notes

- `400` with `{ statusCode, message, error }` on validation errors; `404` on missing resources; `409` resolving an already-resolved inspection
- Pagination: `?page=&limit=` · Filters: `?severity=&status=&fromDate=&toDate=&search=` · Sort: `?sort=asc|desc`
- `/inspections` and `/dashboard` require a Bearer JWT; `/auth/*` and SAP endpoints are public

## Bonus Features

- **Offline support** — logging offline queues locally (`localforage`); "🔴 Offline Mode" banner; auto-syncs and refreshes views on reconnect
- **Mock SAP integration** — see payload below
- **JWT authentication** — register/login, all inspection/dashboard routes protected

### SAP Webhook Payload

```
POST /api/sap-webhook
{
  "inspectionDate": "2026-07-29",
  "machineId": "MC-101",
  "defectType": "WEAVE_DEFECT",
  "severity": "CRITICAL",
  "remarks": "Optional free text"
}
```

`defectType`: `WEAVE_DEFECT` · `SHADE_VARIATION` · `HOLE_TEAR` · `COUNT_DEVIATION` · `OTHER`. `severity`: `CRITICAL` · `MAJOR` · `MINOR`. `remarks` optional, rest required. No auth — attributed to an auto-provisioned system user (`sap-integration@system.local`), status `OPEN`.

## Assumptions

- SAP webhook payload/auth weren't specified — mirrored the manual create-inspection fields, left unauthenticated
- Machine/line ID is free text, not a managed list
- "Sortable" = newest/oldest toggle on date, not per-column (columns to sort weren't specified)
- Docker Hub repos exist but images aren't pushed yet — compose builds from source, which already satisfies the 5-minute local run requirement

## What I'd Do Differently

- Real automated tests (currently manual verification only — biggest gap)
- Per-column and server-side sorting (severity, status)
- Seeded demo account
- Code-split the frontend bundle (~660KB, mostly MUI) for faster mobile loads
- A shared component/Storybook page for the recurring UI pieces

## Repository

https://github.com/niravparmar197/quality-inspection-tracker

## Screenshots

_TODO: add screenshots of login, dashboard, and inspection management._
