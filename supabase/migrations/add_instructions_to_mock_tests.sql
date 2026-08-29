-- Migration: Add instructions column to mock_tests table
alter table public.mock_tests
  add column if not exists instructions text;

comment on column public.mock_tests.instructions is
  'Custom exam instructions and guidelines entered by course creators/admins.';
