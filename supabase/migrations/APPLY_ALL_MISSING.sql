-- ============================================================
--  KVJ Analytics — APPLY ALL MISSING TABLES  (run this ONCE)
--  Your database has the base schema but is missing the tables
--  from three later migrations. This single file creates everything
--  that's missing. It is fully idempotent (safe to run more than once):
--  every table uses "if not exists", every column "add ... if not exists",
--  and every policy is dropped-if-exists before being recreated.
--
--  HOW TO RUN: Supabase dashboard → SQL Editor → New query → paste all
--  of this → Run. Then reload the admin panel.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── TEAM (site "About/Team" members) ───────────────────────────────
create table if not exists public.team (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  bio text,
  photo_url text,
  linkedin_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.team enable row level security;
drop policy if exists "Public can read active team members." on public.team;
create policy "Public can read active team members." on public.team for select using (is_active = true);
drop policy if exists "Admins can manage team." on public.team;
create policy "Admins can manage team." on public.team for all using (true) with check (true);

-- ── BLOG POSTS ─────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  body_html text,
  cover_url text,
  author_name text default 'KVJ Analytics',
  author_slug text default 'kvj-analytics',
  author_bio text,
  category_title text default 'Insights',
  category_slug text default 'insights',
  published_at timestamptz default now(),
  featured boolean default false,
  is_published boolean default true,
  display_order int default 1,
  created_at timestamptz default now()
);
create index if not exists blog_posts_published_idx on public.blog_posts (is_published, published_at desc);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
alter table public.blog_posts enable row level security;
drop policy if exists "Public read published blog posts" on public.blog_posts;
create policy "Public read published blog posts" on public.blog_posts for select using (is_published = true);

-- ── PROFILES extra columns ─────────────────────────────────────────
alter table public.profiles
  add column if not exists profession text,
  add column if not exists full_name text,
  add column if not exists account_type text default 'individual';

-- ── COURSE CATEGORIES ──────────────────────────────────────────────
create table if not exists public.course_categories (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  display_order integer default 0,
  type text not null default 'self_serve',
  is_published boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.course_categories enable row level security;
drop policy if exists "Public can read published course categories" on public.course_categories;
create policy "Public can read published course categories" on public.course_categories for select using (is_published = true);
drop policy if exists "Admins can manage course categories" on public.course_categories;
create policy "Admins can manage course categories" on public.course_categories for all using (true) with check (true);
insert into public.course_categories (slug, name, description, type, display_order, is_published) values
  ('one-to-one', 'One-to-One', 'Personalized mentoring sessions tailored for custom growth plans.', 'inquiry', 1, true),
  ('corporate', 'Corporate', 'Dedicated team automation, reports, and analytical solutions training.', 'inquiry', 2, true),
  ('colleges', 'Colleges', 'Curriculum partnerships and evaluation systems for students and academies.', 'inquiry', 3, true),
  ('online-courses', 'Online Courses', 'Self-paced video courses for professional spreadsheet modeling and analytics.', 'self_serve', 4, true),
  ('internships', 'Internships', 'Hands-on project experience with placement-focused learning paths.', 'self_serve', 5, true)
on conflict (slug) do nothing;

-- ── COURSES extra columns (keeps existing segment/price_inr working) ─
alter table public.courses
  add column if not exists category_id uuid references public.course_categories(id) on delete set null,
  add column if not exists banner_url text,
  add column if not exists duration text,
  add column if not exists fee_inr integer default 0,
  add column if not exists offer_price_inr integer,
  add column if not exists offer_label text,
  add column if not exists offer_expiry timestamptz,
  add column if not exists is_locked boolean default false,
  add column if not exists is_published boolean default true;

-- ── UNLOCK CODES (vouchers) ────────────────────────────────────────
create table if not exists public.unlock_codes (
  id uuid default gen_random_uuid() primary key,
  code text unique not null check (length(code) = 6),
  course_id uuid references public.courses(id) on delete cascade,
  batch_label text not null,
  max_uses integer default 1,
  used_count integer default 0,
  expires_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.unlock_codes enable row level security;
drop policy if exists "Admins can view and manage unlock codes" on public.unlock_codes;
create policy "Admins can view and manage unlock codes" on public.unlock_codes for all using (true) with check (true);

-- ── CODE REDEMPTIONS ───────────────────────────────────────────────
create table if not exists public.code_redemptions (
  id uuid default gen_random_uuid() primary key,
  code_id uuid references public.unlock_codes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  redeemed_at timestamptz default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);
alter table public.code_redemptions enable row level security;
drop policy if exists "Users can view their own redemptions" on public.code_redemptions;
create policy "Users can view their own redemptions" on public.code_redemptions for select using (auth.uid() = user_id);
drop policy if exists "Admins can manage all redemptions" on public.code_redemptions;
create policy "Admins can manage all redemptions" on public.code_redemptions for all using (true) with check (true);

-- ── ORDERS extra column ────────────────────────────────────────────
alter table public.orders add column if not exists course_id uuid references public.courses(id) on delete set null;

-- ── INTERNSHIPS ────────────────────────────────────────────────────
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
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.internships enable row level security;
drop policy if exists "Public can view published internships" on public.internships;
create policy "Public can view published internships" on public.internships for select using (is_published = true);
drop policy if exists "Admins can manage internships" on public.internships;
create policy "Admins can manage internships" on public.internships for all using (true) with check (true);

create table if not exists public.internship_applications (
  id uuid default gen_random_uuid() primary key,
  internship_id uuid references public.internships(id) on delete cascade not null,
  name text not null, email text not null, phone text not null,
  resume_url text, message text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.internship_applications enable row level security;
drop policy if exists "Public can submit applications" on public.internship_applications;
create policy "Public can submit applications" on public.internship_applications for insert with check (true);
drop policy if exists "Admins can view and manage applications" on public.internship_applications;
create policy "Admins can view and manage applications" on public.internship_applications for all using (true) with check (true);

-- ── B2B INQUIRIES ──────────────────────────────────────────────────
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  name text not null, email text not null, phone text not null,
  organization text, message text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.inquiries enable row level security;
drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries" on public.inquiries for insert with check (true);
drop policy if exists "Admins can view and manage inquiries" on public.inquiries;
create policy "Admins can view and manage inquiries" on public.inquiries for all using (true) with check (true);

-- ── JOBS (careers) ─────────────────────────────────────────────────
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  location text,
  type text not null,
  department text,
  description text,
  is_published boolean default true,
  display_order integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.jobs enable row level security;
drop policy if exists "Public can view published jobs" on public.jobs;
create policy "Public can view published jobs" on public.jobs for select using (is_published = true);
drop policy if exists "Admins can manage jobs" on public.jobs;
create policy "Admins can manage jobs" on public.jobs for all using (true) with check (true);

create table if not exists public.job_applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  name text not null, email text not null, phone text not null,
  resume_url text, message text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
alter table public.job_applications enable row level security;
drop policy if exists "Public can submit job applications" on public.job_applications;
create policy "Public can submit job applications" on public.job_applications for insert with check (true);
drop policy if exists "Admins can view and manage job applications" on public.job_applications;
create policy "Admins can view and manage job applications" on public.job_applications for all using (true) with check (true);

-- ── LESSONS extra column (video lessons) ───────────────────────────
alter table public.lessons add column if not exists video_url text;

-- ── ADMIN PLATFORM MODULES (media / users / certificates / audit) ──
create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  name text not null, url text not null,
  type text not null default 'image',
  mime_type text, size_bytes bigint default 0,
  folder text default 'uploads', tags text[] default '{}',
  uploaded_by text, created_at timestamptz default now()
);
alter table public.media_library enable row level security;
drop policy if exists "Admins can manage media_library" on public.media_library;
create policy "Admins can manage media_library" on public.media_library for all using (true) with check (true);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text unique not null,
  role text not null default 'admin',
  status text not null default 'active',
  permissions jsonb not null default '{}',
  last_active_at timestamptz, created_at timestamptz default now()
);
alter table public.admin_users enable row level security;
drop policy if exists "Admins can manage admin_users" on public.admin_users;
create policy "Admins can manage admin_users" on public.admin_users for all using (true) with check (true);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_slug text not null,
  certificate_number text unique not null,
  verify_code text unique not null,
  issued_at timestamptz default now(),
  status text not null default 'issued',
  pdf_url text
);
alter table public.certificates enable row level security;
drop policy if exists "Users can view their own certificates" on public.certificates;
create policy "Users can view their own certificates" on public.certificates for select using (auth.uid() = user_id);
drop policy if exists "Admins can manage certificates" on public.certificates;
create policy "Admins can manage certificates" on public.certificates for all using (true) with check (true);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null default 'admin',
  action text not null,
  entity_type text not null,
  entity_id text,
  meta jsonb not null default '{}',
  created_at timestamptz default now()
);
alter table public.audit_logs enable row level security;
drop policy if exists "Admins can manage audit_logs" on public.audit_logs;
create policy "Admins can manage audit_logs" on public.audit_logs for all using (true) with check (true);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);

-- seed the admin-settings row so the Settings module can upsert
insert into public.page_content (slug, data) values ('admin-settings', '{}') on conflict (slug) do nothing;

-- ============================================================
--  Done. Reload /admin — vouchers, jobs, team, blog, inquiries,
--  internships, applications, media, users, certificates and audit
--  logs will all work.
-- ============================================================
