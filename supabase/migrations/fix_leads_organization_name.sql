-- ============================================================
-- KVJ Analytics — Fix: Add missing organization_name column to leads
-- Also adds organization column (alias) and ensures all registration fields exist
-- Safe to run multiple times (all IF NOT EXISTS)
-- Paste into Supabase SQL Editor and Run.
-- ============================================================

-- 1. Add organization_name column if not present (legacy compatibility column)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS organization_name text;

-- 2. Add organization column if not present (primary column used in API)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS organization text;

-- 3. Backfill organization_name from organization where null
UPDATE public.leads
SET organization_name = organization
WHERE organization_name IS NULL AND organization IS NOT NULL;

-- 4. Add course_slug text column (for text-based course IDs like 'artificial-intelligence')
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS course_slug text;

-- Done
SELECT 'Migration complete: organization_name column added to leads table.' AS status;
