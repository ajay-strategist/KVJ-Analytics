-- Migration: Add randomize_options column to mock_tests table
-- This allows admins to control whether answer options are shuffled for each student

alter table public.mock_tests
  add column if not exists randomize_options boolean default true;

comment on column public.mock_tests.randomize_options is
  'When true (default), the answer options (A/B/C/D) are presented in a randomised order per session. Set to false to disable.';
