# KVJ Analytics — Staging Environment Readiness Checklist

**Document:** `docs/staging/KVJ_STAGING_READINESS_CHECKLIST.md`  
**Milestone:** Phase 11.3 — Pre-Provisioning Verification & Release Gate Checklist  
**Date:** November 5, 2026  
**Auditor / Principal Systems Architect:** Antigravity Engineering Lead & Systems Architect  
**Scope:** Staging Supabase Provisioning, Vercel Preview Configuration, Migration Execution, and Verification Protocol  
**Status:** **READY FOR EXECUTION UPON STAGING PROJECT CREATION**

---

## 1. Staging Provisioning & Deployment Checklist

This checklist defines the sequential gates required to instantiate, configure, seed, and verify the KVJ Staging Environment. Each item must be marked complete before staging user acceptance testing begins.

### Gate A: Isolated Staging Supabase Project
- [ ] **A.1:** Create new Supabase Project named `kvj-analytics-staging` in region `ap-south-1` (Mumbai).
- [ ] **A.2:** Verify project reference is completely distinct from production (`bdwwgipbrnkgihfjihxz`).
- [ ] **A.3:** Confirm database password is secure and stored in password manager (never in git).
- [ ] **A.4:** Enable PostgreSQL extensions (`uuid-ossp`, `pgcrypto`) in project settings.
- [ ] **A.5:** Record staging API credentials: URL, Anon Key, Service-Role Key, and JWT Secret.

### Gate B: Staging Environment Variables (Vercel)
- [ ] **B.1:** In Vercel Project Settings, navigate to Environment Variables.
- [ ] **B.2:** Add `NEXT_PUBLIC_SUPABASE_URL` pointing to staging Supabase URL (Target: **Preview** only).
- [ ] **B.3:** Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` with staging Anon key (Target: **Preview** only).
- [ ] **B.4:** Add `SUPABASE_SERVICE_ROLE_KEY` with staging Service Role key (Target: **Preview** only).
- [ ] **B.5:** Add `SUPABASE_JWT_SECRET` matching staging Supabase JWT secret (Target: **Preview** only).
- [ ] **B.6:** Add `DATABASE_URL` with staging PgBouncer pooler connection string (port 6543).
- [ ] **B.7:** Add `NEXT_PUBLIC_APP_URL=https://staging.kvjanalytics.in`.
- [ ] **B.8:** Confirm zero production credentials exist in the Preview environment variable list.

### Gate C: Staging Authentication & Email Configuration
- [ ] **C.1:** In Supabase Dashboard -> Authentication -> URL Configuration:
  - Set Site URL: `https://staging.kvjanalytics.in`
  - Add Redirect URLs: `https://staging.kvjanalytics.in/**`
- [ ] **C.2:** Adjust rate limits for staging testing (Signups per hour: 500).
- [ ] **C.3:** Configure Inbucket / custom SMTP test mailer or enable auto-confirm.

### Gate D: Database Migration Execution
Apply migrations strictly in chronological sequence:
- [ ] **D.1:** Execute `20260101000000_baseline_schema.sql` (Verifying 31 tables created).
- [ ] **D.2:** Execute `20260916_100_students_concurrency_fix.sql` (`batch_students` and roster constraints).
- [ ] **D.3:** Execute `20260917_concurrency_optimizations.sql` (Composite indexes).
- [ ] **D.4:** Execute `20261104_atomic_student_onboarding.sql` (`fn_claim_student_onboarding` RPC).
- [ ] **D.5:** Execute `20261104120000_secure_assessment_questions.sql` (`student_questions_view` and answer sanitizer).
- [ ] **D.6:** Introspect `supabase_migrations.schema_migrations` to confirm all 5 versions are logged.

### Gate E: Security & Row-Level Security (RLS) Verification
- [ ] **E.1:** Query `questions` as anonymous user; confirm 0 rows returned (direct access blocked).
- [ ] **E.2:** Query `student_questions_view` as anonymous user; confirm questions returned without `correctIndex` or answers.
- [ ] **E.3:** Confirm `test_attempts` RLS strictly isolates student submissions.
- [ ] **E.4:** Confirm lesson iframe sandbox specifies `sandbox="allow-scripts"` without `allow-same-origin`.

### Gate F: Synthetic Test Data Seeding
- [ ] **F.1:** Run `node scripts/seed-local-lms.cjs` targeting staging environment variables.
- [ ] **F.2:** Verify course `power-bi` exists with modules and child lessons.
- [ ] **F.3:** Verify batch `KVJ Engineering Institute` exists with active TOTP secret.
- [ ] **F.4:** Verify mock test `5e829539-68a4-4914-bc27-585900754736` exists with 5 sanitized questions.
- [ ] **F.5:** Verify 100 synthetic accounts (`student001` - `student100@kvjanalytics.test`) exist in Auth, Profiles, Batch Students, and Enrollments.

### Gate G: Application Deployment & Domain Setup
- [ ] **G.1:** Deploy staging branch to Vercel preview.
- [ ] **G.2:** Assign custom domain `staging.kvjanalytics.in` to preview deployment.
- [ ] **G.3:** Confirm automatic SSL/TLS certificate is active.
- [ ] **G.4:** Confirm Vercel Deployment Protection or HTTP Basic Auth is enabled to prevent public indexing.

### Gate H: Staging Smoke & Load Testing
- [ ] **H.1:** Run 14-point smoke test suite against staging:
  ```bash
  BASE_URL=https://staging.kvjanalytics.in node --test tests/smoke/local_lms_workflow_smoke.test.cjs
  ```
- [ ] **H.2:** Run single-VU verification flow in k6:
  ```bash
  k6 run -e BASE_URL=https://staging.kvjanalytics.in -e VUS=1 -e DURATION=30s tests/load/lms_80_user_load_test.js
  ```
- [ ] **H.3:** Run full 80-VU Staging Load Test:
  ```bash
  k6 run -e BASE_URL=https://staging.kvjanalytics.in \
    --vus 80 --duration 3m \
    --summary-export=local_test_evidence/staging_80vu_summary.json \
    tests/load/lms_80_user_load_test.js
  ```
- [ ] **H.4:** Confirm check pass rate $\ge$ 99%, zero HTTP 5xx errors, and p95 latency < 500ms over cloud network.

### Gate I: Manual User Acceptance Testing (UAT)
- [ ] **I.1:** Student sign-in via web UI at `/signin`.
- [ ] **I.2:** Course curriculum navigation at `/training/power-bi/learn`.
- [ ] **I.3:** Interactive simulation activity execution and score recording.
- [ ] **I.4:** Mock test taking at `/training/power-bi/tests/[testId]`.
- [ ] **I.5:** Exam submission and instant score breakdown display.
- [ ] **I.6:** Admin dashboard login and batch management at `/admin/batches`.

### Gate J: Rollback & Production Release Approval
- [ ] **J.1:** Confirm staging database snapshot is captured prior to final sign-off.
- [ ] **J.2:** Confirm zero regression in production backups.
- [ ] **J.3:** Present staging test evidence report to Stakeholders / Project Owner.
- [ ] **J.4:** Formal sign-off for Phase 12 Production Deployment.

