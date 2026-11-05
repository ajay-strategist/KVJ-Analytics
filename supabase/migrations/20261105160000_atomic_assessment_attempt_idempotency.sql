-- ============================================================================
-- Migration: 20261105160000_atomic_assessment_attempt_idempotency.sql
-- Description: Enforces database-level atomic idempotency on test_attempts to
--              prevent duplicate attempt records during concurrent submission
--              retries or network race conditions.
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_test_attempts_user_slug_started'
  ) THEN
    ALTER TABLE public.test_attempts
      ADD CONSTRAINT uq_test_attempts_user_slug_started
      UNIQUE (user_id, test_slug, started_at);
  END IF;
END $$;

-- Additional supporting index for test_id queries
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_test_started
  ON public.test_attempts (user_id, test_id, started_at);

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
