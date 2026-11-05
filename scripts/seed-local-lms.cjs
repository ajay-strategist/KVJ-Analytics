/**
 * KVJ Analytics — Phase 11.1C: Idempotent Local LMS Synthetic Data Seeder
 *
 * PROHIBITIONS & SAFETY:
 * - Strictly local only (target: 127.0.0.1 / localhost)
 * - Aborts immediately if production project id (bdwwgipbrnkgihfjihxz) or .supabase.co is detected
 * - Never prints passwords, JWTs, or secret keys to stdout or logs
 * - Preserves existing records; rerunning is safe and idempotent
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse CLI arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const envFileArg = args.find((a) => a.startsWith('--env-file='));
const envFilePath = envFileArg
  ? path.resolve(process.cwd(), envFileArg.split('=')[1])
  : path.resolve(process.cwd(), '.env.local.test');
const countArg = args.find((a) => a.startsWith('--count='));
const TOTAL_STUDENTS = countArg ? parseInt(countArg.split('=')[1], 10) : 100;

// 1. Load test environment file
if (!fs.existsSync(envFilePath)) {
  console.error(`[FATAL] Specified environment file not found: ${envFilePath}`);
  process.exit(1);
}

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile(envFilePath);
} else {
  const content = fs.readFileSync(envFilePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}

// 2. Strict Production Isolation Guards
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceKey) {
  console.error('[FATAL] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

if (
  supabaseUrl.includes('bdwwgipbrnkgihfjihxz') ||
  supabaseUrl.includes('supabase.co') ||
  (!supabaseUrl.includes('127.0.0.1') && !supabaseUrl.includes('localhost'))
) {
  console.error(`[FATAL CRITICAL BLOCK] Target URL ${supabaseUrl} does NOT point to local Supabase. Execution aborted.`);
  process.exit(1);
}

// Local deterministic password for synthetic students
const SYNTHETIC_STUDENT_PASSWORD = 'LocalSyntheticStudent2026!';
const COURSE_SLUG = 'power-bi';

const adminDb = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { 'x-application-name': 'kvj-lms-seeder-local' } },
});

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  KVJ LMS — IDEMPOTENT SYNTHETIC DATA SEEDER (PHASE 11.1C)');
  console.log(`  Target Endpoint : ${supabaseUrl} [ISOLATED LOCAL HOST]`);
  console.log(`  Execution Mode  : ${isDryRun ? 'DRY RUN (No Writes)' : 'ACTIVE SEED'}`);
  console.log(`  Student Count   : ${TOTAL_STUDENTS}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  const stats = {
    course: { target: 1, created: 0, reused: 0 },
    module: { target: 1, created: 0, reused: 0 },
    lessons: { target: 2, created: 0, reused: 0 },
    batch: { target: 1, created: 0, reused: 0 },
    mockTest: { target: 1, created: 0, reused: 0 },
    questions: { target: 5, created: 0, reused: 0 },
    students: { target: TOTAL_STUDENTS, created: 0, reused: 0 },
    profiles: { target: TOTAL_STUDENTS, created: 0, reused: 0 },
    batchRoster: { target: TOTAL_STUDENTS, created: 0, reused: 0 },
    enrollments: { target: TOTAL_STUDENTS, created: 0, reused: 0 },
    activityResults: { target: 1, created: 0, reused: 0 },
  };

  // -------------------------------------------------------------
  // Step A: Seed / Reuse Course
  // -------------------------------------------------------------
  let courseId = null;
  const { data: existingCourse, error: courseCheckErr } = await adminDb
    .from('courses')
    .select('id, slug, title')
    .eq('slug', COURSE_SLUG)
    .maybeSingle();

  if (courseCheckErr) {
    console.error('[ERROR] Failed to query courses:', courseCheckErr.message);
    process.exit(1);
  }

  if (existingCourse) {
    courseId = existingCourse.id;
    stats.course.reused = 1;
    console.log(`[COURSE] Reused existing course "${existingCourse.title}" (${existingCourse.slug})`);
  } else if (!isDryRun) {
    const { data: newCourse, error: courseInsertErr } = await adminDb
      .from('courses')
      .insert({
        slug: COURSE_SLUG,
        title: 'Power BI Masterclass',
        segment: 'college',
        summary: 'Comprehensive hands-on Power BI training for engineering analytics.',
        introduction: '<p>Master Power BI Desktop, DAX expressions, and data modeling.</p>',
        is_published: true,
        is_locked: false,
        fee_inr: 0,
      })
      .select('id, slug, title')
      .single();

    if (courseInsertErr) {
      console.error('[ERROR] Failed to insert course:', courseInsertErr.message);
      process.exit(1);
    }
    courseId = newCourse.id;
    stats.course.created = 1;
    console.log(`[COURSE] Created course "${newCourse.title}" (${newCourse.slug})`);
  } else {
    stats.course.created = 1;
    console.log(`[COURSE] [DRY-RUN] Would create course "${COURSE_SLUG}"`);
    courseId = '00000000-0000-0000-0000-000000000001';
  }

  // -------------------------------------------------------------
  // Step B: Seed / Reuse Module
  // -------------------------------------------------------------
  let moduleId = null;
  const { data: existingModule } = await adminDb
    .from('modules')
    .select('id, title')
    .eq('course_id', courseId)
    .eq('title', 'Power BI Core & Modeling')
    .maybeSingle();

  if (existingModule) {
    moduleId = existingModule.id;
    stats.module.reused = 1;
    console.log(`[MODULE] Reused module "${existingModule.title}"`);
  } else if (!isDryRun) {
    const { data: newModule, error: modErr } = await adminDb
      .from('modules')
      .insert({
        course_id: courseId,
        title: 'Power BI Core & Modeling',
        display_order: 1,
      })
      .select('id, title')
      .single();

    if (modErr) {
      console.error('[ERROR] Failed to insert module:', modErr.message);
      process.exit(1);
    }
    moduleId = newModule.id;
    stats.module.created = 1;
    console.log(`[MODULE] Created module "${newModule.title}"`);
  } else {
    stats.module.created = 1;
    console.log(`[MODULE] [DRY-RUN] Would create module for course ${courseId}`);
    moduleId = '00000000-0000-0000-0000-000000000002';
  }

  // -------------------------------------------------------------
  // Step C: Seed / Reuse Lessons (Material + Activity)
  // -------------------------------------------------------------
  const lessonDefinitions = [
    {
      title: 'Power BI Desktop Setup & Architecture',
      kind: 'material',
      is_preview: false,
      content_html: '<h3>Power BI Architecture</h3><p>Power BI Desktop connects data sources and VertiPaq engine.</p>',
      display_order: 1,
      max_score: null,
    },
    {
      title: 'DAX Calculations Simulation & Interactive Lab',
      kind: 'activity',
      is_preview: false,
      content_html: '<h3>Interactive DAX Lab</h3><p>Complete the measures simulation to earn credit.</p>',
      display_order: 2,
      max_score: 100,
    },
  ];

  const seededLessons = [];
  for (const lDef of lessonDefinitions) {
    const { data: existingLesson } = await adminDb
      .from('lessons')
      .select('id, title, kind')
      .eq('module_id', moduleId)
      .eq('title', lDef.title)
      .maybeSingle();

    if (existingLesson) {
      seededLessons.push(existingLesson);
      stats.lessons.reused++;
      console.log(`[LESSON] Reused lesson "${existingLesson.title}" (${existingLesson.kind})`);
    } else if (!isDryRun) {
      const { data: newLesson, error: lErr } = await adminDb
        .from('lessons')
        .insert({
          module_id: moduleId,
          title: lDef.title,
          kind: lDef.kind,
          is_preview: lDef.is_preview,
          content_html: lDef.content_html,
          display_order: lDef.display_order,
          max_score: lDef.max_score,
        })
        .select('id, title, kind')
        .single();

      if (lErr) {
        console.error('[ERROR] Failed to insert lesson:', lErr.message);
        process.exit(1);
      }
      seededLessons.push(newLesson);
      stats.lessons.created++;
      console.log(`[LESSON] Created lesson "${newLesson.title}" (${newLesson.kind})`);
    } else {
      stats.lessons.created++;
      seededLessons.push({ id: `00000000-0000-0000-0000-00000000000${seededLessons.length + 3}`, ...lDef });
      console.log(`[LESSON] [DRY-RUN] Would create lesson "${lDef.title}"`);
    }
  }

  // -------------------------------------------------------------
  // Step D: Seed / Reuse Batch (for TOTP Classroom Join)
  // -------------------------------------------------------------
  let batchId = null;
  const BATCH_COLLEGE = 'KVJ Engineering Institute';
  const BATCH_SECRET = 'JBSWY3DPEHPK3PXP'; // Base32 test secret

  const { data: existingBatch } = await adminDb
    .from('batches')
    .select('id, college_name, course_slug, active')
    .eq('course_slug', COURSE_SLUG)
    .eq('college_name', BATCH_COLLEGE)
    .maybeSingle();

  if (existingBatch) {
    batchId = existingBatch.id;
    stats.batch.reused = 1;
    console.log(`[BATCH] Reused batch for "${existingBatch.college_name}" (${batchId})`);
  } else if (!isDryRun) {
    const validFrom = new Date(Date.now() - 7 * 86400 * 1000).toISOString();
    const validTo = new Date(Date.now() + 365 * 86400 * 1000).toISOString();

    const { data: newBatch, error: bErr } = await adminDb
      .from('batches')
      .insert({
        college_name: BATCH_COLLEGE,
        course_slug: COURSE_SLUG,
        totp_secret: BATCH_SECRET,
        valid_from: validFrom,
        valid_to: validTo,
        active: true,
      })
      .select('id, college_name, course_slug')
      .single();

    if (bErr) {
      console.error('[ERROR] Failed to insert batch:', bErr.message);
      process.exit(1);
    }
    batchId = newBatch.id;
    stats.batch.created = 1;
    console.log(`[BATCH] Created batch for "${newBatch.college_name}" (${batchId})`);
  } else {
    stats.batch.created = 1;
    batchId = '00000000-0000-0000-0000-000000000010';
    console.log(`[BATCH] [DRY-RUN] Would create batch for "${BATCH_COLLEGE}"`);
  }

  // -------------------------------------------------------------
  // Step E: Seed / Reuse Mock Test
  // -------------------------------------------------------------
  let mockTestId = null;
  const TEST_TITLE = 'Power BI Certification Practice Exam';
  const { data: existingTest } = await adminDb
    .from('mock_tests')
    .select('id, title, course_id')
    .eq('course_id', courseId)
    .eq('title', TEST_TITLE)
    .maybeSingle();

  if (existingTest) {
    mockTestId = existingTest.id;
    stats.mockTest.reused = 1;
    console.log(`[TEST] Reused mock test "${existingTest.title}" (${mockTestId})`);
  } else if (!isDryRun) {
    const { data: newTest, error: tErr } = await adminDb
      .from('mock_tests')
      .insert({
        course_id: courseId,
        module_id: moduleId,
        lesson_id: seededLessons[1]?.id || null,
        title: TEST_TITLE,
        duration_mins: 30,
        pass_mark: 60,
        publish_results: true,
        randomize_options: false,
        negative_marking: false,
      })
      .select('id, title')
      .single();

    if (tErr) {
      console.error('[ERROR] Failed to insert mock test:', tErr.message);
      process.exit(1);
    }
    mockTestId = newTest.id;
    stats.mockTest.created = 1;
    console.log(`[TEST] Created mock test "${newTest.title}" (${mockTestId})`);
  } else {
    stats.mockTest.created = 1;
    mockTestId = '00000000-0000-0000-0000-000000000020';
    console.log(`[TEST] [DRY-RUN] Would create mock test "${TEST_TITLE}"`);
  }

  // -------------------------------------------------------------
  // Step F: Seed / Reuse 5 Assessment Questions
  // -------------------------------------------------------------
  const questionsDefinition = [
    {
      type: 'single',
      stem: 'What DAX function returns a single-column table of unique values from a column?',
      marks: 10,
      display_order: 1,
      config: {
        options: ['VALUES', 'RELATED', 'FILTER', 'CALCULATE'],
        correctIndex: 0,
      },
    },
    {
      type: 'single',
      stem: 'Which storage mode in Power BI keeps all data cached in-memory using VertiPaq compression?',
      marks: 10,
      display_order: 2,
      config: {
        options: ['DirectQuery', 'Import', 'Dual', 'Live Connection'],
        correctIndex: 1,
      },
    },
    {
      type: 'multiple',
      stem: 'Which of the following are valid relationship cardinalities in Power BI Desktop data modeling?',
      marks: 10,
      display_order: 3,
      config: {
        options: ['One-to-Many', 'Many-to-One', 'One-to-One', 'Many-to-Many'],
        correctIndexes: [0, 1, 2, 3],
      },
    },
    {
      type: 'single',
      stem: 'What is the primary role of the CALCULATE function in DAX?',
      marks: 10,
      display_order: 4,
      config: {
        options: [
          'Evaluates an expression in a modified filter context',
          'Sums all numeric columns across all tables',
          'Creates a calculated table only without modifying filters',
          'Deletes duplicate rows in fact tables',
        ],
        correctIndex: 0,
      },
    },
    {
      type: 'fillblank',
      stem: 'In Power BI DAX calculations, an explicit measure is always evaluated within the current [filter] context.',
      marks: 10,
      display_order: 5,
      config: {
        blanks: [{ id: '1', accepted: ['filter', 'filter context'] }],
      },
    },
  ];

  const { data: existingQuestions } = await adminDb
    .from('questions')
    .select('id, type, display_order')
    .eq('test_id', mockTestId);

  if (existingQuestions && existingQuestions.length >= questionsDefinition.length) {
    stats.questions.reused = existingQuestions.length;
    console.log(`[QUESTIONS] Reused ${existingQuestions.length} existing assessment questions`);
  } else if (!isDryRun) {
    const toInsert = questionsDefinition.map((q) => ({
      test_id: mockTestId,
      type: q.type,
      stem: q.stem,
      marks: q.marks,
      display_order: q.display_order,
      config: q.config,
    }));

    const { data: insertedQ, error: qErr } = await adminDb
      .from('questions')
      .insert(toInsert)
      .select('id, type');

    if (qErr) {
      console.error('[ERROR] Failed to insert questions:', qErr.message);
      process.exit(1);
    }
    stats.questions.created = insertedQ.length;
    console.log(`[QUESTIONS] Created ${insertedQ.length} assessment questions`);
  } else {
    stats.questions.created = questionsDefinition.length;
    console.log(`[QUESTIONS] [DRY-RUN] Would create ${questionsDefinition.length} assessment questions`);
  }

  // -------------------------------------------------------------
  // Step G: Seed / Reuse 100 Synthetic Students
  // -------------------------------------------------------------
  console.log(`\n[STUDENTS] Synchronizing ${TOTAL_STUDENTS} synthetic students...`);

  // Fast pre-fetch existing auth users via admin API
  const existingUsersMap = new Map();
  try {
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const { data: uPage, error: pErr } = await adminDb.auth.admin.listUsers({ page, perPage: 200 });
      if (pErr || !uPage || !uPage.users || uPage.users.length === 0) {
        hasMore = false;
        break;
      }
      for (const u of uPage.users) {
        if (u.email) {
          existingUsersMap.set(u.email.toLowerCase(), u);
        }
      }
      if (uPage.users.length < 200) hasMore = false;
      else page++;
    }
  } catch (err) {
    console.warn('[WARN] listUsers pagination failed, fallback to individual checks:', err.message);
  }

  const seededStudentsManifest = [];

  for (let i = 1; i <= TOTAL_STUDENTS; i++) {
    const pad = String(i).padStart(3, '0');
    const email = `student${pad}@kvjanalytics.test`;
    const fullName = `Synthetic Student ${pad}`;
    const phone = `91980000${String(i).padStart(4, '0')}`;

    let userId = null;
    const existingAuth = existingUsersMap.get(email);

    if (existingAuth) {
      userId = existingAuth.id;
      stats.students.reused++;
    } else if (!isDryRun) {
      const { data: createdUser, error: authErr } = await adminDb.auth.admin.createUser({
        email,
        password: SYNTHETIC_STUDENT_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: fullName, phone },
      });

      if (authErr) {
        console.error(`[ERROR] Failed to create auth user ${email}:`, authErr.message);
        continue;
      }
      userId = createdUser.user.id;
      stats.students.created++;
    } else {
      userId = `00000000-0000-0000-0001-${String(i).padStart(12, '0')}`;
      stats.students.created++;
    }

    if (!isDryRun && userId) {
      // 1. Ensure Profile exists and is synced
      const { data: prof, error: profErr } = await adminDb
        .from('profiles')
        .select('id, role')
        .eq('id', userId)
        .maybeSingle();

      if (!prof) {
        await adminDb.from('profiles').insert({
          id: userId,
          name: fullName,
          full_name: fullName,
          email,
          phone,
          role: 'student',
          account_type: 'college',
          profession: 'student',
        });
        stats.profiles.created++;
      } else {
        stats.profiles.reused++;
      }

      // 2. Ensure Batch Student Roster Entry
      const { data: bStudent } = await adminDb
        .from('batch_students')
        .select('id, status, profile_id')
        .eq('batch_id', batchId)
        .eq('email', email)
        .maybeSingle();

      if (!bStudent) {
        await adminDb.from('batch_students').insert({
          batch_id: batchId,
          name: fullName,
          email,
          phone,
          status: 'CLAIMED',
          profile_id: userId,
        });
        stats.batchRoster.created++;
      } else {
        if (bStudent.profile_id !== userId || bStudent.status !== 'CLAIMED') {
          await adminDb
            .from('batch_students')
            .update({ profile_id: userId, status: 'CLAIMED' })
            .eq('id', bStudent.id);
        }
        stats.batchRoster.reused++;
      }

      // 3. Ensure Course Enrollment
      const { data: enrollment } = await adminDb
        .from('enrollments')
        .select('id, status')
        .eq('user_id', userId)
        .eq('course_slug', COURSE_SLUG)
        .maybeSingle();

      if (!enrollment) {
        await adminDb.from('enrollments').insert({
          user_id: userId,
          course_slug: COURSE_SLUG,
          enrollment_method: 'college_code',
          status: 'active',
        });
        stats.enrollments.created++;
      } else {
        stats.enrollments.reused++;
      }
    } else {
      stats.profiles.created++;
      stats.batchRoster.created++;
      stats.enrollments.created++;
    }

    seededStudentsManifest.push({
      id: userId,
      email,
      name: fullName,
      phone,
    });
  }

  // -------------------------------------------------------------
  // Step H: Seed Baseline Activity Result for student001
  // -------------------------------------------------------------
  if (!isDryRun && seededStudentsManifest[0] && seededLessons[1]) {
    const student1Id = seededStudentsManifest[0].id;
    const lesson2Id = seededLessons[1].id;

    const { data: existingAct } = await adminDb
      .from('activity_results')
      .select('id')
      .eq('user_id', student1Id)
      .eq('lesson_id', lesson2Id)
      .maybeSingle();

    if (existingAct) {
      stats.activityResults.reused = 1;
    } else {
      const { error: actErr } = await adminDb.from('activity_results').insert({
        user_id: student1Id,
        lesson_id: lesson2Id,
        course_slug: COURSE_SLUG,
        score: 100,
        max_score: 100,
        score_percent: 100,
        passed: true,
      });
      if (!actErr) {
        stats.activityResults.created = 1;
      }
    }
  }

  // -------------------------------------------------------------
  // Step I: Export Non-Sensitive Manifest File
  // -------------------------------------------------------------
  const manifest = {
    generatedAt: new Date().toISOString(),
    environment: 'local-isolated-colima',
    course: { id: courseId, slug: COURSE_SLUG, title: 'Power BI Masterclass' },
    module: { id: moduleId, title: 'Power BI Core & Modeling' },
    lessons: seededLessons.map((l) => ({ id: l.id, title: l.title, kind: l.kind })),
    batch: { id: batchId, college_name: BATCH_COLLEGE, course_slug: COURSE_SLUG },
    mockTest: { id: mockTestId, title: TEST_TITLE, duration_mins: 30, pass_mark: 60 },
    questionCount: stats.questions.created + stats.questions.reused,
    studentCount: seededStudentsManifest.length,
    students: seededStudentsManifest,
  };

  const manifestPath = path.resolve(process.cwd(), 'tests/fixtures/synthetic_lms_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n[MANIFEST] Saved non-sensitive manifest to: ${manifestPath}`);

  // Print Summary Table
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  SYNTHETIC DATA SEED EXECUTION SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.table({
    Course: { Target: stats.course.target, Created: stats.course.created, Reused: stats.course.reused },
    Module: { Target: stats.module.target, Created: stats.module.created, Reused: stats.module.reused },
    Lessons: { Target: stats.lessons.target, Created: stats.lessons.created, Reused: stats.lessons.reused },
    Batch: { Target: stats.batch.target, Created: stats.batch.created, Reused: stats.batch.reused },
    MockTest: { Target: stats.mockTest.target, Created: stats.mockTest.created, Reused: stats.mockTest.reused },
    Questions: { Target: stats.questions.target, Created: stats.questions.created, Reused: stats.questions.reused },
    AuthStudents: { Target: stats.students.target, Created: stats.students.created, Reused: stats.students.reused },
    Profiles: { Target: stats.profiles.target, Created: stats.profiles.created, Reused: stats.profiles.reused },
    BatchRoster: { Target: stats.batchRoster.target, Created: stats.batchRoster.created, Reused: stats.batchRoster.reused },
    Enrollments: { Target: stats.enrollments.target, Created: stats.enrollments.created, Reused: stats.enrollments.reused },
    ActivityResult: { Target: stats.activityResults.target, Created: stats.activityResults.created, Reused: stats.activityResults.reused },
  });
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('[FATAL EXCEPTION]', err);
  process.exit(1);
});

