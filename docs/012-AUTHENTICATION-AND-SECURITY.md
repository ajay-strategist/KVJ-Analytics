# 012 — Authentication & Security
**KVJ Analytics Platform V3 · Phase 3 · Enterprise Platform**
Identity, sessions, authorization, and platform hardening. **[in code]** exists, **[to add]** planned.

---

## 1. Identities
- **Students / public users:** Supabase Auth (email + Google), profession captured at signup.
  Session synced to `sb-access-token` cookie by `Header` for server verification.
- **Admins:** separate HMAC session — `admin_session` cookie == `adminToken()` (`lib/adminAuth.ts`),
  set by `/api/admin/login`, cleared by `/logout`. Secret from `ADMIN_SESSION_SECRET` (fallbacks to
  service-role/`ADMIN_PASSWORD`; **[reconcile]** set a dedicated strong `ADMIN_SESSION_SECRET` in
  prod — don't rely on fallback).
- **Service role:** server-only Supabase key for privileged writes; **never** client-exposed.

---

## 2. Admin session (current) **[in code]**
HMAC-SHA256 over a server-only secret → cookie can't be forged (fixed the old static-string hole).
Verify with **`isAdminAuthed(req)`** (constant-time `timingSafeEqual`). **[to add]** rotate secret
support, session expiry/refresh, and login rate-limit + lockout on `/api/admin/login`.

---

## 3. Target: RBAC (roles & permissions) — detail in 013
Move from binary admin/not-admin to **role-based**: Super Admin, Organization, Marketing, Instructor,
Student, Corporate, HR, Editor, Guest. Every privileged route/UI checks a **permission**, not just
"is admin." Roles in DB (`roles`, `permissions`, `user_roles`, 010); middleware/helper resolves the
caller's permissions; `403` on failure (011). Org-scoped access for org admins.

---

## 4. Session & token hygiene
Cookies `HttpOnly` (where not needed by client JS), `Secure`, `SameSite=Lax`, scoped path, sensible
`max-age`. Supabase JWT verified server-side for student actions — **derive `userId` from the verified
session, never from request body** (hardens the payment/unlock gotcha, CLAUDE.md/011). Short-lived
access + refresh. **MFA** for admin/super-admin **[to add]**.

---

## 5. Input & output safety
- **Zod-validate** every API input (011); size limits; type allowlists (uploads, 007).
- **Sanitize admin-authored HTML** (blog/legal/lessons/interactive) before render; sandbox HTML
  packages in iframes (007 §5). `dangerouslySetInnerHTML` only for sanitized trusted admin input.
- **Escape/parameterized** queries via Supabase client (no raw string SQL).
- Never render secrets; never send service-role key or internal errors to the client.

---

## 6. Platform hardening
- **Rate limiting** on auth + public POSTs; lockout/backoff on repeated admin login failure.
- **CSRF**: same-origin enforcement on mutations; SameSite cookies.
- **Secrets**: only in env (`.env.local` / Vercel); never committed; `.env.local.example` documents
  keys without values. Rotate on exposure.
- **Secure uploads**: allowlist, size cap, SVG sanitize, private buckets for sensitive files (010/007).
- **Headers**: HSTS, X-Content-Type-Options, Referrer-Policy, CSP (tune for embeds/analytics) **[to add]**.
- **Dependencies**: keep patched; audit periodically (022).

---

## 7. Audit logging **[to add]** (`audit_logs`, 010)
Record who did what/when for privileged actions: content publish, course/price/voucher changes, role
grants, enrollments, payments, deletions. Immutable, queryable in admin (017). Feeds compliance +
incident response. created_by/at on versioned entities (006) contribute.

---

## 8. Privacy & compliance
Collect only necessary PII (forms 009); resumes/certificates in private storage; honor data deletion
requests; document retention. Payment data handled by Razorpay (no card storage). Email via Resend.
Align privacy/terms pages (already CMS-editable) with actual practice.

---

## 9. Definition of done
Admins HMAC-verified via `isAdminAuthed`; students via server-verified Supabase session; **authorization
by permission (RBAC), never client-trusted `userId`**; all inputs Zod-validated; admin HTML sanitized +
sandboxed; secrets env-only with strong `ADMIN_SESSION_SECRET`; rate-limit + lockout on auth; audit
logs on privileged actions; secure headers + CSRF + secure uploads; MFA for admin.

---
_Status: ✅ complete._
