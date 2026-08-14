-- Migration script for Marketing Campaigns & Lead Management System

-- 1. Create registration_forms table
CREATE TABLE IF NOT EXISTS public.registration_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  html_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id TEXT UNIQUE NOT NULL,
  campaign_name TEXT NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  training_mode TEXT NOT NULL DEFAULT 'online',
  registration_form_id UUID REFERENCES public.registration_forms(id) ON DELETE SET NULL,
  registration_form_html TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  telegram_enabled BOOLEAN DEFAULT true,
  teams_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Add campaign_id column to leads table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'campaign_id'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN campaign_id TEXT;
  END IF;
END $$;

-- 4. Enable RLS and define open policies for service role / admin
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read active campaigns" ON public.campaigns
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access campaigns" ON public.campaigns
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin full access registration_forms" ON public.registration_forms
  FOR ALL USING (true) WITH CHECK (true);
