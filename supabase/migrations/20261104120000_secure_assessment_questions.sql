-- ============================================================================
-- Migration: 20261104_secure_assessment_questions.sql
-- Purpose: Permanently remediate assessment answer leaks in Supabase RLS.
-- Strips answer keys at the database engine layer and restricts raw questions table.
-- ============================================================================

-- 1. Helper function to strip sensitive answer fields from question config jsonb
CREATE OR REPLACE FUNCTION public.fn_strip_question_answers(p_type text, p_config jsonb)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_cleaned jsonb;
  v_blanks jsonb;
  v_test_cases jsonb;
  v_item jsonb;
  v_new_blanks jsonb := '[]'::jsonb;
  v_new_test_cases jsonb := '[]'::jsonb;
BEGIN
  IF p_config IS NULL THEN
    RETURN '{}'::jsonb;
  END IF;

  -- Strip top-level answer keys
  v_cleaned := p_config 
    - 'correctIndex' 
    - 'correctIndexes' 
    - 'correct' 
    - 'correctPairs' 
    - 'correctOrder' 
    - 'correctAnswer'
    - 'answer'
    - 'answers'
    - 'solution'
    - 'sampleSolution'
    - 'expectedOutput';

  -- For fill-in-the-blank questions, strip 'accepted' array inside blanks
  IF p_type = 'fillblank' AND (v_cleaned ? 'blanks') AND jsonb_typeof(v_cleaned->'blanks') = 'array' THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_cleaned->'blanks') LOOP
      v_new_blanks := v_new_blanks || jsonb_build_array(v_item - 'accepted');
    END LOOP;
    v_cleaned := jsonb_set(v_cleaned, '{blanks}', v_new_blanks);
  END IF;

  -- For code questions, strip 'expectedOutput' inside testCases
  IF p_type = 'code' AND (v_cleaned ? 'testCases') AND jsonb_typeof(v_cleaned->'testCases') = 'array' THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_cleaned->'testCases') LOOP
      v_new_test_cases := v_new_test_cases || jsonb_build_array(v_item - 'expectedOutput');
    END LOOP;
    v_cleaned := jsonb_set(v_cleaned, '{testCases}', v_new_test_cases);
  END IF;

  RETURN v_cleaned;
END;
$$;

-- 2. Revoke permissive public select from raw questions table
DROP POLICY IF EXISTS "Public can read questions" ON public.questions;

-- Ensure RLS is active
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated admins and service role to read/manage raw questions
DROP POLICY IF EXISTS "Admins can view and manage all questions." ON public.questions;
CREATE POLICY "Admins can view and manage all questions."
  ON public.questions FOR ALL
  USING (public.is_admin());

-- Allow service role full access
DROP POLICY IF EXISTS "Service role manage questions" ON public.questions;
CREATE POLICY "Service role manage questions"
  ON public.questions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. Create secure student questions view with security_barrier
CREATE OR REPLACE VIEW public.student_questions_view
WITH (security_barrier = true)
AS
SELECT 
  id,
  test_id,
  type,
  stem,
  marks,
  image_url,
  display_order,
  public.fn_strip_question_answers(type, config) AS config,
  created_at
FROM public.questions;

-- Grant select on the sanitized view to public and students
GRANT SELECT ON public.student_questions_view TO anon, authenticated, service_role;

-- 4. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

