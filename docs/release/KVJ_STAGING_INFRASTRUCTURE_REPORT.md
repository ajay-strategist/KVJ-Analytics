# KVJ Analytics Website & LMS — Isolated Staging Infrastructure & Environment Design Report

**Date:** November 5, 2026  
**Auditor / DevOps Architect:** Principal Systems Architect & Application Security Engineer  
**Scope:** Staging Environment Architecture, Isolation Verification, and Provisioning Specification  
**Current Status:** **SPECIFICATION COMPLETE — PROVISIONING BLOCKED PENDING OWNER ACTION**

---

## 1. Executive Summary & Purpose

The KVJ Analytics Website & LMS remediation work across Phases P0, P1, and P2 has resolved all 21 identified security, concurrency, and architecture defects. However, the existing development environment currently connects to `bdwwgipbrnkgihfjihxz.supabase.co`, which hosts **661 live student enrollments** and active production data.

To satisfy the **Strict Safety Policy** (zero production migrations, zero synthetic production records, zero high-volume load test traffic against production data), this report specifies an **isolated Staging environment**. This ensures that schema migrations, end-to-end LMS regression testing, and k6 80-VU load tests execute without exposing or modifying live student records.

---

## 2. Staging Infrastructure Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION ENVIRONMENT                          │
│                                                                        │
│  Vercel Production Domain: https://kvjanalytics.in                     │
│  Supabase Production:     bdwwgipbrnkgihfjihxz.supabase.co (661 Live) │
│  Storage:                 Production Buckets (Real User Documents)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         STRICT AIR-GAP ISOLATION
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                         STAGING ENVIRONMENT                            │
│                                                                        │
│  Vercel Staging Domain:    https://staging.kvjanalytics.in             │
│  Supabase Staging:        kvj-staging-[id].supabase.co (Isolated)      │
│  Storage:                 staging-materials, staging-assets            │
│  Student Accounts:        100 Dedicated Synthetic Users Only           │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Supabase Staging Project Specification
- **Project Tier:** Free or Standard Supabase Project (isolated from production).
- **Database Name:** `postgres` on PostgreSQL 15+.
- **Authentication Settings:**
  - Email signup enabled.
  - Email confirmation disabled (for automated testing speed).
  - JWT Secret: Generated independently from production.
- **Dedicated Service Role & Anon Keys:** Separate cryptographic keys never shared with production.
- **Storage Buckets:**
  - `staging-materials` (Public read for course assets).
  - `staging-uploads` (Restricted write for admin file uploads).

### 2.2 Synthetic Data & Seed Strategy (Zero Production PII)
The staging database must contain exclusively synthetic data:
1. **Student Test Accounts:** 100 pre-generated accounts (`user1@kvjanalytics.test` to `user100@kvjanalytics.test`, password `UserTest@2026!`).
2. **Synthetic Batches:** `STG-BATCH-2026-PBI` (Power BI Staging), `STG-BATCH-2026-PY` (Python Staging).
3. **Synthetic Courses:**
   - `power-bi` (Power BI Mastery - 4 Modules, 8 Lessons, 1 Mock Test).
   - `python` (Python for Data Science - 4 Modules, 8 Lessons, 1 Mock Test).
4. **Synthetic Question Bank:** 20 test questions covering single-choice, multiple-choice, drag-and-drop, fill-in-the-blank, and code-evaluation question types.
5. **PII Protection Guarantee:** No production student emails, phone numbers, or assessment submissions will be copied or imported into Staging.

---

## 3. Environment Variable Separation Matrix

| Variable Name | Production Scope | Staging Scope | Isolation Mechanism |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bdwwgipbrnkgihfjihxz.supabase.co` | `https://kvj-staging-[id].supabase.co` | Unique project domain |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production Anon Key | Staging Anon Key | Distinct JWT signing key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production Service Key | Staging Service Key | Distinct service_role secret |
| `SUPABASE_JWT_SECRET` | Production JWT Secret | Staging JWT Secret | Independent cryptographic secret |
| `ADMIN_USERNAME` | Production Admin Username | `staging-admin` | Role separation |
| `ADMIN_PASSWORD` | Production Admin Password | `StagingAdmin@2026!` | Dedicated staging password |
| `ADMIN_SESSION_SECRET` | Production Cookie Secret | Staging Cookie Secret | Distinct session signing secret |
| `UPSTASH_REDIS_REST_URL` | Production Redis Cluster | Staging Redis DB (or In-Memory LRU) | Cache namespace isolation |

---

## 4. Owner Provisioning Checklist (Exact Steps)

Because creating new hosted cloud resources or modifying project billing requires owner account privileges, the project owner should execute the following steps:

### Step 1: Create Supabase Staging Project
1. Log in to [Supabase Management Console](https://supabase.com/dashboard).
2. Click **New Project** → Select Organization: `KVJ Analytics`.
3. Set **Name:** `kvj-analytics-staging`.
4. Set **Database Password:** Generate a secure 24-character password and store in 1Password.
5. Select Region: `ap-south-1` (Mumbai) or closest to user base.
6. Under **Project Settings** → **API**, copy:
   - Project URL (`https://[staging-ref].supabase.co`)
   - `anon` `public` key
   - `service_role` `secret` key
7. Under **Project Settings** → **API** → **JWT Settings**, copy:
   - `JWT Secret`

### Step 2: Configure Vercel Preview / Staging Environment
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Open Project: `kvj-analytics`.
3. Go to **Settings** → **Environment Variables**.
4. Add the staging environment variables, checking **Preview** and **Development** scopes only:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://[staging-ref].supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `[staging-anon-key]`
   - `SUPABASE_SERVICE_ROLE_KEY` = `[staging-service-role-key]`
   - `SUPABASE_JWT_SECRET` = `[staging-jwt-secret]`
   - `ADMIN_USERNAME` = `staging-admin`
   - `ADMIN_PASSWORD` = `StagingAdmin@2026!`

### Step 3: Notify Engineering Team
Once Step 1 and Step 2 are completed, provide the staging project reference to engineering to proceed with automated schema deployment, migration execution, and k6 load testing.

