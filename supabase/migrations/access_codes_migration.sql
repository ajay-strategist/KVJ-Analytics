-- 1. Create colleges table
create table if not exists public.colleges (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on colleges
alter table public.colleges enable row level security;

-- Policies for colleges
create policy "Anyone can read colleges"
  on public.colleges for select
  using (true);

create policy "Admins can manage colleges"
  on public.colleges for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

-- Seed initial colleges
insert into public.colleges (name) values
  ('Cochin University of Science and Technology (CUSAT)'),
  ('Rajagiri School of Engineering & Technology (RSET)'),
  ('Government Model Engineering College (MEC)'),
  ('SCMS School of Engineering and Technology'),
  ('Federal Institute of Science and Technology (FISAT)')
on conflict (name) do nothing;

-- 2. Relax the 6-character check constraint on unlock_codes
alter table public.unlock_codes drop constraint if exists unlock_codes_code_check;

-- 3. Add additive columns to unlock_codes table
alter table public.unlock_codes
  add column if not exists training_type text check (training_type in ('ONE_TO_ONE', 'COLLEGE', 'CORPORATE')),
  add column if not exists seats integer default 1,
  add column if not exists seats_used integer default 0,
  add column if not exists valid_from timestamp with time zone,
  add column if not exists valid_until timestamp with time zone,
  add column if not exists status text check (status in ('ACTIVE', 'PAUSED', 'REVOKED', 'EXHAUSTED')) default 'ACTIVE',
  add column if not exists college_id uuid references public.colleges(id) on delete set null,
  add column if not exists organization_id uuid references public.clients(id) on delete set null,
  add column if not exists coordinator_name text,
  add column if not exists coordinator_email text,
  add column if not exists allowed_email_domain text,
  add column if not exists notes text;

-- 4. Add columns to code_redemptions table
alter table public.code_redemptions
  add column if not exists enrollment_id uuid references public.enrollments(id) on delete cascade,
  add column if not exists status text default 'REDEEMED';
