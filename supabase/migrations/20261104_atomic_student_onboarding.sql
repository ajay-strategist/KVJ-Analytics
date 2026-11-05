-- ============================================================================
-- KVJ Analytics — Atomic Student Onboarding & Post-Login Roster Claim
-- Eliminates multiple serial HTTP roundtrips between Next.js and Supabase
-- during concurrent classroom logins.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_claim_student_onboarding(
  p_user_id uuid,
  p_target_email text,
  p_clean_phone text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec RECORD;
  v_claimed_count int := 0;
  v_latest_college text := NULL;
  v_clean_search_phone text := NULL;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing p_user_id');
  END IF;

  -- Security: Enforce least privilege. Caller must be service_role or claiming strictly for their own auth.uid()
  IF auth.role() IS NOT NULL AND auth.role() != 'service_role' THEN
    IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
      RAISE EXCEPTION 'Access denied: unauthorized onboarding claim';
    END IF;
  END IF;

  IF p_clean_phone IS NOT NULL AND length(trim(p_clean_phone)) > 0 THEN
    v_clean_search_phone := right(regexp_replace(p_clean_phone, '\D', '', 'g'), 10);
  END IF;

  -- 1. Find all matching invited batch student records for this student
  FOR v_rec IN
    SELECT bs.id AS batch_student_id, b.course_slug, b.college_name
    FROM public.batch_students bs
    JOIN public.batches b ON b.id = bs.batch_id
    WHERE bs.status = 'INVITED'
      AND (
        (p_target_email IS NOT NULL AND lower(trim(bs.email)) = lower(trim(p_target_email)))
        OR (v_clean_search_phone IS NOT NULL AND length(v_clean_search_phone) >= 10 AND right(regexp_replace(coalesce(bs.phone, ''), '\D', '', 'g'), 10) = v_clean_search_phone)
      )
  LOOP
    IF v_rec.course_slug IS NOT NULL THEN
      -- Upsert student enrollment
      INSERT INTO public.enrollments (user_id, course_slug, enrollment_method, status)
      VALUES (p_user_id, v_rec.course_slug, 'college_code', 'active')
      ON CONFLICT (user_id, course_slug) DO UPDATE
      SET status = 'active', enrollment_method = 'college_code';

      -- Mark batch student record as JOINED and associate profile_id
      UPDATE public.batch_students
      SET status = 'JOINED', profile_id = p_user_id
      WHERE id = v_rec.batch_student_id;

      v_latest_college := v_rec.college_name;
      v_claimed_count := v_claimed_count + 1;
    END IF;
  END LOOP;

  -- 2. Update profile if college was linked
  IF v_latest_college IS NOT NULL THEN
    UPDATE public.profiles
    SET organization = v_latest_college,
        account_type = 'college',
        email = COALESCE(email, p_target_email)
    WHERE id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'claimed_count', v_claimed_count,
    'college_name', v_latest_college
  );
END;
$$;

-- Explicitly revoke default execute permissions and restrict strictly to service_role
REVOKE ALL ON FUNCTION public.fn_claim_student_onboarding(uuid, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fn_claim_student_onboarding(uuid, text, text) TO service_role;

-- Composite indexes to ensure O(1) lightning lookup during classroom login bursts
CREATE INDEX IF NOT EXISTS idx_batch_students_status_email_phone
  ON public.batch_students (status, lower(trim(email)));

CREATE INDEX IF NOT EXISTS idx_batch_students_status_phone
  ON public.batch_students (status, phone);

