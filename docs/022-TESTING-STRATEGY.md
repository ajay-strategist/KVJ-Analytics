# 022 — Testing Strategy
**KVJ Analytics Platform V3 · Phase 6 · Infrastructure**
How we prove it works before "done." **[to add]** — net-new (today: `tsc` + manual/logic review).

---

## 1. Philosophy
Test the **risky and irreversible** first: payments, enrollment, unlock, auth/permissions, exam
eligibility, certificate issuance, CMS publish/fallback. UI polish gets lighter coverage. Fast
feedback in CI (021); flaky tests are bugs.

---

## 2. Layers
- **Static (in code baseline):** `tsc --noEmit` (strict target) + ESLint + Prettier. First gate.
- **Unit:** pure logic — `deepMerge`/`mergePageContent` (fallback rules, 002), `adminToken`/
  `isAdminAuthed` (012), Zod schemas (011), pricing/score/grading calc, voucher validity. (Vitest/Jest.)
- **Integration:** API routes with a test DB — contact→lead, unlock→enrollment, **payment webhook**
  (signature + order lookup + idempotency, 015/011), content PUT→revalidate, permission checks (013).
- **E2E:** critical user journeys (Playwright): enroll (paid + unlock) → learn → activity → assessment
  gating → mock; admin login → edit/publish page → verify live; forms → lead; signup/signin.
- **Accessibility:** axe on key pages (WCAG 2.2 AA, 001 §20) — keyboard, focus, contrast, ARIA.
- **Performance:** Lighthouse CI budgets (020).
- **Regression:** every fixed bug gets a test; optional visual regression on core pages.

---

## 3. Critical cases (must-have)
Payment webhook can't double-enroll or trust client amount (idempotent, order-looked-up) · unlock
respects active/expiry/max_uses · `enrollments(user_id, course_slug)` uniqueness holds · fallback-
merge never white-screens (missing/empty stored fields) · admin routes reject forged/absent cookies ·
permission checks deny unauthorized (013) · module gating blocks next-module until pass · certificate
only issues post external final · CMS publish revalidates the right paths.

---

## 4. Data & environment
Seeded test DB (Supabase local/branch); factories for users/courses/orders; mock external providers
(Razorpay/Resend/LLM) — never hit live third parties in tests; reset state between runs.

---

## 5. CI integration (021)
PR runs static → unit → integration → E2E (critical) → a11y → Lighthouse; block merge on failure.
Nightly full E2E. Coverage tracked (target meaningful coverage on money/auth/LMS logic, not a blanket %).

---

## 6. Definition of done
Money/auth/enrollment/gating/publish paths covered by unit+integration+E2E · a11y + Lighthouse in CI ·
external providers mocked · every bugfix has a regression test · green required to merge · no flaky
tests.

---
_Status: ✅ complete._
