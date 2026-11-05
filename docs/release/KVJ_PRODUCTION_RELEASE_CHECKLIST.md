# KVJ Analytics Website & LMS — Production Release & Deployment Checklist

**Target Release:** KVJ Analytics Production Platform V3  
**Auditor / DevOps Lead:** Principal Systems Architect  
**Status:** **RELEASE HELD PENDING OWNER APPROVAL & STAGING RUNS**

---

## 1. Pre-Deployment Gate (Zero-Defect Guarantee)

Before initiating deployment to production, all of the following gates must be checked:

- [ ] **Typecheck Clean:** `npx tsc --noEmit` exits with status code 0.
- [ ] **Build Clean:** `npx next build` compiles all 126 static and dynamic routes with zero warnings/errors.
- [ ] **Test Suite Clean:** `npm test` executes and passes all 26 unit and integration tests.
- [ ] **Security Verifications Complete:** All P0 security items (P0-01 to P0-10) audited and verified.
- [ ] **No Hardcoded Credentials:** Confirmed zero fallback secrets or tokens in git.
- [ ] **Database Migrations Reviewed:** `20261104_secure_assessment_questions.sql` and `20261104_atomic_student_onboarding.sql` validated for idempotency and rollback safety.
- [ ] **Staging Execution Sign-off:** Staging load test (80 VUs) completed with error rate < 1% and p95 < 500ms.

---

## 2. Production Environment Variable Verification

Verify that the following environment variables are securely configured in Vercel Production Settings:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://[PROD_REF].supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `[PROD_ANON_KEY]`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `[PROD_SERVICE_ROLE_KEY]`
- [ ] `SUPABASE_JWT_SECRET` = `[PROD_JWT_SECRET]` (Matches Supabase Auth JWT Secret for local verification)
- [ ] `ADMIN_USERNAME` = `[SECURE_ADMIN_USERNAME]`
- [ ] `ADMIN_PASSWORD` = `[STRONG_RANDOM_ADMIN_PASSWORD]` (Minimum 16 characters)
- [ ] `ADMIN_SESSION_SECRET` = `[STRONG_RANDOM_SESSION_SECRET]`
- [ ] `UPSTASH_REDIS_REST_URL` = `https://[REDIS_HOST].upstash.io` (Optional; in-memory LRU fallback active)
- [ ] `UPSTASH_REDIS_REST_TOKEN` = `[REDIS_TOKEN]`

---

## 3. Production Deployment Runbook

### Phase A: Database Schema Deployment (Before Code Deploy)
*PostgreSQL schema changes must be applied prior to deploying application code to prevent runtime schema mismatches.*

1. [ ] **Create Production Snapshot:** Take a manual backup of the production database in the Supabase Dashboard.
2. [ ] **Execute Migration 1:** Apply `supabase/migrations/20261104_secure_assessment_questions.sql` in the Supabase SQL Editor.
3. [ ] **Verify Migration 1:** Confirm `student_questions_view` is visible and `questions` has RLS enabled.
4. [ ] **Execute Migration 2:** Apply `supabase/migrations/20261104_atomic_student_onboarding.sql` in the Supabase SQL Editor.
5. [ ] **Verify Migration 2:** Confirm `fn_claim_student_onboarding` exists and has `service_role` execute permissions.

### Phase B: Application Code Promotion
1. [ ] **Merge PR to `main`:** Push verified branch to GitHub `main` branch.
2. [ ] **Monitor Vercel Production Build:**
   - Verify Turbopack build succeeds.
   - Verify static route generation passes.
3. [ ] **Confirm Zero Downtime Cutover:** Ensure traffic routes to the new deployment hash.

---

## 4. Post-Deployment Smoke Test (15 Functional Stages)

Immediately upon deployment, perform an end-to-end smoke test on production:

1. [ ] **Stage 01:** Student login via `/signin` with valid credentials.
2. [ ] **Stage 02:** Student dashboard access (`/training/[slug]/learn`).
3. [ ] **Stage 03:** Batch enrollment verification in student profile.
4. [ ] **Stage 04:** Course overview navigation.
5. [ ] **Stage 05:** Module curriculum collapsible outline expanding and collapsing.
6. [ ] **Stage 06:** Lesson selection and content loading.
7. [ ] **Stage 07:** HTML rich text lesson rendering (confirm formatting and syntax highlighting).
8. [ ] **Stage 08:** Interactive simulation iframe loading in sandboxed isolation.
9. [ ] **Stage 09:** Simulation activity completion and score submission (verify `/api/activity-result`).
10. [ ] **Stage 10:** Mock test loading (verify question stems render and answer keys are omitted from network tab).
11. [ ] **Stage 11:** Test taking widget interaction and exam timer countdown.
12. [ ] **Stage 12:** Assessment submission and instant score calculation.
13. [ ] **Stage 13:** Student progress bar updating in player sidebar.
14. [ ] **Stage 14:** Resume lesson state preserved upon page reload.
15. [ ] **Stage 15:** Student logout and session cookie invalidation.

---

## 5. Post-Release Observability & Monitoring

Monitor production telemetry for 60 minutes following deployment:

- [ ] **Vercel Function Metrics:** Monitor error rate (must stay < 0.05%) and function duration (p95 < 200ms).
- [ ] **Supabase Database Dashboard:** Monitor PgBouncer connection pool usage (must stay < 40% of pool limit).
- [ ] **Admin Audit Logs:** Verify admin logins and background mutations log correctly.

---

## 6. Rollback Decision Framework

If any of the following occur within the first 60 minutes:
- Sustained HTTP 500 error rate > 1%.
- Student login failures during classroom sessions.
- Database connection pool exhaustion (> 80% capacity).

**Execute Immediate Rollback:**
1. In Vercel Dashboard, click **Deployments** → Select prior stable deployment → Click **Instant Rollback**.
2. If database schema incompatibility occurs, execute the reverse SQL runbook in [KVJ_DATABASE_MIGRATION_REPORT.md](file:///Volumes/Ajay%20Thomas/Antigravity/KVJ%20Analytics%20Website%201/docs/release/KVJ_DATABASE_MIGRATION_REPORT.md).
3. Notify the engineering team and open a remediation incident.

