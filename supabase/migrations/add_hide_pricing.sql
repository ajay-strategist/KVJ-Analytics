-- KVJ Analytics — MIGRATION: Hide Pricing & Inline Assessments
-- Run this in your Supabase → SQL Editor.
-- Safe to run multiple times.

ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS hide_pricing BOOLEAN DEFAULT false;
ALTER TABLE public.mock_tests ADD COLUMN IF NOT EXISTS is_inline BOOLEAN DEFAULT false;
