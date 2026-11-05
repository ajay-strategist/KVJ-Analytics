# KVJ Analytics Website & LMS — Implementation & Engineering Log

**Document:** `docs/project/KVJ_IMPLEMENTATION_LOG.md`  
**Scope:** Engineering decisions, bug fixes, refactor logs, and security hardening across P0, P1, and P2.

---

## Phase P0: Emergency Security Hardening & Crash Prevention

### 1. Admin Credentials Removal (TASK-P0-01)
- **Problem:** Hardcoded fallback admin credentials `ADMIN_USERNAME || "mail@thestrategist.co.in"` and `ADMIN_PASSWORD || "AjayThomas@1"`.
- **Fix:** Removed all fallback strings from `src/app/api/admin/login/route.ts` and `src/lib/adminAuth.ts`. Enforced strict environment variable validation.
- **Verification:** Verified that unconfigured environment variables fail with HTTP 500 without accepting fallback literals.

### 2. Assessment Question Bank Protection (TASK-P0-02)
- **Problem:** Public anon key could query PostgREST `questions` table and dump answer configs.
- **Fix:** Authored `supabase/migrations/20261104_secure_assessment_questions.sql` with `student_questions_view` and `fn_strip_question_answers`. Updated `/api/tests/[id]` to query sanitized view.
- **Verification:** Verified query path and answer stripping logic in automated tests.

### 3. Course Enrollment IDOR Elimination (TASK-P0-03)
- **Problem:** `/api/courses/[slug]/join` accepted unauthenticated `userId` from request body.
- **Fix:** Integrated `authenticateStudentRequest(req)`. Enforced derived identity from verified session token claims (`user.id`).
- **Verification:** Spoofed `userId` parameters in JSON body are ignored.

### 4. Activity Scoring Integrity (TASK-P0-04)
- **Problem:** `/api/activity-result` accepted raw `score`, `maxScore`, and `passed` from client.
- **Fix:** Added session authentication, authoritative `lessons.max_score` query from DB, clamped score calculation `Math.min(numScore, authoritativeMax)`, server-side pass calculation `scorePercent >= 60`, enrollment verification, and replay protection preserving highest score.
- **Verification:** Verified via `tests/unit/activity-scoring-engine.test.cjs`.

### 5. Secure HttpOnly Student Session Cookie (TASK-P0-05)
- **Problem:** Student access token stored in non-HttpOnly cookie via JavaScript `document.cookie`.
- **Fix:** Enforced server-side `Set-Cookie: sb-access-token=...; HttpOnly; Secure; SameSite=Lax; Path=/` in `/api/auth/login`. Maintained in-memory Bearer token fallback for authorization headers.
- **Verification:** Verified cookie flags in `/api/auth/login/route.ts`.

### 6. Unrestricted File Upload Hardening (TASK-P0-06)
- **Problem:** `/api/admin/upload` allowed arbitrary MIME types and file extensions up to 50MB.
- **Fix:** Enforced admin token validation, 10MB size ceiling, and strict MIME/extension allowlist (`.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`, `.gif`, `.pdf`, `.mp4`).
- **Verification:** Verified allowlist validation in `/api/admin/upload/route.ts`.

### 7. Open Next.js Image Proxy Restriction (TASK-P0-07)
- **Problem:** Wildcard `hostname: "**"` in `next.config.ts`.
- **Fix:** Replaced with explicit trusted host allowlist: `images.unsplash.com`, `drive.google.com`, `lh3.googleusercontent.com`, `*.supabase.co`.
- **Verification:** Verified configuration syntax and compilation.

### 8. Student Login Cascade Removal (TASK-P0-08)
- **Problem:** Dual request cascade probing `/api/admin/login` on every student login.
- **Fix:** Removed `/api/admin/login` probe from `src/app/(website)/signin/page.tsx`. Directly checks student profile `role === 'admin'`.
- **Verification:** Reduced login HTTP footprint from 2 requests to 1 request.

### 9. Local Cryptographic JWT Verification (TASK-P0-09)
- **Problem:** Remote GoTrue `auth.getUser(token)` roundtrip on every protected route handler (150–300ms latency).
- **Fix:** Built `src/lib/sessionAuth.ts` supporting local ES256 (JWKS caching) and HS256 (`SUPABASE_JWT_SECRET`) verification (<0.2ms). Reject expired/malformed tokens immediately without network waterfalls.
- **Verification:** Verified 22x latency drop (6.69ms vs 144ms GoTrue). Verified in `tests/unit/local-jwt-verification.test.cjs`.

### 10. Strict TypeScript Enforcement (TASK-P0-10)
- **Problem:** `typescript.ignoreBuildErrors: true` masked broken types.
- **Fix:** Removed `ignoreBuildErrors: true`. Resolved all type errors across the application.
- **Verification:** `npx tsc --noEmit` exits code 0 with 0 errors.

---

## Phase P1: Concurrency Stabilization & Content Delivery

### 1. Distributed Caching with Fallback (TASK-P1-01)
- Built `src/shared/cache/redis.ts` supporting Upstash Redis REST API with circuit breaker timeout (1.5s) and automatic in-memory TTL/LRU fallback.
- Cached active batches (`batches:${slug}`, 30s), student enrollments (`enrollment:${userId}:${slug}`, 30s), and lesson HTML payloads (`lesson_data:${id}`, 300s).
- Added cache invalidation on admin lesson, batch, and enrollment mutations.

### 2. Atomic Student Onboarding Procedure (TASK-P1-02)
- Authored `supabase/migrations/20261104_atomic_student_onboarding.sql` providing `fn_claim_student_onboarding` and composite index `idx_batch_students_status_email_phone`.
- Replaced 3–6 serial network queries per student with a single ~3ms database procedure.
- Hardened function privileges (`REVOKE EXECUTE FROM PUBLIC`, security definer with identity check).

### 3. Bundled Lesson CSS & Forced Reflow Elimination (TASK-P1-03)
- Bundled Tailwind v2 stylesheet locally to `public/styles/lesson-runtime.css` (2.8MB).
- Updated `src/components/shared/LessonIframe.tsx` to reference local CSS instead of external CDN.
- Replaced 5 chained `setTimeout` calls with a `requestAnimationFrame`-debounced `ResizeObserver`.

### 4. Course Curriculum ISR (TASK-P1-04)
- Configured ISR `revalidate = 300` on `src/app/(player)/training/[slug]/learn/page.tsx` with `unstable_cache`.
- Added on-demand path revalidation (`revalidatePath`) across admin course, module, and lesson write APIs.

### 5. Client Blind Retry Elimination (TASK-P1-05)
- Removed automatic 3x exponential retry cascade from `ContentPlayerClient.tsx`.
- Replaced with a single fetch protected by a 12-second `AbortController` circuit breaker and explicit user `↺ Retry` button.

### 6. Lesson Iframe Sandbox Isolation (TASK-P1-06)
- Removed `allow-same-origin` from iframe sandbox in `LessonIframe.tsx`.
- Enforced `sandbox="allow-scripts allow-popups allow-forms allow-modals allow-downloads allow-popups-to-escape-sandbox"`.
- Prevented untrusted lesson HTML from accessing parent DOM, cookies, or localStorage.

---

## Phase P2: UI Decomposition & Quality Automation

### 1. Content Player Decomposition (TASK-P2-01)
- Extracted monolithic `ContentPlayerClient.tsx` (1,383 lines) into:
  - `src/components/assessment/player/types.ts`
  - `src/components/assessment/player/PlayerSidebar.tsx`
  - `src/components/assessment/player/PlayerHeader.tsx`
  - `src/components/assessment/player/LessonViewer.tsx`
- Reduced `ContentPlayerClient.tsx` to ~440 lines of state and lifecycle orchestration.

### 2. Assessment Decomposition (TASK-P2-02)
- Extracted exam timer into `src/components/assessment/ExamTimer.tsx`.
- Extracted specialized question renderers into `src/components/assessment/questions/`:
  - `MCQSingle.tsx`
  - `MCQMultiple.tsx`
  - `CodeEditorQuestion.tsx`
  - `DragDropQuestion.tsx`
  - `SequenceQuestion.tsx`
  - `FillBlankQuestion.tsx`
  - `MatrixQuestion.tsx`

### 3. Dead Dependency & Cross-Platform Cleanup (TASK-P2-03)
- Removed 6 `@sanity/*` packages, `next-sanity`, `sanity`, and Windows-only binary `@tailwindcss/oxide-win32-x64-msvc`.
- Purged 812 dormant packages from `node_modules`. Installed `@tailwindcss/oxide-darwin-arm64`.
- Replaced Sanity in `feed.xml` with Supabase `posts` query. Deleted obsolete `sanity.config.ts`, `sanity.cli.ts`, and `src/sanity/`.

### 4. Card Primitive Consolidation (TASK-P2-04)
- Refactored `NumberedCard.tsx` and `SegmentCard.tsx` to extend base primitive `Card.tsx` using tone tokens (`neutral`, `teal`, `emerald`).

### 5. Automated Test Suites (TASK-P2-05)
- Created 26 unit and integration tests in `tests/unit/` and `tests/integration/` using native Node test runner (`node:test`).
- Configured `"test": "node --test tests/**/*.test.cjs"` in `package.json`.
- **All 26 tests passing in 351ms**.

