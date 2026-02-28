# Aye-Bay — MVP

Income, expense & project manager with **English + Bengali** (language-invariant UI). Functional prototype.

## Run

```bash
cd 0-aye_bay
npm install
npm run dev
```

Open **http://localhost:3000**. You’ll be redirected to a locale (e.g. `/en` or `/bn`).

## Demo login

| User ID | Password | Role  |
|--------|-----------|--------|
| admin  | 1234      | Admin |
| user1  | 1111      | User  |

## Features (MVP)

- **i18n:** EN / বাংলা via URL (`/en/...`, `/bn/...`) and sidebar switch.
- **Auth:** Login with ID + PIN; logout; role-based access (admin sees all projects + Admin tab).
- **Projects:** List, add project, assign responsible user.
- **Income:** Inventory (add product: name, quantity, price); Sales (record sale with discount & murajja); inventory quantity updates on sale.
- **Expense:** Add expense (product name, quantity, unit price, date).
- **Reports:** Income vs expense summary with project and date range filter; profit/loss.
- **Admin:** All projects list + overall financial summary (last 30 days).

## Tech

- Next.js 14 (App Router), React, TypeScript, next-intl, localStorage (no backend).

## File structure (compact)

- `app/[locale]/` — layout, landing, login, dashboard (single page with tabs).
- `components/` — AppShell, Dashboard (all sections), Auth, LandingRedirect.
- `lib/data.ts` — types, auth, storage, formatters.
- `lib/navigation.tsx` — locale-aware Link/router.
- `i18n/request.ts` — locale config + messages loader.
- `messages/en.json`, `messages/bn.json`.
- `styles/globals.css`.
