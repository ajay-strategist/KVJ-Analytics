# 017 — Administration
**KVJ Analytics Platform V3 · Phase 4 · Business Modules**
The admin control center: the panel structure, plus system-level settings, logs, backups,
notifications, themes, API keys, integrations. **[in code]** exists, **[to add]** planned.

---

## 1. Current admin panel **[in code]** (`/admin/*`, HMAC-gated)
Modules: content · courses (+[id] builder) · categories · unlock-codes · internships · jobs · blog ·
leads · inquiries · applications · enrollments · batches · clients · testimonials · case-studies ·
team. Each has a matching `/api/admin/<name>` route (GET/POST + `[id]` PUT/DELETE). Uploads via
`/api/admin/upload`. Login/logout via `/api/admin/login|logout`.

---

## 2. Target module map (from the platform module list)
Dashboard · Users · Courses · Learning Paths · Modules · Lessons · Activities · Assessments ·
Question Bank · Mock Tests · **Final Exams** · **Certificates** · **Voucher Management** ·
Corporate Training · Internships · Payments · Reports · Analytics · Settings — plus existing content/
blog/jobs/leads/CRM. Organized in a grouped, collapsible sidebar (005 §9), role-gated (013).

---

## 3. Admin dashboard (home)
At-a-glance: new leads, pending applications, recent enrollments/payments, publish queue, SEO/growth
score (008), traffic (016), tasks (014). Actionable cards → deep links. `⌘K` command palette (005 §8).

---

## 4. System settings **[to add]**
- **Site settings [in code]:** header/footer/nav/contact/logo via `site-settings` CMS.
- **General:** brand, contact, social URLs, business info (feeds SEO 008 `sameAs`/schema).
- **Themes:** design-token overrides within the 001 system (safe bounds; never break dark/glass).
- **API keys / integrations:** Razorpay, Resend, GA/Pixel, LLM key, Search Console, social, storage
  (019) — stored as secrets (012), status indicators, test buttons.
- **Email:** templates (receipts, auto-replies, campaigns), sender identity (Resend).
- **Feature flags:** toggle in-progress modules safely.

---

## 5. Users & roles **[to add]** (013)
Manage users, assign roles, create organizations + org admins, invite flows. Super-Admin-gated.
View a user's enrollments/orders/activity. Least-privilege defaults.

---

## 6. Logs, audit, backups **[to add]**
- **Audit log viewer** (012 §7): who/what/when for privileged actions; filter/search; immutable.
- **System/error logs:** surfaced for admins (not to end users); tie to monitoring (021).
- **Backups:** scheduled DB backups + restore runbook (023); export tools; pre-migration snapshots.

---

## 7. Notifications **[to add]**
Admin notifications (new lead/application/payment/failed job) + configurable channels (in-app, email,
WhatsApp/Slack via 019). Student notifications live in the LMS (015). Central preferences.

---

## 8. UX & security
On-system (001) admin UI: fast tables (TanStack Table, virtualized, 001 §12), loading/empty/error
states, keyboard + `⌘K`, breadcrumbs (005). Every module permission-gated (013), inputs Zod-validated
(011), actions audited (012). Mobile-usable for key tasks.

---

## 9. Build order
1. Grouped role-gated sidebar + admin dashboard home + `⌘K`.
2. Settings (general, integrations/API keys, email) + users/roles (013).
3. Audit log viewer + notifications.
4. New LMS modules (final exams, certificates, vouchers, learning paths) as they land (015).
5. Backups/restore + monitoring hooks (021/023).

---

## 10. Definition of done
All modules reachable from a grouped, role-gated, `⌘K`-enabled panel · settings/integrations/users/
roles manageable · audit log + notifications · on-system tables with proper states · every action
permission-gated + validated + audited · backups + restore runbook.

---
_Status: ✅ complete._
