-- Migration: Update questions_type_check constraint to include 'pivot_table'
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_type_check;

ALTER TABLE public.questions 
ADD CONSTRAINT questions_type_check 
CHECK (type IN (
  'single', 
  'multiple', 
  'truefalse', 
  'fillblank', 
  'dragdrop', 
  'dragtable', 
  'pivot_table', 
  'sequence', 
  'matrix', 
  'code'
));
