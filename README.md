# Quality Inspection Tracker

Mobile-first defect tracker for shop-floor supervisors — replaces paper registers.

**Stack:** NestJS 11 + Prisma 7 + SQLite + JWT, Swagger (`server/`) · React 19 + Vite + MUI + Tailwind, RHF, Axios, `localforage` (`client/`)

## Setup

```bash
docker compose up --build
```

| | URL |
|---|---|
| 🖥️ **Frontend** | **http://localhost:5173** |
| ⚙️ **Backend API** | **http://localhost:3000** |
| 📘 **Swagger Docs** | **http://localhost:3000/api** |

No seeded user — register via the app or `POST /auth/register`.

## Decisions

- **NestJS+Prisma+SQLite** — clean modules, typed queries, zero infra; weak on concurrent writes (fine for one shop floor)
- **JWT not sessions** — separate SPA/API; stateless token in `localStorage`, 401 → `/login`
- **MUI+Tailwind** — MUI for components, Tailwind for badges (colors matched its default palette)
- **`localforage` queue not PWA** — covers "sync when back online" without a service worker
- **SAP webhook both ways** — `/api/sap-webhook` inbound (SAP creates inspections), `/sap/inspection` outbound mock on create/resolve

## SAP Webhook

`POST /api/sap-webhook` — `{ inspectionDate, machineId, defectType, severity, remarks? }`, no auth, auto-creates via a system user (status `OPEN`).

## Assumptions

SAP payload/auth unspecified (mirrored manual fields) · machine ID is free text · "sortable" = date toggle · Docker Hub images not pushed yet (compose already covers the 5-min local run requirement).

## What I'd Do Differently

Automated tests · per-column/server-side sorting · seeded demo account · code-split the bundle.

## Repository

**🔗 https://github.com/niravparmar197/quality-inspection-tracker**
