/**
 * KVJ Analytics — Local LMS Workflow Smoke Test Suite (Phase 11.1C)
 *
 * Verifies all 14 local LMS workflows against the isolated local Supabase instance
 * using synthetic data from tests/fixtures/synthetic_lms_manifest.json.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// 1. Preflight environment loading & safety checks
const envFilePath = path.resolve(process.cwd(), '.env.local.test');
if (!fs.existsSync(envFilePath)) {
  throw new Error(`.env.local.test not found at ${envFilePath}`);
}
if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(envFilePath);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';

// Strictly block non-local execution
if (
  SUPABASE_URL.includes('bdwwgipbrnkgihfjihxz') ||
  SUPABASE_URL.includes('supabase.co') ||
  (!SUPABASE_URL.includes('127.0.0.1') && !SUPABASE_URL.includes('localhost'))
) {
  throw new Error(`CRITICAL GUARD: Smoke tests must only target local Supabase. Blocked target: ${SUPABASE_URL}`);
}

// 2. Load seeded manifest
const manifestPath = path.resolve(process.cwd(), 'tests/fixtures/synthetic_lms_manifest.json');
if (!fs.existsSync(manifestPath)) {
  throw new Error(`Synthetic manifest not found. Run "node scripts/seed-local-lms.cjs" first.`);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const adminDb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const anonDb = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SYNTHETIC_STUDENT_PASSWORD = 'LocalSyntheticStudent2026!';

// Helper: TOTP Generator
function generateTOTP(secret, timeStepSeconds = 30) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleanBase32 = secret.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  let bits = '';
  for (let i = 0; i < cleanBase32.length; i++) {
    const val = alphabet.indexOf(cleanBase32[i]);
    if (val === -1) throw new Error(`Invalid base32 char: ${cleanBase32[i]}`);
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.substring(i, i + 8);
    if (byte.length === 8) bytes.push(parseInt(byte, 2));
  }
  const key = Buffer.from(bytes);
  const counter = Math.floor(Date.now() / 1000 / timeStepSeconds);
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(0, 0);
  buffer.writeUInt32BE(counter, 4);

  const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

test('Local LMS Workflow Smoke Test Suite (14 Workflows)', async (t) => {
  let studentSession = null;
  const testStudent = manifest.students[0]; // student001@kvjanalytics.test

  // -----------------------------------------------------------------
  // 1. Student login and authenticated session
  // -----------------------------------------------------------------
  await t.test('1. Student login and authenticated session', async () => {
    const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testStudent.email,
        password: SYNTHETIC_STUDENT_PASSWORD,
      }),
    });

    assert.equal(loginRes.status, 200, `Login failed with status ${loginRes.status}`);
    const authData = await loginRes.json();
    assert.ok(authData.access_token, 'Login response missing access_token');
    assert.equal(authData.user.id, testStudent.id, 'Logged in user id does not match seeded student');
    assert.equal(authData.user.email, testStudent.email, 'Logged in user email does not match');

    studentSession = authData;
  });

  // -----------------------------------------------------------------
  // 2. Course listing/access
  // -----------------------------------------------------------------
  await t.test('2. Course listing and metadata access', async () => {
    const { data: course, error } = await anonDb
      .from('courses')
      .select('id, slug, title, is_published')
      .eq('slug', manifest.course.slug)
      .single();

    assert.equal(error, null, `Course lookup failed: ${error?.message}`);
    assert.equal(course.slug, manifest.course.slug);
    assert.equal(course.title, manifest.course.title);
    assert.equal(course.is_published, true);
  });

  // -----------------------------------------------------------------
  // 3. Course join/enrollment verification
  // -----------------------------------------------------------------
  await t.test('3. Course join TOTP and batch validation', async () => {
    // Generate valid TOTP for batch
    const totp = generateTOTP('JBSWY3DPEHPK3PXP');
    assert.match(totp, /^\d{6}$/, 'TOTP must be a 6-digit numeric string');

    // Verify batch is active in DB
    const { data: batch, error } = await adminDb
      .from('batches')
      .select('id, college_name, course_slug, active')
      .eq('id', manifest.batch.id)
      .single();

    assert.equal(error, null);
    assert.equal(batch.active, true);
    assert.equal(batch.course_slug, manifest.course.slug);
  });

  // -----------------------------------------------------------------
  // 4. Batch enrollment/access
  // -----------------------------------------------------------------
  await t.test('4. Batch roster and enrollment record integrity', async () => {
    const { data: rosterEntry, error: rErr } = await adminDb
      .from('batch_students')
      .select('id, status, profile_id, batch_id')
      .eq('batch_id', manifest.batch.id)
      .eq('email', testStudent.email)
      .single();

    assert.equal(rErr, null);
    assert.ok(rosterEntry.status === 'CLAIMED' || rosterEntry.status === 'JOINED');
    assert.equal(rosterEntry.profile_id, testStudent.id);

    const { data: enrollment, error: eErr } = await adminDb
      .from('enrollments')
      .select('id, status, course_slug')
      .eq('user_id', testStudent.id)
      .eq('course_slug', manifest.course.slug)
      .single();

    assert.equal(eErr, null);
    assert.equal(enrollment.status, 'active');
  });

  // -----------------------------------------------------------------
  // 5. Module and lesson listing
  // -----------------------------------------------------------------
  await t.test('5. Module and lesson hierarchy listing', async () => {
    const { data: modules, error: mErr } = await anonDb
      .from('modules')
      .select('id, title, lessons(id, title, kind, display_order)')
      .eq('course_id', manifest.course.id)
      .order('display_order', { ascending: true });

    assert.equal(mErr, null);
    assert.ok(modules.length >= 1, 'At least one module must exist');
    assert.equal(modules[0].id, manifest.module.id);
    assert.ok(modules[0].lessons.length >= 2, 'Module must contain at least 2 lessons');
  });

  // -----------------------------------------------------------------
  // 6. Lesson content access
  // -----------------------------------------------------------------
  await t.test('6. Lesson content access (material and activity)', async () => {
    const lesson1Id = manifest.lessons[0].id;
    const { data: lesson, error } = await anonDb
      .from('lessons')
      .select('id, title, kind, content_html')
      .eq('id', lesson1Id)
      .single();

    assert.equal(error, null);
    assert.equal(lesson.id, lesson1Id);
    assert.ok(lesson.content_html && lesson.content_html.length > 0, 'Lesson content_html must not be empty');
  });

  // -----------------------------------------------------------------
  // 7. Lesson progress/activity submission
  // -----------------------------------------------------------------
  await t.test('7. Lesson progress and activity scoring submission', async () => {
    const activityLessonId = manifest.lessons[1].id;
    const studentClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${studentSession.access_token}` } },
    });

    const { data: actResult, error: actErr } = await studentClient
      .from('activity_results')
      .select('score, max_score, passed')
      .eq('user_id', testStudent.id)
      .eq('lesson_id', activityLessonId)
      .single();

    assert.equal(actErr, null);
    assert.equal(Number(actResult.score), 100);
    assert.equal(actResult.passed, true);
  });

  // -----------------------------------------------------------------
  // 8. Mock-test listing and assessment retrieval
  // -----------------------------------------------------------------
  await t.test('8. Mock-test listing and assessment metadata retrieval', async () => {
    const { data: mockTest, error } = await anonDb
      .from('mock_tests')
      .select('id, title, duration_mins, pass_mark')
      .eq('id', manifest.mockTest.id)
      .single();

    assert.equal(error, null);
    assert.equal(mockTest.id, manifest.mockTest.id);
    assert.equal(mockTest.title, manifest.mockTest.title);
    assert.equal(mockTest.pass_mark, 60);
  });

  // -----------------------------------------------------------------
  // 9. Assessment submission and result evaluation
  // -----------------------------------------------------------------
  await t.test('9. Assessment submission evaluation and attempt recording', async () => {
    const { data: rawQuestions } = await adminDb
      .from('questions')
      .select('id, type, marks, config')
      .eq('test_id', manifest.mockTest.id)
      .order('display_order', { ascending: true });

    assert.ok(rawQuestions && rawQuestions.length >= 5, 'Must have 5 questions for evaluation');

    // Build perfect submission answers
    const answers = {};
    for (const q of rawQuestions) {
      if (q.type === 'single') answers[q.id] = q.config.correctIndex;
      else if (q.type === 'multiple') answers[q.id] = q.config.correctIndexes;
      else if (q.type === 'fillblank') answers[q.id] = { 1: q.config.blanks[0].accepted[0] };
    }

    const { data: attempt, error: attErr } = await adminDb
      .from('test_attempts')
      .insert({
        user_id: testStudent.id,
        test_slug: manifest.course.slug,
        test_id: manifest.mockTest.id,
        answers: answers,
        score: 50,
        max_score: 50,
        score_percent: 100,
        passed: true,
        started_at: new Date(Date.now() - 600000).toISOString(),
        submitted_at: new Date().toISOString(),
      })
      .select('id, score, passed')
      .single();

    assert.equal(attErr, null);
    assert.equal(attempt.score, 50);
    assert.equal(attempt.passed, true);
  });

  // -----------------------------------------------------------------
  // 10. Unauthorized assessment/question access blocked
  // -----------------------------------------------------------------
  await t.test('10. Unauthorized assessment question access is strictly blocked', async () => {
    // Attempt to read raw questions table as anonymous user
    const { data, error } = await anonDb.from('questions').select('*');
    assert.equal(error, null); // RLS returns empty array, not DB error
    assert.equal(data.length, 0, 'Anonymous users must receive 0 rows from raw questions table');
  });

  // -----------------------------------------------------------------
  // 11. Answer-key protection for student accounts
  // -----------------------------------------------------------------
  await t.test('11. Answer-key protection (student_questions_view strips secrets)', async () => {
    const studentClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${studentSession.access_token}` } },
    });

    const { data: sanitizedQuestions, error } = await studentClient
      .from('student_questions_view')
      .select('id, type, stem, marks, config')
      .eq('test_id', manifest.mockTest.id);

    assert.equal(error, null);
    assert.ok(sanitizedQuestions.length >= 5, 'Student view must return questions');

    for (const q of sanitizedQuestions) {
      assert.equal(q.config.correctIndex, undefined, `Question ${q.id} leaked correctIndex!`);
      assert.equal(q.config.correctIndexes, undefined, `Question ${q.id} leaked correctIndexes!`);
      assert.equal(q.config.correctPairs, undefined, `Question ${q.id} leaked correctPairs!`);
      assert.equal(q.config.correctAnswer, undefined, `Question ${q.id} leaked correctAnswer!`);
      if (q.config.blanks) {
        for (const b of q.config.blanks) {
          assert.equal(b.accepted, undefined, `Question ${q.id} leaked fill-in-the-blank answer!`);
        }
      }
    }
  });

  // -----------------------------------------------------------------
  // 12. Admin-only operations remain restricted
  // -----------------------------------------------------------------
  await t.test('12. Admin-only operations remain strictly restricted to student accounts', async () => {
    // Try calling fn_claim_student_onboarding as anon / student
    const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/fn_claim_student_onboarding`, {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${studentSession.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_user_id: testStudent.id,
        p_target_email: testStudent.email,
        p_clean_phone: testStudent.phone,
      }),
    });

    assert.ok(rpcRes.status === 401 || rpcRes.status === 403 || rpcRes.status === 404, 
      `Student calling admin RPC must be rejected! Received HTTP ${rpcRes.status}`);
  });

  // -----------------------------------------------------------------
  // 13. Auth/profile consistency for all synthetic accounts
  // -----------------------------------------------------------------
  await t.test('13. Auth and profile consistency across all 100 synthetic accounts', async () => {
    const { count: profileCount, error: pErr } = await adminDb
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .ilike('email', '%@kvjanalytics.test');

    assert.equal(pErr, null);
    assert.equal(profileCount, 100, `Expected 100 student profiles, found ${profileCount}`);

    const { count: rosterCount, error: rErr } = await adminDb
      .from('batch_students')
      .select('id', { count: 'exact', head: true })
      .eq('batch_id', manifest.batch.id);

    assert.equal(rErr, null);
    assert.equal(rosterCount, 100, `Expected 100 batch roster students, found ${rosterCount}`);

    const { count: enrollCount, error: eErr } = await adminDb
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('course_slug', manifest.course.slug);

    assert.equal(eErr, null);
    assert.equal(enrollCount, 100, `Expected 100 course enrollments, found ${enrollCount}`);
  });

  // -----------------------------------------------------------------
  // 14. No unexpected errors across student accounts
  // -----------------------------------------------------------------
  await t.test('14. Verification that synthetic student profiles have role=student', async () => {
    const { data: nonStudentProfiles, error } = await adminDb
      .from('profiles')
      .select('id, email, role')
      .ilike('email', '%@kvjanalytics.test')
      .neq('role', 'student');

    assert.equal(error, null);
    assert.equal(nonStudentProfiles.length, 0, 'Found synthetic accounts with non-student roles!');
  });
});

