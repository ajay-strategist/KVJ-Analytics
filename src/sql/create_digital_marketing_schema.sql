-- Migration script for Digital Marketing & SEO Management System

-- 1. Create site_seo_settings table
CREATE TABLE IF NOT EXISTS public.site_seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title_default TEXT NOT NULL DEFAULT 'KVJ Analytics | Power BI, Excel & Report Automation Training & Consulting',
  title_template TEXT NOT NULL DEFAULT '%s | KVJ Analytics',
  meta_description_default TEXT NOT NULL DEFAULT 'KVJ Analytics delivers Power BI dashboards, Excel & report automation, and data analytics consulting — plus corporate, college & individual training.',
  default_og_image_url TEXT DEFAULT '/og-image.png',
  twitter_handle TEXT DEFAULT '@kvjanalytics',
  google_analytics_id TEXT,
  google_tag_manager_id TEXT,
  google_site_verification TEXT,
  bing_site_verification TEXT,
  custom_robots_txt TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create page_seo table for route-level overrides
CREATE TABLE IF NOT EXISTS public.page_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_path TEXT UNIQUE NOT NULL,
  seo_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  no_index BOOLEAN DEFAULT false,
  no_follow BOOLEAN DEFAULT false,
  structured_data_type TEXT DEFAULT 'WebPage',
  custom_schema_json JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index route_path for performance
CREATE INDEX IF NOT EXISTS idx_page_seo_route_path ON public.page_seo(route_path);

-- 3. Create seo_redirects table for 301/302 URL redirects
CREATE TABLE IF NOT EXISTS public.seo_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path TEXT UNIQUE NOT NULL,
  target_path TEXT NOT NULL,
  redirect_type INTEGER NOT NULL DEFAULT 301, -- 301 (Permanent) or 302 (Temporary)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index source_path and is_active
CREATE INDEX IF NOT EXISTS idx_seo_redirects_active_source ON public.seo_redirects(source_path, is_active);

-- 4. Enable RLS policies
ALTER TABLE public.site_seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_redirects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active SEO settings and redirects
CREATE POLICY "Allow public read site_seo_settings" ON public.site_seo_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read page_seo" ON public.page_seo FOR SELECT USING (true);
CREATE POLICY "Allow public read seo_redirects" ON public.seo_redirects FOR SELECT USING (true);

-- Allow admin full access
CREATE POLICY "Allow admin full access site_seo_settings" ON public.site_seo_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access page_seo" ON public.page_seo FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access seo_redirects" ON public.seo_redirects FOR ALL USING (true) WITH CHECK (true);

-- 5. Insert default global row if missing
INSERT INTO public.site_seo_settings (
  id,
  site_title_default,
  title_template,
  meta_description_default,
  default_og_image_url
)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  'KVJ Analytics | Power BI, Excel & Report Automation Training & Consulting',
  '%s | KVJ Analytics',
  'KVJ Analytics delivers Power BI dashboards, Excel & report automation, and data analytics consulting — plus corporate, college & individual training.',
  '/og-image.png'
WHERE NOT EXISTS (SELECT 1 FROM public.site_seo_settings);
