-- ============================================================================
-- KVJ Analytics — ADD ROSTER FIELDS & AUTO-LINK REGISTRATIONS
-- Adds student_id & department columns to batch_students,
-- and updates handle_new_user trigger to match and auto-enroll pre-added students.
-- ============================================================================

ALTER TABLE public.batch_students ADD COLUMN IF NOT EXISTS student_id text;
ALTER TABLE public.batch_students ADD COLUMN IF NOT EXISTS department text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  matched_student RECORD;
BEGIN
  -- 1. Create student profile row
  INSERT INTO public.profiles (id, name, role, organization, phone, account_type)
  VALUES (
    new.id, 
    coalesce(new.raw_user_meta_data->>'name', 'New Student'), 
    'student',
    NULL,
    new.phone,
    'individual'
  );

  -- 2. Match by Email in invited batch_students (roster)
  IF new.email IS NOT NULL THEN
    SELECT bs.id, bs.batch_id, b.course_slug, b.college_name
    INTO matched_student
    FROM public.batch_students bs
    JOIN public.batches b ON b.id = bs.batch_id
    WHERE lower(trim(bs.email)) = lower(trim(new.email)) AND bs.status = 'INVITED'
    LIMIT 1;
  END IF;

  -- 3. Match by Phone in invited batch_students if no email match
  IF matched_student.id IS NULL AND new.phone IS NOT NULL THEN
    SELECT bs.id, bs.batch_id, b.course_slug, b.college_name
    INTO matched_student
    FROM public.batch_students bs
    JOIN public.batches b ON b.id = bs.batch_id
    WHERE regexp_replace(bs.phone, '\D', '', 'g') = regexp_replace(new.phone, '\D', '', 'g') AND bs.status = 'INVITED'
    LIMIT 1;
  END IF;

  -- 4. Link account and auto-enroll if matched
  IF matched_student.id IS NOT NULL THEN
    -- Update roster record
    UPDATE public.batch_students
    SET status = 'JOINED', profile_id = new.id
    WHERE id = matched_student.id;

    -- Create enrollment record
    INSERT INTO public.enrollments (user_id, course_slug, enrollment_method, status)
    VALUES (new.id, matched_student.course_slug, 'college_code', 'active')
    ON CONFLICT (user_id, course_slug) DO UPDATE
    SET status = 'active', enrollment_method = 'college_code';

    -- Update profile metadata
    UPDATE public.profiles
    SET organization = matched_student.college_name,
        account_type = 'college'
    WHERE id = new.id;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
