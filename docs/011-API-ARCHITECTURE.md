# 011 — API Architecture
**KVJ Analytics Platform V3 · Phase 3 · Enterprise Platform**
Conventions for all route handlers: structure, auth, validation, responses, errors, webhooks, rate
limiting. **[in code]** exists, **[to add]** planned.

---

## 1. Style: Next.js App Router route handlers
APIs live in `src/app/api/**/route.ts` (Next 16, server runtime). Public endpoints (contact, unlock,
payments webhook, course join, tests) + `/api/admin/**` management endpoints. Route `params` are
**Promises → await** (Next 16, CLAUDE.md).

---

## 2. Current surface **[in code]** (~45 routes)
- **Public/app:** `contact`, `unlock`, `payments/razorpay` (+ `/webhook`), `courses/[slug]/join`,
  `tests/[id]` (+ `/submit`), `activity-result`, `materials/[id]`.
- **Admin (`/api/admin/*`):** `login`, `logout`, `content/[slug]`, `courses(+[id])`, `modules`,
  `lessons`, `questions`, `tests`, `categories(+[id])`, `unlock-codes(+[id])`, `internships(+[id])`,
  `internship-applications(+[id])`, `jobs(+[id])`, `job-applications(+[id])`, `blog(+[id])`, `leads`,
  `inquiries(+[id])`, `enrollments`, `batches`, `clients`, `testimonials`, `case-studies`, `team`,
  `upload`.
Pattern: collection route (GET list / POST create) + `[id]` route (PUT update / DELETE). Consistent —
keep it.

---

## 3. Auth **[in code]**
- **Admin:** `admin_session` cookie == `adminToken()` HMAC; verify with **`isAdminAuthed(req)`**
  (constant-time compare, `lib/adminAuth.ts`). Every `/api/admin/*` must guard. **[reconcile]** some
  routes inline `cookie === adminToken()`; standardize on `isAdminAuthed` (timing-safe).
- **Student:** Supabase session; `Header` syncs `sb-access-token` cookie → server verifies. **[to
  add / harden]** derive `userId` from the verified session server-side, **never** from request body
  (current payment/unlock gotcha — CLAUDE.md).
- **Service role:** server-only key for privileged writes; never shipped to client.

---

## 4. Request/response contract **[standardize — to add]**
- **Validate every input with Zod**; reject invalid → `400 { error }`. (Today `content` PUT accepts
  arbitrary JSON — harden across routes.)
- **Success:** `200/201 { data }` or `{ success: true, … }` (match existing shape).
- **Errors:** consistent `{ error: string, code? }` + correct status: `400` invalid, `401`
  unauthorized, `403` forbidden (RBAC 013), `404` not found, `409` conflict, `429` rate-limited,
  `500` server. Never leak stack traces/secrets.
- **Idempotency:** payment webhook is idempotent (looks up order, no double-enroll — already fixed);
  apply the pattern to any retry-prone write.

---

## 5. Webhooks
`payments/razorpay/webhook` **[in code, hardened]**: verify HMAC signature → **look up the order** for
trusted user/course/amount (not client body) → idempotent enroll + receipt email. Model for all
webhooks: verify signature, look up server-side truth, idempotent, log, return fast. Future: Search
Console/social/email callbacks (008/019) follow the same rules.

---

## 6. Rate limiting, abuse, CORS **[to add]**
Rate-limit public POSTs (contact, unlock, join, tests, forms 009) per IP/session; honeypot/CAPTCHA on
forms; lock same-origin (no open CORS on mutations); size-limit bodies + uploads. Payment/unlock/exam
endpoints get stricter limits.

---

## 7. Versioning & future public API
Current internal APIs need no version prefix. If/when an external/partner API or SDK is exposed
(master rules), introduce `/api/v1/*`, documented contracts, auth tokens/keys, and deprecation
policy. Keep internal admin/app routes separate from any public API surface.

---

## 8. Performance & observability (ties 020/021)
Cache-friendly GETs (revalidate/tags); avoid N+1 (select needed columns, joins, indexes 010);
paginate list endpoints; log errors server-side (not to client); structured logs for audit (012).

---

## 9. Definition of done
Every route: awaits `params` · guards auth (`isAdminAuthed`/verified session) · **Zod-validates
input** · returns consistent `{data}`/`{error}` + correct status · no client-trusted authorization ·
rate-limited if public · idempotent if retry-prone · webhooks signature-verified + server-truth ·
no secret/stack leakage · errors logged/audited.

---
_Status: ✅ complete._
