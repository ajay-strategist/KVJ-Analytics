-- ============================================================
-- KVJ Analytics — Fix: test_attempts schema for Mock Test
-- Safe to run multiple times (all IF NOT EXISTS / DO NOTHING)
-- Paste this entire file into Supabase SQL Editor and Run.
-- ============================================================

-- 1. Ensure test_attempts table exists with the base columns
create table if not exists public.test_attempts (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  test_slug     text not null,
  answers       jsonb not null,
  score         numeric(6, 2) not null default 0,
  passed        boolean not null default false,
  started_at    timestamp with time zone not null,
  submitted_at  timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add extended columns (safe — skipped if already present)
alter table public.test_attempts add column if not exists test_id       uuid references public.mock_tests(id) on delete set null;
alter table public.test_attempts add column if not exists max_score     numeric(6, 2);
alter table public.test_attempts add column if not exists score_percent numeric(6, 2);
alter table public.test_attempts add column if not exists per_question  jsonb;

-- 3. Ensure activity_results has score_percent + passed columns
alter table public.activity_results add column if not exists score_percent numeric(6, 2);
alter table public.activity_results add column if not exists passed       boolean default true;

-- 4. Ensure mock_tests has all required columns
alter table public.mock_tests add column if not exists lesson_id         uuid references public.lessons(id) on delete cascade;
alter table public.mock_tests add column if not exists attempts_allowed  integer  default 0;
alter table public.mock_tests add column if not exists negative_marking  numeric  default 0;
alter table public.mock_tests add column if not exists randomize         boolean  default false;
alter table public.mock_tests add column if not exists publish_results   boolean  default true;
alter table public.mock_tests add column if not exists pass_mark         numeric  default 84;

-- 5. Ensure questions table supports all types + image
do $$ begin
  alter table public.questions drop constraint if exists questions_type_check;
  alter table public.questions add constraint questions_type_check
    check (type in ('single','multiple','truefalse','fillblank','dragdrop','sequence','matrix','code','dragtable'));
exception when others then null;
end $$;
alter table public.questions add column if not exists image_url     text;
alter table public.questions add column if not exists display_order integer default 0;

-- 6. Ensure lessons supports 'assessment' kind
do $$ begin
  alter table public.lessons drop constraint if exists lessons_kind_check;
  alter table public.lessons add constraint lessons_kind_check
    check (kind in ('theory','material','activity','assessment'));
exception when others then null;
end $$;

-- 7. Performance indexes
create index if not exists idx_test_attempts_user_id   on public.test_attempts(user_id);
create index if not exists idx_test_attempts_test_id   on public.test_attempts(test_id);
create index if not exists idx_test_attempts_test_slug on public.test_attempts(test_slug);
create index if not exists idx_mock_tests_lesson_id    on public.mock_tests(lesson_id);

-- 8. Add registration_form_html column to courses table for custom per-course registration forms
alter table public.courses add column if not exists registration_form_html text;


-- 8. RLS: allow users to read/insert their own attempts
alter table public.test_attempts enable row level security;

drop policy if exists "Users can read own test attempts"   on public.test_attempts;
drop policy if exists "Users can insert own test attempts" on public.test_attempts;
drop policy if exists "Service role can manage test attempts" on public.test_attempts;

create policy "Users can read own test attempts"
  on public.test_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own test attempts"
  on public.test_attempts for insert
  with check (auth.uid() = user_id);

-- Allow the service role (used in Next.js API) to bypass RLS
create policy "Service role can manage test attempts"
  on public.test_attempts for all
  to service_role
  using (true)
  with check (true);

-- Done
select 'Migration complete: test_attempts schema is ready.' as status;
