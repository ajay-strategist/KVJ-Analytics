-- ============================================================================
-- Migration: 20260917_concurrency_optimizations.sql
-- Purpose: Accelerate high-concurrency queries identified in diagnostic
-- Safety: Preserves all RLS policies, tables, and existing constraints.
-- ============================================================================

-- 1. Enable pg_trgm extension for substring index acceleration
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Index for phone wildcard substring lookups: `phone.ilike.%${last10}%`
-- Query: /api/auth/login, /api/auth/confirm-user, /api/auth/reset-password
-- Existing problem: B-Tree index on `phone` cannot be used with leading wildcards `%...%`, causing full sequential table scans.
-- Benefit: GIN trigram index converts sequential scan to index scan. Negligible write overhead on profile updates.
CREATE INDEX IF NOT EXISTS idx_profiles_phone_trgm 
  ON public.profiles USING gin (phone gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_batch_students_phone_trgm 
  ON public.batch_students USING gin (phone gin_trgm_ops);

-- 3. Composite index for consolidated student enrollment lookups
-- Query: `SELECT course_slug FROM enrollments WHERE user_id = $1 AND status = 'active'`
-- Benefit: Enables index-only scans for enrollment verification across test & lesson APIs.
CREATE INDEX IF NOT EXISTS idx_enrollments_user_status_slug 
  ON public.enrollments (user_id, status, course_slug);

-- 4. Composite index for course activity progress loading
-- Query: `SELECT lesson_id, passed FROM activity_results WHERE user_id = $1 AND course_slug = $2`
-- Benefit: Speeds up ContentPlayer initialization when fetching completed lesson set for 100 concurrent students.
CREATE INDEX IF NOT EXISTS idx_activity_results_user_slug_lesson 
  ON public.activity_results (user_id, course_slug, lesson_id);

-- 5. Index for unlock code seat allocation and validation
-- Query: `SELECT * FROM unlock_codes WHERE code = $1 AND is_active = true`
CREATE INDEX IF NOT EXISTS idx_unlock_codes_active_code 
  ON public.unlock_codes (code, is_active);
