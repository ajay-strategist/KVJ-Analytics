-- Idempotent Supabase migration script for MCQ Assessment Engine
-- Run this in the Supabase SQL Editor.

-- 1. Drop existing lessons.kind check constraint if it exists, and recreate it to include 'assessment'
alter table public.lessons drop constraint if exists lessons_kind_check;
alter table public.lessons add constraint lessons_kind_check check (kind in ('material', 'activity', 'assessment'));

-- 2. Add columns to public.mock_tests to support link to lesson, attempts, negative marking, randomization, and result visibility
alter table public.mock_tests add column if not exists lesson_id uuid references public.lessons(id) on delete cascade;
alter table public.mock_tests add column if not exists attempts_allowed integer default 0;
alter table public.mock_tests add column if not exists negative_marking numeric default 0;
alter table public.mock_tests add column if not exists randomize boolean default false;
alter table public.mock_tests add column if not exists publish_results boolean default true;

-- 3. Add index on lesson_id for faster lookups
create index if not exists idx_mock_tests_lesson_id on public.mock_tests(lesson_id);
