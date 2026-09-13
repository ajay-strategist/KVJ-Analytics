-- ============================================================
--  KVJ Analytics — Power BI Live Reporting Views & Database Schema
--  Execute this script in your Supabase SQL Editor.
--  These views provide real-time data for Power BI dashboards 
--  and the Admin Learning Reports portal.
-- ============================================================

-- 1. DIMENSION: Students & Contact Information
-- Joins profiles with auth.users and resolved batch/college names.
CREATE OR REPLACE VIEW public.v_powerbi_students AS
SELECT 
  p.id AS student_id,
  COALESCE(p.full_name, p.name, 'Student') AS student_name,
  u.email AS email,
  p.phone AS phone,
  COALESCE(
    (SELECT b.college_name 
     FROM public.batch_students bs 
     JOIN public.batches b ON b.id = bs.batch_id 
     WHERE bs.profile_id = p.id OR LOWER(bs.email) = LOWER(u.email)
     LIMIT 1),
    p.organization,
    'Individual'
  ) AS organization_college,
  p.account_type AS account_type,
  p.profession AS profession,
  p.role AS role,
  p.created_at AS registered_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'student';


-- 2. DIMENSION: Curriculum Hierarchy (Courses -> Modules -> Topics/Lessons)
CREATE OR REPLACE VIEW public.v_powerbi_curriculum_hierarchy AS
SELECT 
  c.id AS course_id,
  c.slug AS course_slug,
  c.title AS course_title,
  c.duration AS course_duration,
  cc.name AS category_name,
  m.id AS module_id,
  m.title AS module_title,
  COALESCE(m.display_order, 0) AS module_order,
  l.id AS lesson_id,
  l.title AS topic_title,
  l.kind AS topic_kind,
  COALESCE(l.max_score, 0) AS max_score,
  COALESCE(l.display_order, 0) AS topic_order,
  l.created_at AS topic_created_at
FROM public.courses c
LEFT JOIN public.course_categories cc ON cc.id = c.category_id
JOIN public.modules m ON m.course_id = c.id
JOIN public.lessons l ON l.module_id = m.id
ORDER BY c.title, m.display_order, l.display_order;


-- 3. FACT & MATRIX: Granular Student Topic-by-Topic Completion Matrix
-- Displays every topic for enrolled students. 
-- 'completion_status' is 'Yes' if completed, or NULL (blank) if pending.
CREATE OR REPLACE VIEW public.v_powerbi_student_topic_matrix AS
SELECT 
  e.user_id AS student_id,
  COALESCE(p.full_name, p.name, 'Student') AS student_name,
  u.email AS email,
  COALESCE(
    (SELECT b.college_name 
     FROM public.batch_students bs 
     JOIN public.batches b ON b.id = bs.batch_id 
     WHERE bs.profile_id = e.user_id OR LOWER(bs.email) = LOWER(u.email)
     LIMIT 1),
    p.organization,
    'Individual'
  ) AS organization_college,
  c.id AS course_id,
  c.slug AS course_slug,
  c.title AS course_title,
  m.id AS module_id,
  m.title AS module_title,
  COALESCE(m.display_order, 0) AS module_order,
  l.id AS lesson_id,
  l.title AS topic_title,
  l.kind AS topic_kind,
  COALESCE(l.display_order, 0) AS topic_order,
  -- Core Matrix Status: Returns 'Yes' if activity/lesson is submitted, NULL if blank
  CASE 
    WHEN ar.id IS NOT NULL THEN 'Yes' 
    ELSE NULL 
  END AS completion_status,
  -- Numeric flag for DAX aggregation (1 = Completed, 0 = Pending)
  CASE 
    WHEN ar.id IS NOT NULL THEN 1 
    ELSE 0 
  END AS is_completed_flag,
  ar.score AS score,
  COALESCE(ar.max_score, l.max_score, 0) AS max_score,
  ar.score_percent AS score_percent,
  ar.passed AS passed,
  ar.submitted_at AS completed_at
FROM public.enrollments e
JOIN public.courses c ON c.slug = e.course_slug
JOIN public.profiles p ON p.id = e.user_id
LEFT JOIN auth.users u ON u.id = e.user_id
JOIN public.modules m ON m.course_id = c.id
JOIN public.lessons l ON l.module_id = m.id
LEFT JOIN public.activity_results ar 
  ON ar.user_id = e.user_id 
  AND ar.lesson_id = l.id;


-- 4. FACT: Student Course & Module Aggregated Progress
-- Calculates live Total Topics, Completed Topics, Course Completion %, and Assessment metrics.
CREATE OR REPLACE VIEW public.v_powerbi_student_course_progress AS
WITH course_curriculum_counts AS (
  SELECT 
    c.id AS course_id,
    c.slug AS course_slug,
    c.title AS course_title,
    COUNT(DISTINCT m.id) AS total_modules,
    COUNT(DISTINCT l.id) AS total_topics
  FROM public.courses c
  LEFT JOIN public.modules m ON m.course_id = c.id
  LEFT JOIN public.lessons l ON l.module_id = m.id
  GROUP BY c.id, c.slug, c.title
),
student_completed_counts AS (
  SELECT 
    ar.user_id,
    ar.course_slug,
    COUNT(DISTINCT ar.lesson_id) AS completed_topics_count,
    ROUND(AVG(ar.score_percent), 1) AS avg_activity_score,
    MAX(ar.submitted_at) AS last_activity_at
  FROM public.activity_results ar
  GROUP BY ar.user_id, ar.course_slug
),
student_mock_scores AS (
  SELECT 
    ta.user_id,
    mt.course_id,
    MAX(ta.score) AS highest_mock_score,
    BOOL_OR(ta.passed) AS has_passed_assessment,
    COUNT(ta.id) AS total_test_attempts
  FROM public.test_attempts ta
  JOIN public.mock_tests mt ON mt.id = ta.test_id
  GROUP BY ta.user_id, mt.course_id
)
SELECT 
  e.id AS enrollment_id,
  e.user_id AS student_id,
  COALESCE(p.full_name, p.name, 'Student') AS student_name,
  u.email AS email,
  p.phone AS phone,
  COALESCE(
    (SELECT b.college_name 
     FROM public.batch_students bs 
     JOIN public.batches b ON b.id = bs.batch_id 
     WHERE bs.profile_id = e.user_id OR LOWER(bs.email) = LOWER(u.email)
     LIMIT 1),
    p.organization,
    'Individual'
  ) AS organization_college,
  c.id AS course_id,
  c.slug AS course_slug,
  c.title AS course_title,
  e.enrollment_method AS enrollment_method,
  e.status AS enrollment_status,
  e.created_at AS enrolled_at,
  COALESCE(ccc.total_modules, 0) AS total_modules,
  COALESCE(ccc.total_topics, 0) AS total_topics,
  COALESCE(scc.completed_topics_count, 0) AS completed_topics,
  -- Overall Course Completion %
  CASE 
    WHEN COALESCE(ccc.total_topics, 0) > 0 THEN 
      ROUND((COALESCE(scc.completed_topics_count, 0)::numeric / ccc.total_topics::numeric) * 100, 1)
    ELSE 0 
  END AS course_completion_pct,
  -- Activity and Mock test scores
  COALESCE(scc.avg_activity_score, 0) AS avg_activity_score_pct,
  COALESCE(sms.highest_mock_score, 0) AS highest_mock_score,
  COALESCE(sms.has_passed_assessment, false) AS has_passed_assessment,
  COALESCE(sms.total_test_attempts, 0) AS mock_test_attempts_count,
  scc.last_activity_at AS last_activity_at,
  -- Status tags
  CASE 
    WHEN COALESCE(scc.completed_topics_count, 0) = 0 THEN 'Not Started'
    WHEN COALESCE(ccc.total_topics, 0) > 0 AND COALESCE(scc.completed_topics_count, 0) >= ccc.total_topics THEN 'Completed'
    ELSE 'In Progress'
  END AS learning_status,
  -- Certificate issued flag
  EXISTS(
    SELECT 1 FROM public.certificates cert 
    WHERE cert.user_id = e.user_id AND cert.course_slug = e.course_slug
  ) AS is_certified
FROM public.enrollments e
JOIN public.courses c ON c.slug = e.course_slug
LEFT JOIN course_curriculum_counts ccc ON ccc.course_id = c.id
JOIN public.profiles p ON p.id = e.user_id
LEFT JOIN auth.users u ON u.id = e.user_id
LEFT JOIN student_completed_counts scc ON scc.user_id = e.user_id AND scc.course_slug = e.course_slug
LEFT JOIN student_mock_scores sms ON sms.user_id = e.user_id AND sms.course_id = c.id;


-- 5. FACT: Assessment & Mock Test Attempt Scores
CREATE OR REPLACE VIEW public.v_powerbi_assessment_scores AS
SELECT 
  ta.id AS attempt_id,
  ta.user_id AS student_id,
  COALESCE(p.full_name, p.name, 'Student') AS student_name,
  u.email AS email,
  COALESCE(
    (SELECT b.college_name 
     FROM public.batch_students bs 
     JOIN public.batches b ON b.id = bs.batch_id 
     WHERE bs.profile_id = ta.user_id OR LOWER(bs.email) = LOWER(u.email)
     LIMIT 1),
    p.organization,
    'Individual'
  ) AS organization_college,
  c.id AS course_id,
  c.slug AS course_slug,
  c.title AS course_title,
  mt.id AS test_id,
  mt.title AS test_title,
  mt.pass_mark AS pass_mark,
  ta.score AS score,
  ta.passed AS passed,
  ta.started_at AS started_at,
  ta.submitted_at AS submitted_at,
  ROW_NUMBER() OVER(
    PARTITION BY ta.user_id, ta.test_id 
    ORDER BY ta.submitted_at ASC
  ) AS attempt_number
FROM public.test_attempts ta
JOIN public.mock_tests mt ON mt.id = ta.test_id
JOIN public.courses c ON c.id = mt.course_id
JOIN public.profiles p ON p.id = ta.user_id
LEFT JOIN auth.users u ON u.id = ta.user_id;


-- ============================================================
--  Grant Access Permissions to Views
-- ============================================================
GRANT SELECT ON public.v_powerbi_students TO anon, authenticated, service_role;
GRANT SELECT ON public.v_powerbi_curriculum_hierarchy TO anon, authenticated, service_role;
GRANT SELECT ON public.v_powerbi_student_topic_matrix TO anon, authenticated, service_role;
GRANT SELECT ON public.v_powerbi_student_course_progress TO anon, authenticated, service_role;
GRANT SELECT ON public.v_powerbi_assessment_scores TO anon, authenticated, service_role;
