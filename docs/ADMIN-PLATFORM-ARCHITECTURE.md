# KVJ Admin Platform — Architecture (Phase 2.0 Foundation)

> The central operating platform (CMS + LMS + CRM + ERP-lite + analytics). This doc defines the
> **foundation** laid in Phase 2.0 and how future modules slot in cleanly. Existing admin was
> **extended, not rebuilt** — auth, routes, and module pages are unchanged.

## What existed before
- **Auth:** HMAC session cookie (`lib/adminAuth.ts` → `isAdminAuthed`). Login at `/admin`
  (`/api/admin/login`), logout `/api/admin/logout`. Each module page self-guards (fetches an
  `/api/admin/*` endpoint, redirects to `/admin` on 401).
- **Routing:** flat `/admin/<module>/page.tsx` — content, courses(+[id]), categories, unlock-codes,
  internships, jobs, blog, leads, inquiries, applications, enrollments, batches, clients,
  testimonials, case-studies, team. **No shared shell, no sidebar, no dashboard home.**
- **DB:** Supabase (Postgres/Auth/Storage). CMS via `page_content` (fallback-merge). LMS tables
  (courses/modules/lessons/mock_tests/questions/enrollments), leads/inquiries/etc.
- **UI:** each page standalone (light cards).

## What Phase 2.0 added (foundation)
1. **Module registry** — `src/components/admin/adminNav.ts`: the single source of truth for
   navigation, grouped (Overview · Website · Learning · People & CRM · Commerce · Careers · Insights
   & System). Each item = `{ label, href, icon, status }`. `active` = route exists; `soon` =
   placeholder for a future module (rendered disabled with a "Soon" badge). **Add a module → add a
   row here + its page; the sidebar updates automatically.**
2. **AdminShell** — `src/components/admin/AdminShell.tsx`: the platform frame (fixed sidebar from the
   registry + sticky topbar with page title, "View site", Logout). Responsive (off-canvas drawer on
   mobile). Renders **bare on `/admin` (login)**. Light enterprise theme; brand-cyan accents.
3. **Admin layout** — `src/app/admin/layout.tsx`: wraps every `/admin/*` route in `AdminShell`
   (additive; existing pages render inside the content area unchanged).
4. **Reusable dashboard widgets** — `src/components/admin/widgets.tsx`: `StatWidget`, `WidgetPanel`,
   `QuickAction`, `ListRow`, `HealthRow` — the building blocks for every dashboard/report screen.
5. **Dashboard home** — `src/app/admin/dashboard/page.tsx`: enterprise overview (stats · quick
   actions · recent activity · latest enrollments · contact requests · pending tasks · system health
   · blog summary) built from the widgets, using **clearly-labelled demo data** (no fabricated
   business stats). Auth-guards via a protected `/api/admin/*` ping. Login now lands here.

## Conventions for future modules (how to extend)
1. Create `src/app/admin/<module>/page.tsx` (client; self-guard by fetching its `/api/admin/*`
   endpoint and redirecting to `/admin` on 401 — mirror an existing page).
2. Add its API route(s) under `src/app/api/admin/<module>/` (GET list / POST create + `[id]` PUT/
   DELETE), guarded by `isAdminAuthed`. Validate input with Zod (see docs 011/012).
3. Flip its `adminNav.ts` row from `soon` → `active` (or add a new row).
4. Add migrations under `supabase/migrations/` for any new tables; index FKs; add RLS.
5. Compose the screen from `widgets.tsx` (+ shared table/form primitives as they land).

## Auth / routing / DB changes
- **Auth:** unchanged (still HMAC session; pages self-guard). Login redirect updated `/admin/leads`
  → `/admin/dashboard`. RBAC (Super Admin/Admin/Trainer/Sub-Admin/Student) is a **future** step
  (see doc `013`) — the registry + shell are ready to gate items by permission when it lands.
- **Routing:** added `/admin/dashboard` + the shell layout. No existing routes moved or removed.
- **DB:** no schema changes in Phase 2.0.

## Phase 2.x modules — BUILT (all `soon` slots now `active`)
All twelve former `soon` modules are live, composed from DataTable/FormKit/widgets:
- **Media Library** (`/admin/media` + `api/admin/media` + `media_library` table): upload (reuses
  `/api/admin/upload`), grid, type filter, search, copy-URL, delete.
- **Students** (`/admin/students`): read-only roster over `profiles` (role=student) with
  enrollment counts; server search/sort/pagination. Search uses base-schema columns only
  (`name/organization/phone`) so it works before the training_platform migration.
- **Users & Roles** (`/admin/users` + `admin_users` table): staff directory with role/status.
  **Data model only** — login remains the single shared HMAC session; enforcement is doc 013's step.
- **Assessments / Question Bank** (`/admin/assessments`, `/admin/question-bank`): read-only
  cross-course indexes over `mock_tests`/`questions` (join to course titles, question counts,
  type filter). Editing stays in the course builder — these give the missing platform-wide view.
- **Certificates** (`/admin/certificates` + `certificates` table): issue by student email +
  course slug (generates `KVJ-<year>-<hex>` number + verify code), revoke/reinstate/delete,
  public verification page at `/certificates/verify/[code]`.
- **Orders** (`/admin/orders`): server-paginated list over `orders` with status filter and
  mark paid/refunded/cancelled. Joins course titles by `course_slug` (not the newer FK).
- **Payments** (`/admin/payments`): revenue stat row (total / this-month / refunded /
  pending+failed) + paid/refunded transaction ledger.
- **Reports** (`/admin/reports`): 6-month enrollment + revenue trends, top courses, lead
  status/source — all live aggregations rendered with the CSS-only `BarList` widget (no chart deps).
- **Analytics** (`/admin/analytics`): test attempts, pass rate, enrollment methods, account types,
  lead funnel + GA/Meta-Pixel config status. Website traffic stays in GA (client-side) by design.
- **Audit Logs** (`/admin/audit-logs` + `audit_logs` table): best-effort trail written by
  `lib/admin/auditLog.ts` from users/certificates/orders/media mutations; entity filter + pagination.
- **Settings** (`/admin/settings`): general/contact/notification/maintenance flags persisted in
  `page_content` slug `admin-settings` (no new table).

**Migration:** run `supabase/migrations/admin_platform_modules.sql` (media_library, admin_users,
certificates, audit_logs, orders `refunded` status, admin-settings seed). Until then those four
table-backed modules show a graceful load error; the rest run on the existing schema.

## Recommendations (updated after Phase 2.x build)
- Add a **server-side admin gate** (middleware or per-route) in addition to client self-guard, for
  defense-in-depth (doc 012).
- **Enforce RBAC** (doc 013): per-user login against `admin_users` + permission checks in routes;
  the data model and directory UI are now in place.
- ~~Build shared DataTable / FormKit primitives~~ Done — every new module composes them.
- ~~Wire the dashboard widgets to live counts~~ Done (`/api/admin/dashboard`).
- Next candidates from the feature list: CRM entities over leads (doc 014), notifications/email
  templates (017), AI tools (018), integrations hub (019), backup/restore runbooks (023).
