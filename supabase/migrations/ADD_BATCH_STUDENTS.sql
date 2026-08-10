-- Migration to add batch students table for rosters
create table if not exists public.batch_students (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  name text,
  email text,                                     -- stored lowercased/trimmed
  phone text,                                     -- stored E.164 (+91 default)
  status text not null default 'INVITED',         -- INVITED | JOINED | REMOVED
  profile_id uuid references public.profiles(id) on delete set null,
  added_at timestamptz not null default now(),
  constraint batch_students_identity_chk check (email is not null or phone is not null)
);

create unique index if not exists batch_students_batch_email_idx
  on public.batch_students(batch_id, email) where email is not null;

create unique index if not exists batch_students_batch_phone_idx
  on public.batch_students(batch_id, phone) where phone is not null;

create index if not exists batch_students_batch_id_idx
  on public.batch_students(batch_id);

-- Enable RLS on batch_students to protect student contact information
alter table public.batch_students enable row level security;

-- Policies for batch_students (Admins can manage rosters, service-role client bypasses RLS)
create policy "Admins can manage batch students"
  on public.batch_students for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
    )
  );

notify pgrst, 'reload schema';
