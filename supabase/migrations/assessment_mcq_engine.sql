-- Idempotent Supabase migration script for MCQ Assessment Engine
-- Run this in the Supabase SQL Editor.

-- 1. Drop existing lessons.kind check constraint if it exists, and recreate it to include 'assessment'
alter table public.lessons drop constraint if exists lessons_kind_check;
alter table public.lessons add constraint lessons_kind_check check (kind in ('theory', 'material', 'activity', 'assessment'));

-- 2. Add columns to public.mock_tests to support link to lesson, attempts, negative marking, randomization, and result visibility
alter table public.mock_tests add column if not exists lesson_id uuid references public.lessons(id) on delete cascade;
alter table public.mock_tests add column if not exists attempts_allowed integer default 0;
alter table public.mock_tests add column if not exists negative_marking numeric default 0;
alter table public.mock_tests add column if not exists randomize boolean default false;
alter table public.mock_tests add column if not exists publish_results boolean default true;

-- 3. Add index on lesson_id for faster lookups
create index if not exists idx_mock_tests_lesson_id on public.mock_tests(lesson_id);

-- 4. Ensure test_attempts table exists with extended columns
create table if not exists public.test_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  test_slug text not null,
  answers jsonb not null,
  score numeric(5, 2) not null,
  passed boolean not null,
  started_at timestamp with time zone not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.test_attempts add column if not exists test_id uuid references public.mock_tests(id) on delete cascade;
alter table public.test_attempts add column if not exists max_score numeric(5, 2);
alter table public.test_attempts add column if not exists per_question jsonb;

-- 5. Drop existing questions.type check constraint if it exists, and recreate it to support new question types
alter table public.questions drop constraint if exists questions_type_check;
alter table public.questions add constraint questions_type_check check (type in ('single', 'multiple', 'truefalse', 'fillblank', 'dragdrop', 'sequence', 'matrix', 'code', 'dragtable'));

-- 6. Add image_url column to public.questions table to support attachments (Google Drive, OneDrive, etc.)
alter table public.questions add column if not exists image_url text;

-- 7. Add passed column to public.activity_results table to support saving failed/all attempts
alter table public.activity_results add column if not exists passed boolean default true;

-- 8. Add score_percent column to public.test_attempts and public.activity_results tables
alter table public.test_attempts add column if not exists score_percent numeric(5, 2);
alter table public.activity_results add column if not exists score_percent numeric(5, 2);


