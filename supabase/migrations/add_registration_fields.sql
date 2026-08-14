-- Idempotent Supabase migration script to extend the public.leads table
-- Run this in the Supabase SQL Editor.

-- 1. Extend public.leads table with registration columns
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS whatsapp_number text,
  ADD COLUMN IF NOT EXISTS training_mode text,
  ADD COLUMN IF NOT EXISTS course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS college_name text,
  ADD COLUMN IF NOT EXISTS current_education text,
  ADD COLUMN IF NOT EXISTS current_profession text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS preferred_start_date date,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS rating integer DEFAULT 3;

-- 2. Drop existing status check constraint and recreate it with the expanded list
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check CHECK (status IN (
  'draft', 'new', 'contacted', 'interested', 'follow_up', 'qualified', 'converted', 'rejected', 'closed'
));

-- 3. Add CHECK constraint on rating to limit to 1-5 stars
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_rating_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_rating_check CHECK (rating BETWEEN 1 AND 5);

-- 4. Create indexes for fast CRM searches and sorting
CREATE INDEX IF NOT EXISTS idx_leads_course_id ON public.leads(course_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
