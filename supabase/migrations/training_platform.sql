-- ============================================================
--  KVJ Analytics — Training Platform & Careers Page Migration
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. EXTEND PROFILES TABLE
alter table public.profiles 
  add column if not exists profession text check (profession in ('student', 'teacher', 'it', 'non_it')),
  add column if not exists full_name text,
  add column if not exists account_type text default 'individual' check (account_type in ('individual', 'corporate', 'college'));

-- 2. CREATE COURSE CATEGORIES TABLE
create table if not exists public.course_categories (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  display_order integer default 0,
  type text not null default 'self_serve' check (type in ('self_serve', 'inquiry')),
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on course_categories
alter table public.course_categories enable row level security;

-- Policies for course_categories
create policy "Public can read published course categories"
  on public.course_categories for select
  using (is_published = true);

create policy "Admins can manage course categories"
  on public.course_categories for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- Seed Initial Categories (CEO-approved)
insert into public.course_categories (slug, name, description, type, display_order, is_published)
values
  ('one-to-one', 'One-to-One', 'Personalized mentoring sessions tailored for custom growth plans.', 'inquiry', 1, true),
  ('corporate', 'Corporate', 'Dedicated team automation, reports, and analytical solutions training.', 'inquiry', 2, true),
  ('colleges', 'Colleges', 'Curriculum partnerships and evaluation systems for students and academies.', 'inquiry', 3, true),
  ('online-courses', 'Online Courses', 'Self-paced video courses for professional spreadsheet modeling and analytics.', 'self_serve', 4, true),
  ('internships', 'Internships', 'Hands-on project experience with placement-focused learning paths.', 'self_serve', 5, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  type = excluded.type,
  display_order = excluded.display_order;

-- 3. EXTEND COURSES TABLE
alter table public.courses
  add column if not exists category_id uuid references public.course_categories(id) on delete set null,
  add column if not exists banner_url text,
  add column if not exists duration text,
  add column if not exists fee_inr integer default 0,
  add column if not exists offer_price_inr integer,
  add column if not exists offer_label text,
  add column if not exists offer_expiry timestamp with time zone,
  add column if not exists is_locked boolean default false,
  add column if not exists is_published boolean default true;

-- 4. CREATE UNLOCK CODES TABLE
create table if not exists public.unlock_codes (
  id uuid default gen_random_uuid() primary key,
  code text unique not null check (length(code) = 6),
  course_id uuid references public.courses(id) on delete cascade,
  batch_label text not null,
  max_uses integer default 1,
  used_count integer default 0,
  expires_at timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on unlock_codes
alter table public.unlock_codes enable row level security;

-- Policies for unlock_codes
create policy "Admins can view and manage unlock codes"
  on public.unlock_codes for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- 5. CREATE CODE REDEMPTIONS TABLE
create table if not exists public.code_redemptions (
  id uuid default gen_random_uuid() primary key,
  code_id uuid references public.unlock_codes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  redeemed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- Enable RLS on code_redemptions
alter table public.code_redemptions enable row level security;

-- Policies for code_redemptions
create policy "Users can view their own redemptions"
  on public.code_redemptions for select
  using (auth.uid() = user_id);

create policy "Admins can manage all redemptions"
  on public.code_redemptions for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- 6. EXTEND ORDERS TABLE & foreign keys
alter table public.orders
  add column if not exists course_id uuid references public.courses(id) on delete set null;

-- 7. CREATE INTERNSHIPS TABLE
create table if not exists public.internships (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text,
  banner_url text,
  duration text,
  stipend text,
  is_published boolean default true,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on internships
alter table public.internships enable row level security;

-- Policies for internships
create policy "Public can view published internships"
  on public.internships for select
  using (is_published = true);

create policy "Admins can manage internships"
  on public.internships for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- 8. CREATE INTERNSHIP APPLICATIONS TABLE
create table if not exists public.internship_applications (
  id uuid default gen_random_uuid() primary key,
  internship_id uuid references public.internships(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text not null,
  resume_url text,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on internship_applications
alter table public.internship_applications enable row level security;

-- Policies for internship_applications
create policy "Public can submit applications"
  on public.internship_applications for insert
  with check (true);

create policy "Admins can view and manage applications"
  on public.internship_applications for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- 9. CREATE B2B INQUIRIES TABLE
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  category text not null check (category in ('one_to_one', 'corporate', 'college')),
  name text not null,
  email text not null,
  phone text not null,
  organization text,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on inquiries
alter table public.inquiries enable row level security;

-- Policies for inquiries
create policy "Public can submit inquiries"
  on public.inquiries for insert
  with check (true);

create policy "Admins can view and manage inquiries"
  on public.inquiries for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- 10. CREATE JOBS TABLE (Careers)
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  location text,
  type text not null check (type in ('full_time', 'part_time', 'internship')),
  department text,
  description text,
  is_published boolean default true,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on jobs
alter table public.jobs enable row level security;

-- Policies for jobs
create policy "Public can view published jobs"
  on public.jobs for select
  using (is_published = true);

create policy "Admins can manage jobs"
  on public.jobs for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- 11. CREATE JOB APPLICATIONS TABLE
create table if not exists public.job_applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text not null,
  resume_url text,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on job_applications
alter table public.job_applications enable row level security;

-- Policies for job_applications
create policy "Public can submit job applications"
  on public.job_applications for insert
  with check (true);

create policy "Admins can view and manage job applications"
  on public.job_applications for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- 12. EXTEND LESSONS TABLE
alter table public.lessons
  add column if not exists video_url text;
