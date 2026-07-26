# 013 — Roles & Permissions (RBAC)
**KVJ Analytics Platform V3 · Phase 3 · Enterprise Platform**
Who can do what, across the whole ecosystem. Replaces today's binary admin/not-admin with granular
role-based access control. **[to add]** — net-new (current auth is admin-or-not, 012).

---

## 1. Model
**Users → Roles → Permissions.** Permissions gate actions; roles bundle permissions; a user can hold
multiple roles, optionally **scoped to an organization**. Every privileged route (011) and UI element
(005 nav) checks a **permission**, not a role name directly (so roles can be re-composed without code
changes).

### Tables (010)
`roles(id, key, label)` · `permissions(id, key, label)` · `role_permissions(role_id, permission_id)` ·
`user_roles(user_id, role_id, org_id NULL)` · `organizations(id, name, …)` · `org_members(org_id,
user_id, role)`.

---

## 2. Roles
| Role | Scope | Can |
|---|---|---|
| **Super Admin** | Global | Everything, incl. roles/permissions, settings, audit. |
| **Organization (Org Admin)** | Org | Manage own org: members, vouchers, corporate enrollments, reports. |
| **Marketing** | Global | CMS pages, blog, SEO/Growth OS, campaigns, media. No LMS/finance. |
| **Instructor** | Course(s) | Author courses/modules/lessons/activities/assessments; view own students' progress. |
| **Editor** | Global (content) | Draft/edit content; publish may require approval. |
| **HR** | Global | Jobs, applications, internships pipeline. |
| **Corporate** | Org | Corporate contact managing their learners (subset of Org Admin). |
| **Student** | Self | Enroll, learn, take activities/assessments/mocks, view own certificates. |
| **Guest** | Public | Browse public site + Learn; no dashboard. |

---

## 3. Permission catalogue (representative, by domain)
- **CMS:** `page.read/create/update/publish/delete`, `media.manage`.
- **Blog:** `blog.read/write/publish`.
- **Courses/LMS:** `course.create/update/publish`, `module.manage`, `lesson.manage`,
  `activity.manage`, `assessment.manage`, `question.manage`, `mock.manage`, `finalexam.manage`,
  `certificate.issue`.
- **Enrollments/vouchers:** `enrollment.read/manage`, `voucher.generate/revoke`.
- **CRM/leads:** `lead.read/manage`, `crm.manage` (014).
- **People:** `job.manage`, `application.review`, `internship.manage`.
- **Finance:** `payment.read`, `order.refund` (careful).
- **Growth/AI:** `growth.analyze`, `growth.apply`, `growth.publish` (008/018).
- **Admin/system:** `user.manage`, `role.manage`, `settings.manage`, `audit.read`, `integration.manage`.

Roles = curated sets of these. Super Admin = all. Org-scoped permissions additionally check
`org_id` match.

---

## 4. Enforcement
- **Server:** a helper `requirePermission(req, "course.update", { orgId? })` resolves the caller's
  roles→permissions and returns `403` (011) if missing. Every `/api/admin/*` and privileged action
  uses it (supersedes bare `isAdminAuthed` for granular routes; admin session still gates entry).
- **RLS (010):** org/owner scoping enforced at the DB for defense-in-depth (student sees own rows;
  org admin sees own org).
- **UI (005):** nav + actions render by permission; never rely on hiding alone — server enforces.
- **Audit (012):** role grants/revocations and privileged actions logged.

---

## 5. Organizations (multi-tenant for corporate/college)
An **organization** groups learners + vouchers + reports. Org Admin manages members and voucher
batches (LMS corporate flow); vouchers map org→course with expiry/usage limits (010/LMS). Learners
join via voucher → `org_members`. Org-scoped analytics (016) show only that org's data.

---

## 6. Migration from current auth
1. Add RBAC tables + seed roles/permissions; map existing single admin → Super Admin.
2. Introduce `requirePermission` alongside `isAdminAuthed`; migrate routes incrementally.
3. Add role management UI (017) — Super Admin assigns roles.
4. Layer org scoping for corporate. Non-breaking: until a route adopts `requirePermission`, admin
   session still governs it.

---

## 7. Definition of done
Actions gated by permission (not hardcoded role) · roles composable via DB · org-scoping enforced in
API **and** RLS · UI reflects permissions but server is source of truth · role changes audited ·
Super Admin bootstrap safe · least-privilege defaults (new roles start minimal).

---
_Status: ✅ complete._
