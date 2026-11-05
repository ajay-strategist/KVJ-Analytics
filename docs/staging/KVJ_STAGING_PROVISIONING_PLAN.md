# KVJ Analytics — Staging Environment Provisioning & Architecture Plan

**Document:** `docs/staging/KVJ_STAGING_PROVISIONING_PLAN.md`  
**Milestone:** Phase 11.3 — Staging Readiness Preparation  
**Date:** November 5, 2026  
**Auditor / Principal Systems Architect:** Antigravity Engineering Lead & Systems Architect  
**Scope:** KVJ Analytics Website, LMS, CMS, Student Auth, and Staging Database Infrastructure  
**Status:** **PLANNING COMPLETE — READY FOR CLIENT STAGING PROJECT PROVISIONING**

---

## 1. Executive Summary

This document defines the formal blueprint for provisioning an isolated, cloud-hosted **Staging Environment** for KVJ Analytics. Staging mirrors the production architecture while maintaining 100% data, network, and credential isolation from the live production database (`bdwwgipbrnkgihfjihxz.supabase.co`).

### Fundamental Isolation Mandate:
- **No Shared Credentials:** Staging uses completely distinct Supabase project references, API keys, database connection strings, and JWT secrets.
- **No Production Data in Staging:** Staging begins from empty baseline schema migrations and is seeded purely with synthetic test accounts (`@kvjanalytics.test`).
- **No Production Access from Staging:** Vercel staging preview branches are locked to staging environment variables with strict pre-deployment verification.

---

## 2. Recommended Supabase Staging Project Configuration

### 2.1 Project Tier & Sizing
- **Tier:** Supabase Pro Tier (recommended to support custom domain, automated daily backups, and dedicated compute).
- **Region:** `ap-south-1` (Mumbai, India) — matching production geographic proximity to primary student user base.
- **PostgreSQL Version:** PostgreSQL 15.x.
- **Compute Add-on:** Standard Compute (Micro or Small instance is sufficient for 80–100 VU staging load testing).

### 2.2 PostgreSQL Settings & Extensions
The following PostgreSQL extensions and configuration parameters must be enabled:
```sql
-- Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Connection & Timeout Settings
ALTER DATABASE postgres SET statement_timeout = '15000ms';
ALTER DATABASE postgres SET idle_in_transaction_session_timeout = '30000ms';
```

### 2.3 Connection Pooling (PgBouncer)
- **Port:** `6543` (Transaction Pooling Mode).
- **Default Pool Size:** 25 connections.
- **Max Client Connections:** 200.

---

## 3. Required Next.js / Vercel Staging Configuration

### 3.1 Vercel Project Setup
- **Vercel Project:** `kvj-analytics-web`
- **Deployment Environments:**
  - `Production`: Linked to branch `main` (requires final release approval).
  - `Preview / Staging`: Linked to branch `staging` or `release/phase-11`.
- **Custom Staging Domain:** `https://staging.kvjanalytics.in`
- **SSL / TLS:** Managed Automatic Let's Encrypt / Vercel Edge Certificate.
- **Password Protection (Vercel Deployment Protection):** Enabled via Vercel Standard Protection or HTTP Basic Auth to block public indexing and crawlers.

---

## 4. Environment Variable Inventory & Separation

The following environment variables must be configured in Vercel for the **Preview / Staging** environment ONLY:

| Variable Name | Staging Value Description | Client / Server Scope |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<staging-ref>.supabase.co` | Public (Client & Server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Staging Supabase Anonymous Key | Public (Client & Server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Staging Supabase Service-Role Secret Key | **Server Only** |
| `SUPABASE_JWT_SECRET` | Staging Supabase JWT Secret (from Project API Settings) | **Server Only** |
| `DATABASE_URL` | `postgresql://postgres.[ref]:[pass]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres` | **Server Only** |
| `DIRECT_URL` | `postgresql://postgres:[pass]@db.[ref].supabase.co:5432/postgres` | **Server Only** |
| `NEXT_PUBLIC_APP_URL` | `https://staging.kvjanalytics.in` | Public |
| `NEXTAUTH_SECRET` | Secure 64-character random string | **Server Only** |
| `ADMIN_SESSION_TOKEN` | Secure staging admin password token | **Server Only** |
| `UPSTASH_REDIS_REST_URL` | Staging Upstash Redis Database URL (or in-memory fallback) | **Server Only** |
| `UPSTASH_REDIS_REST_TOKEN` | Staging Upstash Redis REST Token | **Server Only** |
| `RAZORPAY_KEY_ID` | `rzp_test_...` (Razorpay Test Mode Key) | **Server Only** |
| `RAZORPAY_KEY_SECRET` | Razorpay Test Mode Secret | **Server Only** |
| `NODE_ENV` | `production` | Server |
| `ALLOW_LOCAL` | `false` | Server |

> [!CAUTION]
> Under NO circumstances should production values for `bdwwgipbrnkgihfjihxz` be entered into the Staging environment configuration.

---

## 5. Authentication, Email & Redirect URLs

### 5.1 Supabase Auth Configuration
- **Site URL:** `https://staging.kvjanalytics.in`
- **Additional Redirect URLs:**
  - `https://staging.kvjanalytics.in/auth/callback`
  - `https://staging.kvjanalytics.in/training/*`
  - `https://staging.kvjanalytics.in/signin`
  - `https://staging.kvjanalytics.in/admin`
- **Email Confirmation:**
  - For staging load testing, email auto-confirmation is handled via `fn_claim_student_onboarding` and `/api/auth/confirm-user`.
  - Rate limits for email sending should be adjusted in Supabase Dashboard (Auth -> Rate Limits -> Signups per hour: 500).

---

## 6. Storage Buckets & Policies

The following storage buckets must be created in the Staging Supabase project:

1. `course-materials` (Private):
   - Access restricted to service-role and enrolled students via signed URLs or `/api/materials/[id]`.
2. `public-media` (Public):
   - Read access permitted to public; write access restricted to service-role / admin.
3. `certificates` (Private):
   - Secure PDF certificate storage.

---

## 7. Complete Migration Sequence & Dependency Order

The staging database must be instantiated by executing migrations strictly in their chronological dependency order:

1. `20260101000000_baseline_schema.sql` (Creates all 31 foundational tables, RLS baseline, indexes, and triggers)
2. `20260916_100_students_concurrency_fix.sql` (Adds `batch_students`, roster constraints, index optimizations)
3. `20260917_concurrency_optimizations.sql` (Adds performance indexes on `enrollments` and `test_attempts`)
4. `20261104_atomic_student_onboarding.sql` (Creates `fn_claim_student_onboarding` atomic stored procedure)
5. `20261104120000_secure_assessment_questions.sql` (Creates `student_questions_view`, answer-stripping function, security barrier)

*(See [`docs/staging/KVJ_STAGING_MIGRATION_MATRIX.md`](file:///Volumes/Ajay%20Thomas/Antigravity/KVJ%20Analytics%20Website%201/docs/staging/KVJ_STAGING_MIGRATION_MATRIX.md) for full SQL reconciliation details).*

---

## 8. Synthetic Data Seeding Strategy

Once migrations are applied, the staging database must be populated with deterministic test data using:
```bash
# Execute against Staging Supabase via environment overrides
export NEXT_PUBLIC_SUPABASE_URL="https://<staging-ref>.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<staging-service-role-key>"
node scripts/seed-local-lms.cjs
```

### Seeded Assets:
- **1 Course:** `power-bi` (`Power BI Data Modeling & Analytics`)
- **1 Module:** `Power BI Core & Modeling`
- **2 Lessons:** 1 Interactive HTML Material, 1 Simulation Activity
- **1 Batch:** `KVJ Engineering Institute` with active TOTP secret
- **1 Mock Test:** `Power BI Practice Exam` with 5 heterogeneous question types
- **100 Synthetic Students:** `student001@kvjanalytics.test` through `student100@kvjanalytics.test`
- **100 Batch Roster Entries:** Status `CLAIMED`
- **100 Course Enrollments:** Status `active`

---

## 9. Staging Load Testing & Verification Protocol

After staging deployment:
1. **Automated Smoke Test:**
   ```bash
   node --test tests/smoke/local_lms_workflow_smoke.test.cjs
   ```
2. **Staging 80-VU Load Test:**
   ```bash
   k6 run -e BASE_URL=https://staging.kvjanalytics.in \
     -e TEST_LESSON_ID=<staging-lesson-id> \
     -e TEST_EXAM_ID=<staging-exam-id> \
     --vus 80 --duration 3m \
     --summary-export=local_test_evidence/staging_80vu_summary.json \
     tests/load/lms_80_user_load_test.js
   ```

---

## 10. Observability, Monitoring & Rollback Strategy

### 10.1 Telemetry
- **Vercel Analytics & Speed Insights:** Monitor real-world Core Web Vitals and function duration.
- **Supabase Dashboard Metrics:** Monitor PostgreSQL connection pool saturation, query execution times, and auth rate limits.

### 10.2 Rollback Plan
If critical issues or regressions are discovered in Staging:
1. Revert Vercel deployment to previous stable preview build instantly via Vercel Dashboard.
2. In Supabase, restore database to pre-test snapshot via Supabase Point-in-Time Recovery (PITR) or automated daily backup.
3. Because Staging is 100% isolated, rollbacks have zero impact on live students or corporate operations.

---

## 11. Cost & Resource Considerations

- **Supabase Pro (Staging):** $25/month (includes compute, daily backups, and custom domains).
- **Vercel Preview Deployments:** Included in existing Vercel Pro team plan.
- **Upstash Redis (Staging):** Free tier (up to 10,000 commands/day, ample for staging tests) or memory fallback.
- **Total Incremental Cost:** Approximately $25/month.

