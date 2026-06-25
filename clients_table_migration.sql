-- ============================================================
--  KVJ Analytics — MIGRATION: Missing Tables
--  Run this in your Supabase → SQL Editor if tables are missing.
--  Safe to run multiple times (uses CREATE TABLE IF NOT EXISTS).
-- ============================================================

-- 1. CLIENTS TABLE
create table if not exists public.clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  industry text,
  logo_url text,
  website_url text,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.clients enable row level security;

-- Drop existing policies before recreating (avoids "already exists" errors)
drop policy if exists "Public can read active clients." on public.clients;
drop policy if exists "Admins can manage clients." on public.clients;

create policy "Public can read active clients."
  on public.clients for select
  using (is_active = true);

create policy "Admins can manage clients."
  on public.clients for all
  using (true)
  with check (true);


-- 2. TESTIMONIALS TABLE
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  organization text,
  quote text not null,
  rating integer default 5 check (rating between 1 and 5),
  avatar_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.testimonials enable row level security;

drop policy if exists "Public can read active testimonials." on public.testimonials;
drop policy if exists "Admins can manage testimonials." on public.testimonials;

create policy "Public can read active testimonials."
  on public.testimonials for select
  using (is_active = true);

create policy "Admins can manage testimonials."
  on public.testimonials for all
  using (true)
  with check (true);


-- 3. TEAM TABLE
create table if not exists public.team (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  bio text,
  photo_url text,
  linkedin_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.team enable row level security;

drop policy if exists "Public can read active team members." on public.team;
drop policy if exists "Admins can manage team." on public.team;

create policy "Public can read active team members."
  on public.team for select
  using (is_active = true);

create policy "Admins can manage team."
  on public.team for all
  using (true)
  with check (true);


-- 4. CASE STUDIES TABLE
create table if not exists public.case_studies (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  client_name text,
  industry text,
  challenge text,
  solution text,
  result text,
  cover_image_url text,
  tags text[],
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.case_studies enable row level security;

drop policy if exists "Public can read active case studies." on public.case_studies;
drop policy if exists "Admins can manage case studies." on public.case_studies;

create policy "Public can read active case studies."
  on public.case_studies for select
  using (is_active = true);

create policy "Admins can manage case studies."
  on public.case_studies for all
  using (true)
  with check (true);


-- 5. PAGE CONTENT TABLE (CMS)
create table if not exists public.page_content (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  data jsonb not null default '{}',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.page_content enable row level security;

drop policy if exists "Public can read page content." on public.page_content;
drop policy if exists "Admins can manage page content." on public.page_content;

create policy "Public can read page content."
  on public.page_content for select
  using (true);

create policy "Admins can manage page content."
  on public.page_content for all
  using (true)
  with check (true);
