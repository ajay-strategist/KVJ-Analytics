-- ============================================================
--  KVJ Analytics — LMS tables migration (Phase 2 + 3)
--  Creates the tables the Course Builder admin writes to:
--  modules, lessons, mock_tests, questions, activity_results.
--  Run this ONCE in the Supabase SQL Editor.
--  Safe to re-run (uses "if not exists").
-- ============================================================

-- MODULES (curriculum sections inside a course)
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- LESSONS (materials / activities inside a module)
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  kind text not null default 'material' check (kind in ('material','activity')),
  content_html text default '',
  max_score numeric,
  display_order int default 0,
  created_at timestamptz default now()
);

-- MOCK TESTS (one or more per course)
create table if not exists public.mock_tests (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  duration_mins int default 30,
  pass_mark numeric default 0,
  display_order int default 0,
  created_at timestamptz default now()
);

-- QUESTIONS (dynamic question types; answers stored in config jsonb)
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references public.mock_tests(id) on delete cascade not null,
  type text not null default 'single',
  stem text,
  marks numeric default 1,
  config jsonb not null default '{}',
  display_order int default 0,
  created_at timestamptz default now()
);

-- ACTIVITY RESULTS (scores saved per student per activity)
create table if not exists public.activity_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  course_slug text,
  score numeric,
  max_score numeric,
  submitted_at timestamptz default now(),
  unique (user_id, lesson_id)
);

-- ============================================================
--  Row Level Security
--  Admin APIs use the service-role key (bypasses RLS), so writes
--  work regardless. These policies let the PUBLIC site read the
--  curriculum, and let a logged-in student save their own scores.
-- ============================================================
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.mock_tests enable row level security;
alter table public.questions enable row level security;
alter table public.activity_results enable row level security;

-- Public read (catalog / enrolled course view)
create policy "Public can read modules"    on public.modules    for select using (true);
create policy "Public can read lessons"    on public.lessons    for select using (true);
create policy "Public can read mock_tests" on public.mock_tests for select using (true);
create policy "Public can read questions"  on public.questions  for select using (true);

-- Students manage their own activity results
create policy "Students read own results"   on public.activity_results for select using (auth.uid() = user_id);
create policy "Students insert own results"  on public.activity_results for insert with check (auth.uid() = user_id);
create policy "Students update own results"  on public.activity_results for update using (auth.uid() = user_id);
create policy "Admins read all results"      on public.activity_results for select using (
  exists (select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin')
);
