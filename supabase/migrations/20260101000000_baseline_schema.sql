-- ============================================================================
-- KVJ Analytics — Foundational Baseline Schema
-- File: 20260101000000_baseline_schema.sql
-- Description: Consolidates foundational application schema, tables, triggers,
--              and base RLS policies required before incremental migrations run.
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (Extends Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  full_name text,
  email text,
  organization text,
  phone text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  profession text CHECK (profession IN ('student', 'teacher', 'it', 'non_it')),
  account_type text DEFAULT 'individual' CHECK (account_type IN ('individual', 'corporate', 'college')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view and manage all profiles." ON public.profiles;
CREATE POLICY "Admins can view and manage all profiles."
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
    )
  );

-- Profile trigger to create profile row automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Student'),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Student'),
    lower(trim(new.email)),
    'student'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.profiles.name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. COURSE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.course_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  type text NOT NULL DEFAULT 'self_serve' CHECK (type IN ('self_serve', 'inquiry')),
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published course categories" ON public.course_categories;
CREATE POLICY "Public can read published course categories"
  ON public.course_categories FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage course categories" ON public.course_categories;
CREATE POLICY "Admins can manage course categories"
  ON public.course_categories FOR ALL
  USING (true)
  WITH CHECK (true);


-- 3. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  segment text DEFAULT 'college',
  summary text,
  introduction text,
  thumbnail_url text,
  price_inr numeric DEFAULT 0,
  is_paid boolean DEFAULT false,
  display_order integer DEFAULT 0,
  category_id uuid REFERENCES public.course_categories(id) ON DELETE SET NULL,
  banner_url text,
  duration text,
  fee_inr integer DEFAULT 0,
  offer_price_inr integer,
  offer_label text,
  offer_expiry timestamp with time zone,
  is_locked boolean DEFAULT false,
  is_published boolean DEFAULT true,
  registration_form_html text,
  hide_pricing boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published courses" ON public.courses;
CREATE POLICY "Public can read published courses"
  ON public.courses FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (true)
  WITH CHECK (true);


-- 4. MODULES TABLE (Curriculum sections inside a course)
CREATE TABLE IF NOT EXISTS public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read modules" ON public.modules;
CREATE POLICY "Public can read modules"
  ON public.modules FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
CREATE POLICY "Admins can manage modules"
  ON public.modules FOR ALL
  USING (true)
  WITH CHECK (true);


-- 5. LESSONS TABLE (Materials / activities inside a module)
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'material' CHECK (kind IN ('material','activity')),
  content_html text DEFAULT '',
  content_type text,
  resource_url text,
  video_url text,
  is_preview boolean DEFAULT false,
  max_score numeric,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read lessons" ON public.lessons;
CREATE POLICY "Public can read lessons"
  ON public.lessons FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;
CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR ALL
  USING (true)
  WITH CHECK (true);


-- 6. MOCK TESTS TABLE
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  duration_mins integer DEFAULT 30,
  pass_mark numeric DEFAULT 0,
  display_order integer DEFAULT 0,
  module_id uuid REFERENCES public.modules(id) ON DELETE SET NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE SET NULL,
  attempts_allowed integer DEFAULT 1,
  negative_marking boolean DEFAULT false,
  randomize boolean DEFAULT false,
  publish_results boolean DEFAULT true,
  is_inline boolean DEFAULT false,
  randomize_options boolean DEFAULT false,
  instructions text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read mock_tests" ON public.mock_tests;
CREATE POLICY "Public can read mock_tests"
  ON public.mock_tests FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage mock_tests" ON public.mock_tests;
CREATE POLICY "Admins can manage mock_tests"
  ON public.mock_tests FOR ALL
  USING (true)
  WITH CHECK (true);


-- 7. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES public.mock_tests(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL DEFAULT 'single',
  stem text,
  marks numeric DEFAULT 1,
  config jsonb NOT NULL DEFAULT '{}',
  display_order integer DEFAULT 0,
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read questions" ON public.questions;
CREATE POLICY "Public can read questions"
  ON public.questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage questions" ON public.questions;
CREATE POLICY "Admins can manage questions"
  ON public.questions FOR ALL
  USING (true)
  WITH CHECK (true);


-- 8. BATCHES TABLE (College Code Flow)
CREATE TABLE IF NOT EXISTS public.batches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  college_name text NOT NULL,
  course_slug text NOT NULL,
  totp_secret text NOT NULL,
  valid_from timestamp with time zone NOT NULL,
  valid_to timestamp with time zone NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage batches." ON public.batches;
CREATE POLICY "Admins can manage batches."
  ON public.batches FOR ALL
  USING (true)
  WITH CHECK (true);


-- 9. BATCH STUDENTS TABLE (Classroom Roster)
CREATE TABLE IF NOT EXISTS public.batch_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  name text,
  email text,
  phone text,
  status text NOT NULL DEFAULT 'INVITED',
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_id text,
  department text,
  added_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT batch_students_identity_chk CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS batch_students_batch_email_idx
  ON public.batch_students(batch_id, email) WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS batch_students_batch_phone_idx
  ON public.batch_students(batch_id, phone) WHERE phone IS NOT NULL;

CREATE INDEX IF NOT EXISTS batch_students_batch_id_idx
  ON public.batch_students(batch_id);

ALTER TABLE public.batch_students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage batch students" ON public.batch_students;
CREATE POLICY "Admins can manage batch students"
  ON public.batch_students FOR ALL
  USING (true)
  WITH CHECK (true);


-- 10. ENROLLMENTS TABLE (Course Access)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_slug text NOT NULL,
  enrollment_method text NOT NULL CHECK (enrollment_method IN ('paid', 'college_code')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'completed')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, course_slug)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own enrollments." ON public.enrollments;
CREATE POLICY "Users can view their own enrollments."
  ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all enrollments." ON public.enrollments;
CREATE POLICY "Admins can manage all enrollments."
  ON public.enrollments FOR ALL
  USING (true)
  WITH CHECK (true);


-- 11. ORDERS TABLE (Payments)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_slug text NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  amount numeric(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  razorpay_order_id text UNIQUE NOT NULL,
  razorpay_payment_id text,
  razorpay_signature text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
CREATE POLICY "Users can view their own orders."
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all orders." ON public.orders;
CREATE POLICY "Admins can manage all orders."
  ON public.orders FOR ALL
  USING (true)
  WITH CHECK (true);


-- 12. TEST ATTEMPTS TABLE (Mock Test Submissions)
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  test_slug text NOT NULL,
  test_id text,
  answers jsonb NOT NULL,
  score numeric(5, 2) NOT NULL,
  max_score numeric(5, 2),
  score_percent numeric(5, 2),
  passed boolean NOT NULL,
  per_question jsonb,
  started_at timestamp with time zone NOT NULL,
  submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own test attempts." ON public.test_attempts;
CREATE POLICY "Users can view their own test attempts."
  ON public.test_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own test attempts." ON public.test_attempts;
CREATE POLICY "Users can create their own test attempts."
  ON public.test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all test attempts." ON public.test_attempts;
CREATE POLICY "Admins can view all test attempts."
  ON public.test_attempts FOR SELECT
  USING (true);


-- 13. ACTIVITY RESULTS TABLE (Interactive Simulation Scores)
CREATE TABLE IF NOT EXISTS public.activity_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  course_slug text,
  score numeric,
  max_score numeric,
  score_percent numeric,
  passed boolean DEFAULT false,
  submitted_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.activity_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students read own results" ON public.activity_results;
CREATE POLICY "Students read own results"
  ON public.activity_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students insert own results" ON public.activity_results;
CREATE POLICY "Students insert own results"
  ON public.activity_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students update own results" ON public.activity_results;
CREATE POLICY "Students update own results"
  ON public.activity_results FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins read all results" ON public.activity_results;
CREATE POLICY "Admins read all results"
  ON public.activity_results FOR SELECT
  USING (true);


-- 14. UNLOCK CODES & REDEMPTIONS (Vouchers)
CREATE TABLE IF NOT EXISTS public.unlock_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL CHECK (length(code) = 6),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  batch_label text NOT NULL,
  max_uses integer DEFAULT 1,
  used_count integer DEFAULT 0,
  expires_at timestamp with time zone,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  training_type text,
  college_id uuid,
  organization_id uuid,
  seats integer,
  seats_used integer DEFAULT 0,
  valid_from timestamp with time zone,
  valid_until timestamp with time zone,
  coordinator_name text,
  coordinator_email text,
  allowed_email_domain text,
  notes text,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.unlock_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view and manage unlock codes" ON public.unlock_codes;
CREATE POLICY "Admins can view and manage unlock codes"
  ON public.unlock_codes FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.code_redemptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id uuid REFERENCES public.unlock_codes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  redeemed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.code_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own redemptions" ON public.code_redemptions;
CREATE POLICY "Users can view their own redemptions"
  ON public.code_redemptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all redemptions" ON public.code_redemptions;
CREATE POLICY "Admins can manage all redemptions"
  ON public.code_redemptions FOR ALL
  USING (true)
  WITH CHECK (true);


-- 15. LEADS TABLE (Contact & Inquiries)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  organization text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service_interest text NOT NULL,
  message text NOT NULL,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  whatsapp_number text,
  training_mode text,
  course_id uuid,
  college_name text,
  current_education text,
  current_profession text,
  location text,
  preferred_start_date text,
  utm_term text,
  utm_content text,
  landing_page text,
  referrer text,
  notes text,
  rating text,
  organization_name text,
  course_slug text,
  campaign_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Server-role only insert leads." ON public.leads;
CREATE POLICY "Server-role only insert leads."
  ON public.leads FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage leads." ON public.leads;
CREATE POLICY "Admins can manage leads."
  ON public.leads FOR ALL
  USING (true)
  WITH CHECK (true);


-- 16. WEBSITE CMS TABLES (Clients, Testimonials, Team, Case Studies, Page Content, Blog)
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  industry text,
  logo_url text,
  website_url text,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active clients." ON public.clients;
CREATE POLICY "Public can read active clients."
  ON public.clients FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage clients." ON public.clients;
CREATE POLICY "Admins can manage clients."
  ON public.clients FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text,
  organization text,
  quote text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active testimonials." ON public.testimonials;
CREATE POLICY "Public can read active testimonials."
  ON public.testimonials FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage testimonials." ON public.testimonials;
CREATE POLICY "Admins can manage testimonials."
  ON public.testimonials FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.team (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  photo_url text,
  linkedin_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active team members." ON public.team;
CREATE POLICY "Public can read active team members."
  ON public.team FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage team." ON public.team;
CREATE POLICY "Admins can manage team."
  ON public.team FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.case_studies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  client_name text,
  industry text,
  challenge text,
  solution text,
  result text,
  cover_image_url text,
  tags text[],
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active case studies." ON public.case_studies;
CREATE POLICY "Public can read active case studies."
  ON public.case_studies FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage case studies." ON public.case_studies;
CREATE POLICY "Admins can manage case studies."
  ON public.case_studies FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.page_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read page content." ON public.page_content;
CREATE POLICY "Public can read page content."
  ON public.page_content FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage page content." ON public.page_content;
CREATE POLICY "Admins can manage page content."
  ON public.page_content FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  body_html text,
  cover_url text,
  author_name text DEFAULT 'KVJ Analytics',
  author_slug text DEFAULT 'kvj-analytics',
  author_bio text,
  category_title text DEFAULT 'Insights',
  category_slug text DEFAULT 'insights',
  published_at timestamp with time zone DEFAULT now(),
  featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  display_order integer DEFAULT 1,
  status text DEFAULT 'published',
  tags text[] DEFAULT '{}',
  featured_flags jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published blog posts" ON public.blog_posts;
CREATE POLICY "Public read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (true)
  WITH CHECK (true);


-- 17. CAREERS & B2B TABLES (Internships, Jobs, Inquiries)
CREATE TABLE IF NOT EXISTS public.internships (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  banner_url text,
  duration text,
  stipend text,
  is_published boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published internships" ON public.internships;
CREATE POLICY "Public can view published internships"
  ON public.internships FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage internships" ON public.internships;
CREATE POLICY "Admins can manage internships"
  ON public.internships FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.internship_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  internship_id uuid REFERENCES public.internships(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  resume_url text,
  message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit applications" ON public.internship_applications;
CREATE POLICY "Public can submit applications"
  ON public.internship_applications FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage applications" ON public.internship_applications;
CREATE POLICY "Admins can view and manage applications"
  ON public.internship_applications FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  organization text,
  message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage inquiries" ON public.inquiries;
CREATE POLICY "Admins can view and manage inquiries"
  ON public.inquiries FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  location text,
  type text NOT NULL,
  department text,
  description text,
  is_published boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published jobs" ON public.jobs;
CREATE POLICY "Public can view published jobs"
  ON public.jobs FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admins can manage jobs" ON public.jobs;
CREATE POLICY "Admins can manage jobs"
  ON public.jobs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  resume_url text,
  message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit job applications" ON public.job_applications;
CREATE POLICY "Public can submit job applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage job applications" ON public.job_applications;
CREATE POLICY "Admins can view and manage job applications"
  ON public.job_applications FOR ALL
  USING (true)
  WITH CHECK (true);


-- 18. ADMIN PLATFORM MODULES (Media, Admin Users, Certificates, Audit Logs)
CREATE TABLE IF NOT EXISTS public.media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL DEFAULT 'image',
  mime_type text,
  size_bytes bigint DEFAULT 0,
  folder text DEFAULT 'uploads',
  tags text[] DEFAULT '{}',
  uploaded_by text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage media_library" ON public.media_library;
CREATE POLICY "Admins can manage media_library"
  ON public.media_library FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  status text NOT NULL DEFAULT 'active',
  permissions jsonb NOT NULL DEFAULT '{}',
  last_active_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
CREATE POLICY "Admins can manage admin_users"
  ON public.admin_users FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_slug text NOT NULL,
  certificate_number text UNIQUE NOT NULL,
  verify_code text UNIQUE NOT NULL,
  issued_at timestamp with time zone DEFAULT now(),
  status text NOT NULL DEFAULT 'issued',
  pdf_url text
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own certificates" ON public.certificates;
CREATE POLICY "Users can view their own certificates"
  ON public.certificates FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;
CREATE POLICY "Admins can manage certificates"
  ON public.certificates FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text NOT NULL DEFAULT 'admin',
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  meta jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage audit_logs" ON public.audit_logs;
CREATE POLICY "Admins can manage audit_logs"
  ON public.audit_logs FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs (created_at DESC);

-- Seed Initial Course Categories (CEO-approved standard taxonomy)
INSERT INTO public.course_categories (slug, name, description, type, display_order, is_published)
VALUES
  ('one-to-one', 'One-to-One', 'Personalized mentoring sessions tailored for custom growth plans.', 'inquiry', 1, true),
  ('corporate', 'Corporate', 'Dedicated team automation, reports, and analytical solutions training.', 'inquiry', 2, true),
  ('colleges', 'Colleges', 'Curriculum partnerships and evaluation systems for students and academies.', 'inquiry', 3, true),
  ('online-courses', 'Online Courses', 'Self-paced video courses for professional spreadsheet modeling and analytics.', 'self_serve', 4, true),
  ('internships', 'Internships', 'Hands-on project experience with placement-focused learning paths.', 'self_serve', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Seed admin settings page content placeholder
INSERT INTO public.page_content (slug, data) VALUES ('admin-settings', '{}') ON CONFLICT (slug) DO NOTHING;
