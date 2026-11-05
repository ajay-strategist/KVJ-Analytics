# KVJ Analytics — Staging Database Migration Matrix & Reconciliation Blueprint

**Document:** `docs/staging/KVJ_STAGING_MIGRATION_MATRIX.md`  
**Milestone:** Phase 11.3 — Complete Migration Architecture & Reconciliation  
**Date:** November 5, 2026  
**Auditor / Principal Systems Architect:** Antigravity Engineering Lead & Systems Architect  
**Scope:** Complete Inventory and Reconciliation of All SQL Migrations in `supabase/migrations/`  
**Status:** **RECONCILED & VALIDATED — READY FOR STAGING APPLICATION**

---

## 1. Migration Architecture & Reconciled Order

To ensure an idempotent, zero-defect instantiation of the staging database, all migration files in the repository have been cataloged, reconciled against the local tracking table (`supabase_migrations.schema_migrations`), and mapped to an exact staging application order.

### Core Versioned Migrations (The Active Staging Sequence):

| Step | Migration File / Version | Dependency | Description & Core Purpose | Local Status | Staging Order | Prerequisites |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **1** | `20260101000000_baseline_schema.sql` | *None* (Foundation) | Creates all 31 core tables (`profiles`, `courses`, `modules`, `lessons`, `batches`, `mock_tests`, `questions`, `test_attempts`, `activity_results`, etc.), foundational RLS policies, core triggers (`handle_new_user`), and custom enum types. Consolidated from legacy migration fragments. | **Applied** (`20260101000000`) | **1st** | Fresh database with `uuid-ossp` and `pgcrypto` enabled. |
| **2** | `20260916_100_students_concurrency_fix.sql` | `20260101000000` | Adds `batch_students` table for classroom roster tracking, foreign keys to `batches` and `profiles`, status constraints (`INVITED`, `CLAIMED`, `JOINED`), and high-performance composite indexes on `(batch_id, email, phone)`. | **Applied** (`20260916`) | **2nd** | Tables `batches` and `profiles` must exist. |
| **3** | `20260917_concurrency_optimizations.sql` | `20260916` | Creates targeted performance indexes on `enrollments(user_id, course_slug, status)` and `test_attempts(test_id, user_id, created_at)` to eliminate table scans during 80-VU classroom surges. | **Applied** (`20260917`) | **3rd** | `enrollments` and `test_attempts` must exist. |
| **4** | `20261104_atomic_student_onboarding.sql` | `20260916` | Defines stored procedure `fn_claim_student_onboarding(p_user_id, p_target_email, p_clean_phone)` to atomically match, enroll, and activate invited batch students in a single sub-5ms transaction. | **Applied** (`20261104`) | **4th** | `batch_students`, `profiles`, and `enrollments` must exist. |
| **5** | `20261104120000_secure_assessment_questions.sql` | `20260101000000` | Hardens question bank security: revokes direct access to `questions` table, creates `student_questions_view` with `security_barrier = true`, and defines `fn_strip_question_answers()` to sanitize answer keys on the database tier. | **Applied** (`20261104120000`) | **5th** | `questions` table must exist. |

---

## 2. Legacy Migration Reconciliation & Consolidation Status

In addition to the 5 active versioned migrations above, the `supabase/migrations/` directory contains legacy SQL fragments from historical development phases. The table below documents how each legacy file is handled in the staging plan:

| Legacy SQL File | Purpose / Scope | Consolidation & Tracking Status | Action for Staging Deployment |
| :--- | :--- | :--- | :--- |
| `ADD_BATCH_STUDENTS.sql` | Initial definition of batch students table | **Superceded** by `20260916_100_students_concurrency_fix.sql` | Do NOT run separately. Covered by Step 2. |
| `ADD_ROSTER_FIELDS.sql` | Added phone and organization columns to roster | **Superceded** by `20260916_100_students_concurrency_fix.sql` | Do NOT run separately. Covered by Step 2. |
| `APPLY_ALL_MISSING.sql` | Monolithic catch-all script from early development | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run. Running will cause duplicate table errors. |
| `FIX_UNLOCK_CODES_COLUMNS.sql` | Added missing columns to `unlock_codes` | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `POWER_BI_VIEWS.sql` | Analytics views for corporate reporting | Optional reporting view | Can be applied post-staging as an analytics add-on. |
| `access_codes_migration.sql` | Unlock code redemptions and usage limits | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `add_hide_pricing.sql` | Added `hide_pricing` boolean to `courses` | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `add_instructions_to_mock_tests.sql`| Added `instructions` column to `mock_tests` | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `add_randomize_options.sql` | Added randomization flag to `mock_tests` | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `add_registration_fields.sql` | Added registration metadata to `profiles` | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `admin_platform_modules.sql` | Admin platform content schema | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `assessment_mcq_engine.sql` | MCQ question schema and scoring rules | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `blog_enhancements.sql` | Blog metadata and author relationships | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `blog_posts.sql` | Foundational blog posts table | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `fix_leads_organization_name.sql` | Column rename in `leads` | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `fix_test_attempts_schema.sql` | Foreign key fixes on `test_attempts` | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |
| `seed_blog_posts.sql` | Seed content for public blog | Optional seed | Omit from staging load testing. |
| `seed_data_analytics.sql` | Heavy demo dataset for analytics platform | Optional seed | Omit from staging load testing. |
| `training_platform.sql` | Foundational training LMS schema | **Consolidated** into `20260101000000_baseline_schema.sql` | Do NOT run separately. Covered by Step 1. |

---

## 3. Verification & Safety Guarantees

1. **Idempotency:** Every statement in the 5 core migrations uses `IF NOT EXISTS`, `OR REPLACE`, or conditional block guards.
2. **PostgreSQL Compatibility:** All 5 migrations have been syntax-validated and executed against local PostgreSQL 15 running in Colima.
3. **Migration History Tracking:** Staging application will record versions in `supabase_migrations.schema_migrations` matching local tracking:
   ```
   20260101000000
   20260916
   20260917
   20261104
   20261104120000
   ```
4. **Zero Production Risk:** No migrations will be executed against production during staging setup.

