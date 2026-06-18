-- ============================================================
--  KVJ Analytics — Supabase Database Schema Setup
--  Execute this script in your Supabase SQL Editor.
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Extends Auth Users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  organization text,
  phone text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view their own profile."
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile."
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view and manage all profiles."
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- Profile trigger to create profile row automatically on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'New Student'), 'student');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. LEADS TABLE (Contact Form & Magnets)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  organization text not null,
  email text not null,
  phone text not null,
  service_interest text not null,
  message text not null,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on leads
alter table public.leads enable row level security;

-- Policies for leads
create policy "Server-role only insert leads."
  on public.leads for insert
  with check (true); -- Insert is allowed for all, but read is restricted

create policy "Admins can manage leads."
  on public.leads for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );


-- 3. BATCHES & ROTATING CODES TABLE (College Code Flow)
create table public.batches (
  id uuid default gen_random_uuid() primary key,
  college_name text not null,
  course_slug text not null,
  totp_secret text not null, -- base32 secret key for TOTP code rotations
  valid_from timestamp with time zone not null,
  valid_to timestamp with time zone not null,
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on batches
alter table public.batches enable row level security;

-- Policies for batches
create policy "Admins can manage batches."
  on public.batches for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );


-- 4. ENROLLMENTS TABLE (Course Access)
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_slug text not null,
  enrollment_method text not null check (enrollment_method in ('paid', 'college_code')),
  status text not null default 'active' check (status in ('active', 'suspended', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_slug)
);

-- Enable RLS on enrollments
alter table public.enrollments enable row level security;

-- Policies for enrollments
create policy "Users can view their own enrollments."
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "Admins can manage all enrollments."
  on public.enrollments for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );


-- 5. ORDERS TABLE (Razorpay Payments)
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_slug text not null,
  amount numeric(10, 2) not null,
  currency text not null default 'INR',
  razorpay_order_id text unique not null,
  razorpay_payment_id text,
  razorpay_signature text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Policies for orders
create policy "Users can view their own orders."
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admins can manage all orders."
  on public.orders for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );


-- 6. TEST ATTEMPTS TABLE (Mock Test engine results)
create table public.test_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  test_slug text not null,
  answers jsonb not null, -- Stores responses without correctIndex keys
  score numeric(5, 2) not null,
  passed boolean not null,
  started_at timestamp with time zone not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on test_attempts
alter table public.test_attempts enable row level security;

-- Policies for test_attempts
create policy "Users can view their own test attempts."
  on public.test_attempts for select
  using (auth.uid() = user_id);

create policy "Users can create their own test attempts."
  on public.test_attempts for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all test attempts."
  on public.test_attempts for select
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );
