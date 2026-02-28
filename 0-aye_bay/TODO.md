# Aye-Bay Application — Full To-Do List

This document is the master To-Do list for the new application (project/business & income–expense manager) based on your plan. The app will be built with **Next.js**, **React**, **HTML**, **CSS**, and **JavaScript**, with an organized and scalable codebase.

---

## Plan Summary (from your Bengali requirements)

| # | Area | Features |
|---|------|----------|
| 1 | User Management | Multiple user accounts (per project manager), Login/Logout, Role-based access (Admin & User) |
| 2 | Project Management | Multiple projects/businesses, Assign responsible person per project |
| 3 | Income Management | Inventory (product name, quantity, sold qty, price per piece, total, discount, murajja/voluntary), Sales records |
| 4 | Expense Management | Raw materials list, Product name, quantity, unit price, total expense |
| 5 | Reporting | Income–expense summary, Date range filter, Product-wise purchase/sales report, Profit–loss |
| 6 | Admin Dashboard | All projects consolidated view, Per-project view, Overall financial summary |
| 7 | Messaging | Admin ↔ User communication, Attach notes, Two-way messaging |
| 8 | Hijri Calendar | Arabic Hijri dates, Bangladesh adjustment (±1 day), Settings customization |
| 9 | Dashboard Analytics | Charts/graphs (income–expense trends), Monthly/yearly comparison, Project-wise performance |
| 10 | Notifications | New message alerts, Low stock warning, Important update notifications |
| 11 | Search & Filter | Product search, Transaction filter, Date-based search |
| 12 | Mobile Responsive | Good view on all devices, Touch-friendly UI |
| 13 | Audit Log | Who changed what and when, Transaction history |

---

## Suggested File Tree — Compact (fewer files, ~400–500 lines each is fine)

```
0-aye_bay/
├── app/
│   └── [locale]/
│       ├── layout.tsx              # Root layout + locale
│       ├── page.tsx                # Landing (role select / redirect)
│       ├── login/
│       │   └── page.tsx            # Login page
│       └── dashboard/
│           └── page.tsx            # Single dashboard: Projects | Income | Expense | Reports | Admin (tabs)
├── components/
│   ├── AppShell.tsx                # Layout: sidebar, header, content area (~200–400 lines)
│   ├── Dashboard.tsx               # All sections: projects list/form, inventory, sales, expense, report, admin (~400–500 lines)
│   └── Auth.tsx                    # Login form
├── lib/
│   └── data.ts                     # Types + auth + storage + formatters in one file (~400–500 lines)
├── hooks/
│   └── useApp.ts                   # Auth state + data loading (projects, income, expense, report) in one file
├── i18n/
│   └── request.ts                  # next-intl config + routing (locale list, getRequestConfig)
├── messages/
│   ├── en.json
│   └── bn.json
├── styles/
│   └── globals.css                 # Variables + global styles
├── public/
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

**Notes:** One dashboard page handles all main flows via tabs/sections. One `lib/data.ts` holds types, constants, auth helpers, and storage. One `useApp.ts` hook exposes auth and CRUD. Split into more files later only when a file grows too large or a feature is isolated.

---

## Master To-Do List

### Phase 0 — Project setup & structure (use compact file tree above)

- [ ] **0.1** Create Next.js app inside `0-aye_bay` (TypeScript, App Router). Use the **compact** structure: `app/[locale]/`, `components/` (3 files), `lib/data.ts`, `hooks/useApp.ts`, `i18n/request.ts`, `messages/`, `styles/globals.css`.
- [ ] **0.2** Set up folder structure: `app/[locale]/`, `components/`, `lib/`, `hooks/`, `i18n/`, `messages/`, `styles/`, `public/`.
- [ ] **0.3** Add path alias in `tsconfig.json`: `@/*` → `./*`.
- [ ] **0.4** Configure environment variables (e.g. `.env.local`) for API keys / Firebase if used.
- [ ] **0.5** Put all shared types in `lib/data.ts` (User, Project, Income, Expense, etc.).
- [ ] **0.6** Add a simple design system: CSS variables and global styles in `styles/globals.css` only.
- [ ] **0.7** Set up i18n with next-intl: `i18n/request.ts` and `messages/en.json`, `messages/bn.json`.

---

### Phase 1 — User management

- [ ] **1.1** Define roles: `admin`, `user` (project manager). Add to `types/user.ts` and `lib/constants.ts`.
- [ ] **1.2** Implement auth mechanism (e.g. Firebase Auth, NextAuth, or custom with secure session).
- [ ] **1.3** Build login page: form (email/ID + password or PIN), validation, error messages.
- [ ] **1.4** Implement logout: clear session and redirect to login.
- [ ] **1.5** Create auth context/provider and `useAuth` hook (current user, role, login, logout).
- [ ] **1.6** Implement route guards: redirect unauthenticated users to login; redirect non-admin from `/admin/*` to dashboard.
- [ ] **1.7** Admin: UI to list users and assign role (optional: invite/create user).
- [ ] **1.8** Persist “remember me” or session duration in settings if required.

---

### Phase 2 — Project management

- [ ] **2.1** Data model: project (name, description, responsibleUserId, createdAt, etc.) in `types/project.ts`.
- [ ] **2.2** Storage/API: CRUD for projects (create, read, update, delete).
- [ ] **2.3** Projects list page: table/cards of projects with responsible person name.
- [ ] **2.4** Project detail page: show project info, link to income/expense/reports for that project.
- [ ] **2.5** Create/Edit project form: name, description, assign responsible user (dropdown from users list).
- [ ] **2.6** Restrict “my projects” for role `user` (only projects where they are responsible); admin sees all.
- [ ] **2.7** Ensure every income/expense/transaction is scoped to a project (projectId).

---

### Phase 3 — Income management

- [ ] **3.1** Data model: product/inventory item (name, quantity, unit, pricePerPiece, projectId, etc.) in `types/income.ts`.
- [ ] **3.2** Data model: sale record (productId/productRef, quantitySold, pricePerPiece, total, discount, murajja, date, projectId).
- [ ] **3.3** Inventory list page: show products with name, quantity, price per piece; filter by project.
- [ ] **3.4** Add/Edit product form: product name, quantity, unit, price per piece, project.
- [ ] **3.5** Sales entry form: select product, quantity sold, price per piece, total, discount, murajja (voluntary), date.
- [ ] **3.6** Auto-update inventory quantity when a sale is recorded (decrease by quantity sold).
- [ ] **3.7** Sales list/history page: list sales with date, product, amount, discount, murajja; filter by project and date.
- [ ] **3.8** Validation: do not allow selling more than available quantity (or allow with warning/override if business rule says so).

---

### Phase 4 — Expense management

- [ ] **4.1** Data model: expense/purchase record (productName, quantity, unitPrice, totalExpense, date, projectId, optional category).
- [ ] **4.2** Expense list page: show raw material / expense entries; filter by project and date.
- [ ] **4.3** Add/Edit expense form: product name, quantity, unit price, total (auto-calc or manual), date, project.
- [ ] **4.4** Link expense to project; ensure reports can aggregate by project.

---

### Phase 5 — Reporting system

- [ ] **5.1** Income–expense summary: total income (sales − discount + murajja) and total expense in a given period.
- [ ] **5.2** Date range filter component (from–to); use in summary and other reports.
- [ ] **5.3** Product-wise report: per product, total purchased (expense) vs total sold (income), quantity and value.
- [ ] **5.4** Profit–loss: income − expense for selected period and optionally per project.
- [ ] **5.5** Reports page: tabs or sections for Summary, Product-wise, Profit–loss; export (CSV/PDF) optional.
- [ ] **5.6** Support Hijri date range in filters (optional: show both Gregorian and Hijri in report headers).

---

### Phase 6 — Admin dashboard

- [ ] **6.1** Admin layout: sidebar/nav with “All projects”, “Analytics”, “Users”, “Audit”, etc.
- [ ] **6.2** Admin home page: consolidated view of all projects (cards or table with key metrics).
- [ ] **6.3** Click a project to go to project-specific view (same as project detail but with full access).
- [ ] **6.4** Overall financial summary: total income, total expense, profit/loss across all projects (with date filter).
- [ ] **6.5** Optional: comparison widgets (this month vs last month, etc.).

---

### Phase 7 — Messaging system

- [ ] **7.1** Data model: message (senderId, receiverId, content, attachments/notes, createdAt, readAt) in `types/message.ts`.
- [ ] **7.2** Storage/API: send message, list conversations, list messages in a thread, mark as read.
- [ ] **7.3** Inbox/conversation list: show threads between admin and users (or user–user if needed).
- [ ] **7.4** Message thread view: show messages in order; support attachment/notes (upload or link).
- [ ] **7.5** Compose/reply: text input and attach note (file or text); send to user or admin.
- [ ] **7.6** Real-time or polling: update message list when new message arrives (optional: Firebase real-time, or refresh interval).
- [ ] **7.7** Show unread count in sidebar/header and link to messages page.

---

### Phase 8 — Hijri calendar system

- [ ] **8.1** Implement Hijri date logic in `lib/hijri.ts`: convert Gregorian ↔ Hijri, use Bangladesh offset (±1 day).
- [ ] **8.2** Add settings: toggle “Use Hijri”, “Bangladesh offset” (e.g. −1, 0, +1); store in user preferences or localStorage.
- [ ] **8.3** Reusable Hijri date display component: show date in Hijri when setting is on, else Gregorian.
- [ ] **8.4** Date picker: optional Hijri mode (select Hijri date and convert to Gregorian for storage).
- [ ] **8.5** Use Hijri in reports and transaction lists where “date” is shown (optional dual display).

---

### Phase 9 — Dashboard analytics

- [ ] **9.1** Choose chart library (e.g. Recharts, Chart.js) and add to project.
- [ ] **9.2** Income–expense trend chart: line or bar chart over time (daily/weekly/monthly) for selected project or all.
- [ ] **9.3** Monthly comparison: this month vs last month (income, expense, profit).
- [ ] **9.4** Yearly comparison: this year vs last year or multi-year.
- [ ] **9.5** Project-wise performance: chart or table of income/expense/profit per project.
- [ ] **9.6** Dashboard widgets on user dashboard: summary numbers + small charts; admin dashboard: same + all-project view.

---

### Phase 10 — Notifications

- [ ] **10.1** Data model: notification (userId, type: message | low_stock | update, title, body, read, createdAt).
- [ ] **10.2** Create notifications when: new message received, low stock (e.g. product quantity &lt; threshold), important update (e.g. admin broadcast).
- [ ] **10.3** Notification list/dropdown in header: show unread first; mark as read on click.
- [ ] **10.4** Low stock threshold: configurable per product or global; run check on inventory list or after sale.
- [ ] **10.5** Optional: browser push or in-app sound for new message (with permission).

---

### Phase 11 — Search & filter

- [ ] **11.1** Product search: search by product name in inventory and in sales/expense lists.
- [ ] **11.2** Transaction filter: filter income (sales) and expense by type, project, date range.
- [ ] **11.3** Date-based search: from–to on all list pages (income, expense, reports).
- [ ] **11.4** Combine filters (project + date + keyword) and persist in URL query params for shareable links if desired.

---

### Phase 12 — Mobile responsive & UX

- [ ] **12.1** Responsive layout: sidebar collapses to hamburger + drawer on small screens.
- [ ] **12.2** Tables: horizontal scroll or card layout on mobile for long tables.
- [ ] **12.3** Touch-friendly: button and input sizes, spacing; avoid hover-only actions.
- [ ] **12.4** Test on 320px, 768px, 1024px and above; fix overflow and readability.
- [ ] **12.5** Optional: PWA (manifest + service worker) for “Add to Home Screen”.

---

### Phase 13 — Audit log

- [ ] **13.1** Data model: audit entry (userId, action, entityType, entityId, oldValue, newValue, timestamp, IP optional).
- [ ] **13.2** Log on create/update/delete: projects, products, sales, expenses, user role changes.
- [ ] **13.3** Audit log page (admin): table of entries with who, when, what changed; filter by user, date, entity type.
- [ ] **13.4** Transaction history: per-project or per-entity view of changes (e.g. “History” on a sale row).
- [ ] **13.5** Ensure sensitive data (e.g. password) is never stored in oldValue/newValue.

---

### Phase 14 — Polish & deployment

- [ ] **14.1** Error boundaries and friendly error messages (404, 500, network error).
- [ ] **14.2** Loading states: skeletons or spinners on list and detail pages.
- [ ] **14.3** Accessibility: ARIA labels, keyboard navigation, focus order.
- [ ] **14.4** SEO: basic meta tags and titles per route.
- [ ] **14.5** Security: sanitize inputs, validate on server if using API routes; enforce auth on all protected APIs.
- [ ] **14.6** Deploy: connect to Vercel/Netlify or Firebase Hosting; set env vars in hosting.
- [ ] **14.7** README: how to run locally, env vars, and feature summary.

---

## Checklist summary by feature area

| Area | To-Do items |
|------|-------------|
| Setup & structure | 0.1 – 0.7 |
| User management | 1.1 – 1.8 |
| Project management | 2.1 – 2.7 |
| Income management | 3.1 – 3.8 |
| Expense management | 4.1 – 4.4 |
| Reporting | 5.1 – 5.6 |
| Admin dashboard | 6.1 – 6.5 |
| Messaging | 7.1 – 7.7 |
| Hijri calendar | 8.1 – 8.5 |
| Dashboard analytics | 9.1 – 9.6 |
| Notifications | 10.1 – 10.5 |
| Search & filter | 11.1 – 11.4 |
| Mobile responsive | 12.1 – 12.5 |
| Audit log | 13.1 – 13.5 |
| Polish & deployment | 14.1 – 14.7 |

---

You can use this as a single source of truth: tick off items as you implement them and add sub-tasks under any item if needed. If you want, next step can be generating the Next.js scaffold (Phase 0) inside `0-aye_bay` following this structure.
