# 010 — Database Architecture
**KVJ Analytics Platform V3 · Phase 3 · Enterprise Platform**
The Supabase Postgres schema: tables, relationships, keys, constraints, RLS, storage. Documents what
exists and the target shape. **[in code]** in `supabase/migrations/*.sql`, **[to add]** planned.
**Rule:** every schema change is a new migration file, run in Supabase before deploy (CLAUDE.md).

---

## 1. Platform: Supabase (Postgres + Auth + Storage + RLS)
Public reads via anon client (RLS-guarded); privileged writes via service-role (server-only, 012).
App tolerates absent env via `mockSupabase` (content.ts) so dev never hard-fails.

---

## 2. Current tables **[in code]**
**In migrations (`training_platform.sql`, `blog_posts.sql`):** `course_categories`, `unlock_codes`
(`code` unique, `length=6`), `code_redemptions`, `internships`, `internship_applications`,
`inquiries`, `jobs`, `job_applications`, `blog_posts`. Unique constraint `unique(user_id, course_id)`
present (enrollment/redemption dedupe).

**Referenced by app code but not in the two migration files (must exist in Supabase / add migrations):**
`page_content` (CMS, 002), `courses`, `modules`, `lessons`, `mock_tests`, `questions`, `enrollments`,
`orders` (Razorpay), `leads`, `testimonials`, `case_studies`, `clients`, `team`, `batches`.
**[to add / reconcile]** consolidate the full live schema into versioned migrations so the DB is
reproducible from `supabase/migrations/` alone. **This is a real gap — the source of truth is
currently split between migrations and the live project.**

---

## 3. Core relationships (LMS)
```
course_categories 1─* courses 1─* modules 1─* lessons (kind: theory|activity, content_html, video_url)
courses 1─* mock_tests (module_id NULL = course-wide) 1─* questions (all types)
users 1─* enrollments *─1 courses         UNIQUE(user_id, course_slug)  ← required for enroll upsert
users 1─* orders (razorpay_order_id) → enrollment on webhook (verified)
unlock_codes 1─* code_redemptions          (colleges/corporate access)
courses 1─* lesson_progress / activity_results / test_attempts   [partly in code: activity-result, tests submit]
```
CMS: `page_content(slug UNIQUE, data jsonb, updated_at)` → target adds `pages` + `page_versions`
(002 §5). Blog: `blog_posts(slug UNIQUE, …)`. Careers: `jobs` 1─* `job_applications`. Internships:
`internships` 1─* `internship_applications`. Contact: `leads`, `inquiries`.

---

## 4. Target additions **[to add]** (per later docs)
- **CMS:** `pages`, `page_versions` (006/002).
- **Media:** `media_assets`, `media_folders` (007).
- **RBAC:** `roles`, `permissions`, `user_roles`, `organizations`, `org_members` (013).
- **Vouchers:** formalize `vouchers` (expiration, usage limit, org/course mapping) over `unlock_codes` (LMS).
- **Certificates:** `certificates` (issue after external final exam), `final_exam_eligibility` (LMS).
- **Learning paths:** `learning_paths`, `path_courses`.
- **CRM:** `contacts`, `opportunities`, `pipelines`, `activities`, `tasks` (014).
- **Analytics:** event tables / rollups (016) — or external warehouse.
- **Audit:** `audit_logs` (012).
- **Notifications:** `notifications` (student dashboard, LMS).

---

## 5. Keys, indexes, integrity
- UUID PKs (`gen_random_uuid()`); `created_at`/`updated_at timestamptz` on every table.
- Unique: `page_content.slug`, `blog_posts.slug`, `courses.slug`, `unlock_codes.code`,
  `enrollments(user_id, course_slug)` **(critical — enroll upsert `onConflict` depends on it)**.
- FKs with explicit `on delete` (restrict/cascade per relationship); index every FK + every column
  used in `where`/`order` (slug lookups, status filters, user_id) — perf (020).
- Enums/checks for status fields; `jsonb` for flexible content (CMS data, question payloads) with
  Zod validation at the app layer (002/006).

---

## 6. Row-Level Security (RLS)
- **Public read** only on published marketing/catalog data (page_content, published courses/blog/
  jobs) via anon.
- **Owner-scoped** on student data (enrollments, progress, attempts, certificates): a user reads/
  writes only their rows (`auth.uid() = user_id`).
- **Admin/service-role** bypasses RLS for management writes (server-only key).
- **Org-scoped** (013): org admins see only their org's members/vouchers.
- Never expose service-role client-side; never rely on client-supplied `userId` for authorization
  (harden the payment/unlock `userId` TODO — CLAUDE.md gotcha; derive from session).

---

## 7. Storage
Supabase Storage buckets for media (007) + resumes + certificates + HTML packages. Public bucket for
marketing media (CDN-cached); private/signed for resumes, certificates, HTML packages. Uploads
validated + sanitized (007/012).

---

## 8. Migrations & environments
Additive, versioned, timestamp-named migrations in `supabase/migrations/`; run before deploy. Never
edit a shipped migration — add a new one. Seed scripts for reference data (categories). Keep
dev/stage/prod schemas in lockstep (021). Back up before destructive migrations (023).

---

## 9. Definition of done
Full live schema reproducible from migrations · every FK indexed · required uniques present
(esp. `enrollments(user_id, course_slug)`) · RLS on all user/org data · service-role server-only ·
authorization never trusts client `userId` · timestamps + soft-delete where needed · storage buckets
scoped + validated.

---
_Status: ✅ complete._
