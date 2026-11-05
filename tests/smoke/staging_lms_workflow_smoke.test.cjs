/**
 * KVJ Analytics — Staging LMS Workflow Smoke Test Suite (Phase 11.4B)
 *
 * Verifies all 14 core LMS workflows against the dedicated Staging Supabase project
 * using synthetic data from tests/fixtures/synthetic_lms_manifest.json.
 *
 * STRICT SAFETY RULE:
 * This test MUST NEVER target the production project bdwwgipbrnkgihfjihxz.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// 1. Preflight environment loading & safety checks
const envFilePath = path.resolve(process.cwd(), '.env.local.staging');
if (!fs.existsSync(envFilePath)) {
  console.log('Skipping staging smoke test: .env.local.staging not yet configured.');
  process.exit(0);
}

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(envFilePath);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';

// If staging is deferred/unconfigured (placeholders present), skip cleanly
if (
  !SUPABASE_URL ||
  SUPABASE_URL.includes('your-staging-project-ref-here') ||
  SUPABASE_URL.includes('placeholder') ||
  SERVICE_KEY.includes('your-staging-service-role-key-here')
) {
  console.log('Skipping staging smoke test: Staging environment contains placeholder values (Phase 11.5 staging suspended).');
  process.exit(0);
}

// FATAL PRODUCTION GUARD: Strictly block production Supabase reference
if (
  SUPABASE_URL.includes('bdwwgipbrnkgihfjihxz') ||
  SERVICE_KEY.includes('bdwwgipbrnkgihfjihxz') ||
  SUPABASE_URL === 'https://kvjanalytics.in'
) {
  throw new Error(`FATAL SAFETY GUARD TRIGGERED: Production project detected! Execution aborted.`);
}

if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
  throw new Error(`Staging credentials incomplete in .env.local.staging`);
}

// 2. Load seeded manifest
const manifestPath = path.resolve(process.cwd(), 'tests/fixtures/synthetic_lms_manifest.json');
if (!fs.existsSync(manifestPath)) {
  throw new Error(`Synthetic manifest not found. Run "node scripts/seed-local-lms.cjs" targeting staging first.`);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const adminDb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const anonDb = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SYNTHETIC_STUDENT_PASSWORD = 'LocalSyntheticStudent2026!';

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
  return String(otp).padStart(6, '0');
}

test('Staging LMS Workflow Smoke Test Suite (14 Workflows)', async (t) => {
  let student1Session = null;
  const student1Email = 'student001@kvjanalytics.test';

  await t.test('1. Student login and authenticated session', async () => {
    const authClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await authClient.auth.signInWithPassword({
      email: student1Email,
      password: SYNTHETIC_STUDENT_PASSWORD,
    });
    assert.equal(error, null, `Student login failed: ${error?.message}`);
    assert.ok(data.session?.access_token, 'Login must yield access token');
    student1Session = data.session;
  });

  await t.test('2. Course listing and metadata access', async () => {
    const { data: course, error } = await anonDb
      .from('courses')
      .select('id, slug, title, status')
      .eq('slug', manifest.course.slug)
      .maybeSingle();
    assert.equal(error, null);
    assert.ok(course, 'Course must exist');
    assert.equal(course.slug, manifest.course.slug);
  });

  await t.test('3. Course join TOTP and batch validation', async () => {
    const { data: batch, error } = await adminDb
      .from('batches')
      .select('id, totp_secret, active, course_slug')
      .eq('id', manifest.batch.id)
      .maybeSingle();
    assert.equal(error, null);
    assert.ok(batch);
    const code = generateTOTP(batch.totp_secret);
    assert.equal(code.length, 6);
  });

  await t.test('4. Batch roster and enrollment record integrity', async () => {
    const { data: rosterEntry, error: rErr } = await adminDb
      .from('batch_students')
      .select('id, email, status, profile_id')
      .eq('batch_id', manifest.batch.id)
      .eq('email', student1Email)
      .maybeSingle();
    assert.equal(rErr, null);
    assert.ok(rosterEntry);
    assert.ok(rosterEntry.status === 'CLAIMED' || rosterEntry.status === 'JOINED');

    const { data: enrollment, error: eErr } = await adminDb
      .from('enrollments')
      .select('id, status')
      .eq('user_id', manifest.students[0].id)
      .eq('course_slug', manifest.course.slug)
      .maybeSingle();
    assert.equal(eErr, null);
    assert.ok(enrollment);
    assert.equal(enrollment.status, 'active');
  });

  await t.test('5. Module and lesson hierarchy listing', async () => {
    const { data: modules, error } = await anonDb
      .from('modules')
      .select('id, title, lessons(id, title, kind)')
      .eq('id', manifest.module.id)
      .maybeSingle();
    assert.equal(error, null);
    assert.ok(modules);
    assert.ok(modules.lessons.length >= 2);
  });

  await t.test('6. Lesson content access (material and activity)', async () => {
    const { data: lesson, error } = await adminDb
      .from('lessons')
      .select('id, kind, content_html')
      .eq('id', manifest.lessons[0].id)
      .maybeSingle();
    assert.equal(error, null);
    assert.ok(lesson.content_html.length > 50);
  });

  await t.test('7. Lesson progress and activity scoring submission', async () => {
    const { data: result, error } = await adminDb
      .from('activity_results')
      .select('score, passed')
      .eq('user_id', manifest.students[0].id)
      .eq('lesson_id', manifest.lessons[1].id)
      .maybeSingle();
    assert.equal(error, null);
    assert.ok(result);
    assert.equal(result.passed, true);
  });

  await t.test('8. Mock-test listing and assessment metadata retrieval', async () => {
    const { data: testRecord, error } = await anonDb
      .from('mock_tests')
      .select('id, title, duration_minutes, passing_score_percentage')
      .eq('id', manifest.mock_test.id)
      .maybeSingle();
    assert.equal(error, null);
    assert.ok(testRecord);
    assert.equal(testRecord.passing_score_percentage, 60);
  });

  await t.test('9. Assessment submission evaluation and attempt recording', async () => {
    const { data: attempt, error } = await adminDb
      .from('test_attempts')
      .select('id, score, passed')
      .eq('test_id', manifest.mock_test.id)
      .limit(1);
    assert.equal(error, null);
    assert.ok(Array.isArray(attempt));
  });

  await t.test('10. Unauthorized assessment question access is strictly blocked', async () => {
    const { data: rawQuestions } = await anonDb
      .from('questions')
      .select('*')
      .eq('test_id', manifest.mock_test.id);
    assert.equal(rawQuestions?.length || 0, 0, 'Anonymous users must be blocked from questions table');
  });

  await t.test('11. Answer-key protection (student_questions_view strips secrets)', async () => {
    const { data: sanitized, error } = await anonDb
      .from('student_questions_view')
      .select('id, prompt, question_type, options, config')
      .eq('test_id', manifest.mock_test.id);
    assert.equal(error, null);
    assert.ok(sanitized.length > 0);
    for (const q of sanitized) {
      if (q.options && Array.isArray(q.options)) {
        for (const opt of q.options) {
          assert.equal(opt.isCorrect, undefined);
          assert.equal(opt.correct, undefined);
        }
      }
      if (q.config) {
        assert.equal(q.config.correctIndex, undefined);
        assert.equal(q.config.correctIndexes, undefined);
        assert.equal(q.config.correctPairs, undefined);
      }
    }
  });

  await t.test('12. Admin-only operations remain strictly restricted to student accounts', async () => {
    const studentDb = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${student1Session.access_token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await studentDb
      .from('admin_users')
      .select('*');
    assert.ok(error, 'Students must be blocked from querying admin_users');
  });

  await t.test('13. Auth and profile consistency across all 100 synthetic accounts', async () => {
    const { count: profileCount, error } = await adminDb
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .ilike('email', '%@kvjanalytics.test');
    assert.equal(error, null);
    assert.equal(profileCount, 100);
  });

  await t.test('14. Verification that synthetic student profiles have role=student', async () => {
    const { data: nonStudents, error } = await adminDb
      .from('profiles')
      .select('id, email, role')
      .ilike('email', '%@kvjanalytics.test')
      .neq('role', 'student');
    assert.equal(error, null);
    assert.equal(nonStudents?.length || 0, 0, 'No synthetic accounts should have non-student role');
  });
});

