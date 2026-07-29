-- ============================================================================
-- FIX: "Could not find the 'allowed_email_domain' column of 'unlock_codes'"
-- Adds every column the Access-Codes admin form / APIs expect to unlock_codes.
-- Idempotent — existing columns are skipped. Safe to run more than once.
-- Run in Supabase → SQL Editor on the KVJ database.
-- ============================================================================

-- Batch / targeting
ALTER TABLE public.unlock_codes DROP CONSTRAINT IF EXISTS unlock_codes_code_check;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS training_type       text;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS batch_label         text;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS course_id           uuid;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS college_id          uuid;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS organization_id     uuid;

-- Seats (new) + legacy usage counters
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS seats               integer;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS seats_used          integer DEFAULT 0;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS max_uses            integer DEFAULT 1;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS used_count          integer DEFAULT 0;

-- Validity window (new + legacy)
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS valid_from          timestamptz;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS valid_until         timestamptz;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS expires_at          timestamptz;

-- Coordinator + domain restriction
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS coordinator_name    text;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS coordinator_email   text;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS allowed_email_domain text;

-- Meta
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS notes               text;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS is_active           boolean DEFAULT true;
ALTER TABLE public.unlock_codes ADD COLUMN IF NOT EXISTS status              text DEFAULT 'ACTIVE';

-- Foreign key so the admin list's `courses(title)` embed keeps working.
-- Only added if a courses table exists and the FK isn't already present.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'courses')
     AND NOT EXISTS (
       SELECT 1 FROM information_schema.table_constraints
       WHERE table_schema = 'public'
         AND table_name = 'unlock_codes'
         AND constraint_name = 'unlock_codes_course_id_fkey'
     )
  THEN
    ALTER TABLE public.unlock_codes
      ADD CONSTRAINT unlock_codes_course_id_fkey
      FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Reload PostgREST's schema cache so the new columns are visible immediately.
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- FIX: "Failed to record code usage"
-- The new enrollment flow references `enrollment_id` in code_redemptions.
-- ============================================================================
ALTER TABLE public.code_redemptions ADD COLUMN IF NOT EXISTS enrollment_id uuid REFERENCES public.enrollments(id) ON DELETE CASCADE;
ALTER TABLE public.code_redemptions ADD COLUMN IF NOT EXISTS status text DEFAULT 'REDEEMED';

-- Notify again just in case
NOTIFY pgrst, 'reload schema';
