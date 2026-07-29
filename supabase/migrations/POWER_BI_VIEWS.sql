-- ============================================================
--  KVJ Analytics — Power BI Report Views
--  Run this script in your Supabase SQL Editor to create the 
--  views needed for your Power BI Dashboard.
-- ============================================================

-- 1. Students View 
-- (Name, Mail ID, Students ID)
CREATE OR REPLACE VIEW public.powerbi_students AS
SELECT 
  p.id AS student_id,
  p.name AS student_name,
  u.email AS mail_id,
  p.phone AS phone
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'student';

-- 2. Students Course & Course Progress View 
-- (Student ID, Course ID, Course Name, Course Progress)
CREATE OR REPLACE VIEW public.powerbi_course_progress AS
SELECT 
  e.user_id AS student_id,
  c.id AS course_id,
  c.title AS course_name,
  e.status AS course_progress,
  e.created_at AS enrolled_at
FROM public.enrollments e
LEFT JOIN public.courses c ON c.slug = e.course_slug;

-- 3. Activity Score View 
-- (Student ID, Course ID, Activity Name, Activity Score)
CREATE OR REPLACE VIEW public.powerbi_activity_scores AS
SELECT 
  ta.user_id AS student_id,
  mt.course_id AS course_id,
  mt.title AS activity_name,
  ta.score AS activity_score,
  ta.passed AS activity_passed,
  ta.started_at,
  ta.submitted_at
FROM public.test_attempts ta
LEFT JOIN public.mock_tests mt ON ta.test_id = mt.id;

-- Ensure roles can select from views if connecting from Power BI via a specific user
-- (e.g., service_role or authenticated)
GRANT SELECT ON public.powerbi_students TO service_role;
GRANT SELECT ON public.powerbi_course_progress TO service_role;
GRANT SELECT ON public.powerbi_activity_scores TO service_role;
