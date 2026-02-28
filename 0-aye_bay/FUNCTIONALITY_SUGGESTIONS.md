# Aye-Bay — Functionality suggestions

Ideas to make the app more useful and robust, beyond the current MVP. Pick by priority and effort.

---

## 1. **Data & persistence**

- **Export / backup:** Let users download their data (projects, products, sales, expenses) as JSON or CSV so they can back up or move to another device. A single “Export data” in Settings or Admin would be enough to start.
- **Import:** Allow restoring from a previously exported file so switching devices or recovering after clear storage is possible.
- **Optional: real backend:** When you’re ready, replace localStorage with a simple API (e.g. Next.js API routes + SQLite/Postgres, or Firebase/Supabase) so data is synced and not lost when clearing the browser.

---

## 2. **Editing & deleting**

- **Edit project:** Change project name or responsible person. Today you can only add; editing would close the loop.
- **Edit product (inventory):** Adjust quantity or price per piece (e.g. after stock count or price change).
- **Delete sale or expense:** Allow removing mistaken entries, with a short confirmation (“Delete this entry?”) to avoid accidents.
- **Soft delete (optional):** Instead of hard delete, mark entries as “cancelled” and keep them in history with a filter “Show cancelled,” so you keep an audit trail.

---

## 3. **Reports & insights**

- **Date presets:** In Reports, add quick filters: “Last 7 days,” “Last 30 days,” “This month,” “Last month” so users don’t have to pick dates every time.
- **Per-project report:** A view that shows income vs expense for one project over time (you already have project filter; a dedicated “Project report” or clearer label could help).
- **Simple chart (optional):** A bar or line chart for income vs expense by week or month would make trends visible at a glance. A small library (e.g. Recharts or Chart.js) is enough.

---

## 4. **Inventory & sales**

- **Low-stock hint:** When product quantity is below a threshold (e.g. 5 or 10), show a small warning or badge in the inventory list or in the sales dropdown (“Rice — 3 in stock (low)”).
- **Unit for products (optional):** Add a unit field (kg, pcs, L, etc.) to inventory so “quantity” is clearer and reports can show “X kg sold.”
- **Sale edit/cancel:** Allow editing or cancelling a sale so inventory can be corrected without manual quantity edits.

---

## 5. **Projects & access**

- **Project archive:** Instead of deleting a project, allow “archiving” it so it disappears from the main list but data remains for reports (e.g. filter “Active only” / “Include archived”).
- **Multi-user (when you have a backend):** Assign projects to more than one user, or add roles (e.g. “viewer” vs “editor”) so teams can use the same app safely.

---

## 6. **UX & validation**

- **Save feedback:** After “Save entry” or “Add project,” show a short success message (e.g. “Saved” or a checkmark that fades out after 2 seconds) so users know the action worked.
- **Validation messages:** Show clear, inline errors (e.g. “Quantity must be greater than 0,” “Pick a project”) instead of only blocking submit.
- **Unsaved changes:** If the user has filled a form and clicks sidebar or back, optionally prompt “You have unsaved changes. Leave anyway?” to avoid losing data by mistake.

---

## 7. **Settings & preferences**

- **Currency:** Let users choose currency (BDT, USD, etc.) or at least the symbol so the app fits different waqf or orgs.
- **Date format:** Option for DD/MM/YYYY vs MM/DD/YYYY (or locale-based) so dates match local habits.
- **Default date range:** Remember the last “From / To” in Reports so returning users see their usual range.

---

## 8. **Admin**

- **User management (when you have a backend):** List users, add/remove, reset PIN, assign role so admin can manage who has access.
- **Audit log (optional):** Log who added/edited what and when (e.g. “User1 added sale on 22 Feb 2025”) for accountability.

---

## Priority order (suggested)

1. **Export data** — Low effort, high value (backup and peace of mind).  
2. **Edit project + edit product** — Makes the app fully usable for day-to-day corrections.  
3. **Delete sale / delete expense** — Fix mistakes without touching the database manually.  
4. **Save feedback (toast)** — Quick win for perceived quality.  
5. **Reports date presets** — Faster use of an important screen.  
6. **Low-stock hint** — Helps avoid selling out of stock by mistake.  
7. **Import data** — Pairs with export for restore/migration.  
8. **Currency / date in settings** — Nice for multi-org or multi-region use.

You can treat this as a roadmap and implement in small steps; even the first few items will make the app feel more complete and trustworthy.
