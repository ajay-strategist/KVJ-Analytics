import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { SharedArray } from 'k6/data';

// Load test user pool (100 dedicated student test accounts)
const testUsers = new SharedArray('student_test_users', function () {
  try {
    return JSON.parse(open('../fixtures/local_synthetic_students.json'));
  } catch (e1) {
    try {
      return JSON.parse(open('../../dummy_users_100.json'));
    } catch (e2) {
      // Fallback generated user array if json file is unavailable
      const fallback = [];
      for (let i = 1; i <= 100; i++) {
        const pad = String(i).padStart(3, '0');
        fallback.push({
          index: i,
          email: `student${pad}@kvjanalytics.test`,
          password: 'LocalSyntheticStudent2026!',
        });
      }
      return fallback;
    }
  }
});

const BASE_URL = __ENV.BASE_URL;

// ============================================================================
// STRICT SAFETY GUARDRAIL: Prevent accidental execution against production
// ============================================================================
if (!BASE_URL) {
  throw new Error(
    "SAFETY GUARD TRIGGERED: BASE_URL environment variable is required (e.g., -e BASE_URL=https://staging.kvjanalytics.in). Blind fallback to localhost or production is strictly blocked."
  );
}

// Strictly disallow production domains and aliases
const normalizedUrl = BASE_URL.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

const isProductionDomain = 
  normalizedUrl === 'kvjanalytics.in' ||
  normalizedUrl === 'www.kvjanalytics.in' ||
  normalizedUrl === 'kvj-analytics.vercel.app';

if (isProductionDomain) {
  throw new Error(
    `FATAL SAFETY VIOLATION: Production domain detected in BASE_URL (${BASE_URL})! Load testing against production is strictly prohibited.`
  );
}

// Ensure generic kvjanalytics.in domains are strictly staging/preview
if (
  normalizedUrl.includes("kvjanalytics.in") &&
  !normalizedUrl.includes("staging") &&
  !normalizedUrl.includes("preview")
) {
  throw new Error(
    `FATAL SAFETY VIOLATION: Unapproved production hostname detected in BASE_URL (${BASE_URL})! Must use staging or preview.`
  );
}

// Block production Supabase project ref
if (BASE_URL.includes("bdwwgipbrnkgihfjihxz")) {
  throw new Error(
    "FATAL SAFETY VIOLATION: Production Supabase reference (bdwwgipbrnkgihfjihxz) detected! Execution aborted to protect live student data."
  );
}

// If testing against localhost, require explicit confirmation flag
if ((normalizedUrl.includes("localhost") || normalizedUrl.includes("127.0.0.1")) && __ENV.ALLOW_LOCAL !== "true") {
  throw new Error(
    "SAFETY GUARD: Localhost detected. To run against localhost, pass -e ALLOW_LOCAL=true after verifying .env.local does NOT point to production Supabase."
  );
}

export const options = {
  scenarios: {
    classroom_ramp_up: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 }, // Scenario 1: 20 VUs (Standard Classroom Batch)
        { duration: '1m', target: 20 },
        { duration: '30s', target: 40 }, // Scenario 2: 40 VUs (Combined Batch)
        { duration: '1m', target: 40 },
        { duration: '30s', target: 80 }, // Scenario 3: 80 VUs (Peak Classroom Surge)
        { duration: '2m', target: 80 },
        { duration: '30s', target: 0 },  // Cool down
      ],
      gracefulRampDown: '15s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],        // Less than 1% errors
    http_req_duration: ['p(95)<500', 'p(99)<1500'], // 95% of requests under 500ms
  },
};

/**
 * Setup lifecycle function: runs ONCE before all VUs start.
 * Discovers the active syllabus, lesson ID, and test ID dynamically
 * to ensure VUs benchmark real backend processing rather than 404 fast paths.
 */
export function setup() {
  const envLessonId = __ENV.TEST_LESSON_ID;
  const envExamId = __ENV.TEST_EXAM_ID;
  let dynamicLessonId = envLessonId || null;
  let dynamicExamId = envExamId || null;

  try {
    const res = http.get(`${BASE_URL}/training/power-bi/learn`);
    if (res.status === 200 && res.body) {
      if (!dynamicLessonId) {
        const lessonMatch = res.body.match(/lesson=([a-f0-9\-]{36})/i) || res.body.match(/data-lesson-id="([a-f0-9\-]{36})"/i);
        if (lessonMatch && lessonMatch[1]) {
          dynamicLessonId = lessonMatch[1];
        }
      }
      if (!dynamicExamId) {
        const testMatch = res.body.match(/test=([a-f0-9\-]{36})/i) || res.body.match(/data-test-id="([a-f0-9\-]{36})"/i);
        if (testMatch && testMatch[1]) {
          dynamicExamId = testMatch[1];
        }
      }
    }
  } catch (e) {
    // Keep defaults if discovery fails
  }

  if (!dynamicLessonId) {
    dynamicLessonId = 'ad2aba74-1f78-45a8-b83e-9613452b4dae';
  }

  // TEST-01: Real mock test ID is strictly required to benchmark genuine evaluation instead of 404 fast paths
  if (!dynamicExamId) {
    throw new Error(
      'LOAD TEST SETUP ABORTED: No valid exam ID could be discovered from curriculum or passed via TEST_EXAM_ID. ' +
      'A real mock test ID is strictly required so 80 VUs benchmark genuine assessment evaluation rather than 404 fast-paths.'
    );
  }

  return {
    lessonId: dynamicLessonId,
    examId: dynamicExamId,
  };
}

export default function (data) {
  // Distribute one unique student account per virtual user execution
  const userIndex = (__VU - 1) % testUsers.length;
  const student = testUsers[userIndex];

  // Strictly enforce synthetic user identity check
  if (!student.email || !student.email.endsWith('@kvjanalytics.test')) {
    throw new Error(`SAFETY VIOLATION: Non-synthetic student account detected (${student.email})! Execution halted.`);
  }

  const lessonId = data.lessonId;
  const examId = data.examId;

  let authToken = null;
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  group('01_Student_Authentication', function () {
    const loginPayload = JSON.stringify({
      identifier: student.email,
      password: student.password,
    });

    const res = http.post(`${BASE_URL}/api/auth/login`, loginPayload, params);
    
    // Strict assertion: Authentication MUST succeed with HTTP 200
    const pass = check(res, {
      'login status 200': (r) => r.status === 200,
      'valid session returned': (r) => {
        try {
          const body = JSON.parse(r.body);
          return !!(body.session?.access_token || body.token);
        } catch {
          return false;
        }
      },
    });

    if (res.status === 200) {
      try {
        const body = JSON.parse(res.body);
        authToken = body.session?.access_token || body.token || (res.cookies && res.cookies['sb-access-token'] ? res.cookies['sb-access-token'][0].value : null);
      } catch (e) {
        authToken = student.token;
      }
    }
  });

  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken ? `Bearer ${authToken}` : '',
    },
  };

  sleep(1);

  group('02_Student_Session_Validation', function () {
    const res = http.get(`${BASE_URL}/api/test-session?user=${student.index}`, authHeaders);
    // test-session returns 302/307 redirect with session cookie or 200
    check(res, {
      'session check handled (200 or redirect)': (r) => r.status === 200 || r.status === 302 || r.status === 307,
    });
  });

  group('03_Course_Access_And_Batches', function () {
    // Send valid payload matching the full API contract: name, email, organization, code
    const joinPayload = JSON.stringify({
      name: `Student ${student.index}`,
      email: student.email,
      organization: "KVJ Test Academy",
      code: "STAGING_DEMO",
    });

    const res = http.post(
      `${BASE_URL}/api/courses/power-bi/join`,
      joinPayload,
      Object.assign({}, authHeaders, { responseCallback: http.expectedStatuses(200, 409) })
    );
    
    // TEST-02: Strict assertion: must respond with successful enrollment (200 OK or 409 Already Enrolled)
    // Invalid codes or system failures must fail the load test.
    check(res, {
      'course join success (200 or 409)': (r) => r.status === 200 || r.status === 409,
      'response is valid JSON': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.success === true || r.status === 409;
        } catch {
          return false;
        }
      },
    });
  });

  sleep(1);

  group('04_Curriculum_Player_Page', function () {
    const res = http.get(`${BASE_URL}/training/power-bi/learn`, authHeaders);
    check(res, {
      'curriculum page status 200': (r) => r.status === 200,
      'curriculum HTML body returned': (r) => r.body && r.body.length > 500,
    });
  });

  group('05_Lesson_HTML_Delivery', function () {
    const res = http.get(`${BASE_URL}/api/lessons/${lessonId}?courseSlug=power-bi`, authHeaders);
    check(res, {
      'lesson fetch status 200': (r) => r.status === 200,
      'lesson content payload returned': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.id && body.content_html !== undefined;
        } catch {
          return false;
        }
      },
    });
  });

  sleep(2);

  group('06_Interactive_Simulation_Activity', function () {
    const activityPayload = JSON.stringify({
      lessonId: lessonId,
      courseSlug: 'power-bi',
      score: 10,
      maxScore: 10,
    });

    const res = http.post(`${BASE_URL}/api/activity-result`, activityPayload, authHeaders);
    check(res, {
      'activity submission status 200': (r) => r.status === 200,
      'activity result saved': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.success === true && body.result !== undefined;
        } catch {
          return false;
        }
      },
    });
  });

  group('07_Course_Materials_Retrieval', function () {
    const res = http.get(
      `${BASE_URL}/api/materials/${lessonId}`,
      Object.assign({}, authHeaders, { responseCallback: http.expectedStatuses(200, 302, 404) })
    );
    check(res, {
      'materials fetch handled (200, 302, or 404)': (r) => r.status === 200 || r.status === 302 || r.status === 404,
    });
  });

  sleep(1);

  group('08_Mock_Test_Questions_Delivery', function () {
    const res = http.get(`${BASE_URL}/api/tests/${examId}`, authHeaders);
    check(res, {
      'test fetch status 200': (r) => r.status === 200,
      'test questions delivery valid': (r) => {
        try {
          const body = JSON.parse(r.body);
          const qList = body.questions || body.test?.questions;
          return Array.isArray(qList) && qList.length > 0;
        } catch {
          return false;
        }
      },
    });
  });

  group('09_Assessment_Submission_Evaluation', function () {
    const examPayload = JSON.stringify({
      answers: {
        'q-1': 1,
        'q-2': [0, 2],
      },
      startedAt: new Date(Date.now() - 120000).toISOString(),
      timeTaken: 120,
    });

    const res = http.post(`${BASE_URL}/api/tests/${examId}`, examPayload, authHeaders);
    check(res, {
      'exam submission status 200': (r) => r.status === 200,
      'exam evaluation contract valid': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.success === true && typeof body.score === 'number';
        } catch {
          return false;
        }
      },
    });
  });

  sleep(1);
}

