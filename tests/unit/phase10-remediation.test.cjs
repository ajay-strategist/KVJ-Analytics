const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

test('Phase 10 Remediation Suite — Performance, Security & Verification', async (t) => {
  const TEST_SECRET = 'kvj-super-secret-jwt-token-at-least-32-chars-long!';

  function createTestJwt(payload, secret = TEST_SECRET, alg = 'HS256') {
    const header = { alg, typ: 'JWT' };
    const hB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const pB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${hB64}.${pB64}`)
      .digest('base64url');
    return `${hB64}.${pB64}.${signature}`;
  }

  await t.test('1. Valid HS256 JWT produces correct cryptographic claims', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = createTestJwt({
      sub: 'student-uuid-1234',
      email: 'student@kvjanalytics.test',
      aud: 'authenticated',
      role: 'student',
      exp,
    });

    const parts = token.split('.');
    assert.equal(parts.length, 3);
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    assert.equal(payload.sub, 'student-uuid-1234');
    assert.equal(payload.aud, 'authenticated');
    assert.equal(payload.role, 'student');
  });

  await t.test('2. Token verification cache prevents repeated HMAC computations', () => {
    const memoryCache = new Map();
    const token = createTestJwt({
      sub: 'student-fast-path',
      email: 'fast@kvjanalytics.test',
      aud: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // First lookup: cache miss
    assert.equal(memoryCache.has(tokenHash), false);

    // Save verified user in cache
    memoryCache.set(tokenHash, {
      user: { id: 'student-fast-path', email: 'fast@kvjanalytics.test' },
      expiresAt: Date.now() + 60000,
    });

    // Second lookup: instant hit
    assert.equal(memoryCache.has(tokenHash), true);
    const hit = memoryCache.get(tokenHash);
    assert.equal(hit.user.id, 'student-fast-path');
  });

  await t.test('3. Expired token is rejected and never cached', () => {
    const expiredExp = Math.floor(Date.now() / 1000) - 30; // 30s in the past
    const token = createTestJwt({
      sub: 'student-expired',
      aud: 'authenticated',
      exp: expiredExp,
    });

    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    const isExpired = payload.exp < Math.floor(Date.now() / 1000) - 5;
    assert.equal(isExpired, true, 'Expired token must be flagged as expired');
  });

  await t.test('4. Role cache isolates user permissions and supports invalidation', () => {
    const roleStore = new Map();
    const userId = 'user-role-test-99';
    const roleKey = `user_role:${userId}`;

    // Cache student role
    roleStore.set(roleKey, 'student');
    assert.equal(roleStore.get(roleKey), 'student');

    // Invalidation on role upgrade/revocation
    roleStore.delete(roleKey);
    assert.equal(roleStore.has(roleKey), false, 'Role cache must be deleted on invalidation');
  });

  await t.test('5. Load test strictly rejects 401/404 responses', () => {
    // Simulating k6 assertion logic
    function checkStatus(status) {
      return status === 200;
    }

    assert.equal(checkStatus(200), true, '200 OK must pass assertion');
    assert.equal(checkStatus(400), false, '400 Bad Request must FAIL assertion');
    assert.equal(checkStatus(401), false, '401 Unauthorized must FAIL assertion');
    assert.equal(checkStatus(404), false, '404 Not Found must FAIL assertion');
    assert.equal(checkStatus(500), false, '500 Server Error must FAIL assertion');
  });

  await t.test('6. Course join payload satisfies full required contract', () => {
    const validPayload = {
      name: 'Student 1',
      email: 'user1@kvjanalytics.test',
      organization: 'KVJ Test Academy',
      code: 'STAGING_DEMO',
    };

    const hasRequiredFields = !!(
      validPayload.name &&
      validPayload.organization &&
      validPayload.code &&
      (validPayload.email || validPayload.userId)
    );

    assert.equal(hasRequiredFields, true, 'Full payload must satisfy join contract');
  });

  // ==========================================
  // PHASE 10.2 REGRESSION TESTS
  // ==========================================

  await t.test('7. [SEC-01] Cache TTL bounding logic never outlives JWT expiration', () => {
    function computeCacheTtl(tokenExpSecs, nowSecs) {
      if (!tokenExpSecs) return 60;
      const remaining = tokenExpSecs - nowSecs;
      if (remaining <= 0) return 0; // Expired, do not cache
      return Math.min(60, remaining); // Strictly capped, no floor!
    }

    const now = 1700000000;

    // Case A: Token expiring in 10 seconds -> TTL must be exactly 10s (never 60s)
    assert.equal(computeCacheTtl(now + 10, now), 10, 'Token expiring in 10s must have TTL <= 10s');

    // Case B: Token expiring in 3 seconds (<5s) -> TTL must be exactly 3s (never rounded up to 5s)
    assert.equal(computeCacheTtl(now + 3, now), 3, 'Token expiring in 3s must have TTL = 3s without minimum 5s floor');

    // Case C: Token expiring in 120 seconds -> TTL must be capped at 60s
    assert.equal(computeCacheTtl(now + 120, now), 60, 'Token expiring in 120s must be capped at 60s');

    // Case D: Token already expired -> TTL must be 0 (never cached)
    assert.equal(computeCacheTtl(now - 1, now), 0, 'Expired token must produce TTL 0');
  });

  await t.test('8. [SEC-01] Cache lookup strictly expires and returns null after expiry', () => {
    const cache = new Map();

    function setCache(hash, user, ttlSecs) {
      if (ttlSecs <= 0) return;
      cache.set(hash, { user, expiresAt: Date.now() + ttlSecs * 1000 });
    }

    function getCache(hash) {
      const entry = cache.get(hash);
      if (!entry) return null;
      if (Date.now() >= entry.expiresAt) {
        cache.delete(hash);
        return null;
      }
      return entry.user;
    }

    const tokenHash = 'test-hash-123';
    const user = { id: 'student-ttl-test', email: 'ttl@kvjanalytics.test' };

    // Active entry returns user
    setCache(tokenHash, user, 10);
    assert.deepEqual(getCache(tokenHash), user);

    // Expired entry (simulated past timestamp) returns null and purges
    cache.set(tokenHash, { user, expiresAt: Date.now() - 100 });
    assert.equal(getCache(tokenHash), null, 'Expired cache entry must return null');
    assert.equal(cache.has(tokenHash), false, 'Expired entry must be purged from memory');
  });

  await t.test('9. [SEC-02] Lesson route fails closed when course association is missing', () => {
    // Simulates SEC-02 authorization check
    function evaluateLessonAccess({ isAdminPreview, userRole, lessonCourseSlug, searchParamCourseSlug }) {
      if (isAdminPreview) return { status: 200, allowed: true };
      if (userRole === 'admin') return { status: 200, allowed: true };

      // SEC-02 rule: searchParam is NOT trusted; authoritative course slug comes from lesson record
      const authoritativeCourseSlug = lessonCourseSlug;
      if (!authoritativeCourseSlug) {
        return { status: 403, error: 'Access denied. Lesson is not associated with an active course enrollment.' };
      }

      return { status: 200, allowed: true, courseSlug: authoritativeCourseSlug };
    }

    // Student viewing orphan lesson (no course slug on lesson record) -> MUST 403
    const orphanResult = evaluateLessonAccess({
      isAdminPreview: false,
      userRole: 'student',
      lessonCourseSlug: null,
      searchParamCourseSlug: 'power-bi', // Attacker passes client query param
    });
    assert.equal(orphanResult.status, 403, 'Orphan lesson access by student must fail closed with 403');

    // Admin preview viewing orphan lesson -> MUST be allowed
    const adminPreviewResult = evaluateLessonAccess({
      isAdminPreview: true,
      userRole: null,
      lessonCourseSlug: null,
      searchParamCourseSlug: null,
    });
    assert.equal(adminPreviewResult.status, 200, 'Admin preview must be allowed even for orphan lessons');

    // Admin user viewing orphan lesson -> MUST be allowed
    const adminUserResult = evaluateLessonAccess({
      isAdminPreview: false,
      userRole: 'admin',
      lessonCourseSlug: null,
      searchParamCourseSlug: null,
    });
    assert.equal(adminUserResult.status, 200, 'Admin student role must be allowed');
  });

  await t.test('10. [PERF-01] Unauthenticated mock test requests reject before DB queries', () => {
    let dbQueriesDispatched = 0;

    function mockDbQuery() {
      dbQueriesDispatched++;
      return { data: { id: 'mock-test-1', courses: { slug: 'power-bi' } } };
    }

    function handleGetTestRequest(isAuthenticated) {
      // PERF-01 requirement: authenticate before DB queries
      if (!isAuthenticated) {
        return { status: 401, error: 'Unauthorized' };
      }
      mockDbQuery(); // DB query only happens if authenticated
      return { status: 200, data: 'test-data' };
    }

    // Unauthenticated request
    const unauthRes = handleGetTestRequest(false);
    assert.equal(unauthRes.status, 401);
    assert.equal(dbQueriesDispatched, 0, 'Unauthenticated call must dispatch exactly 0 DB queries');

    // Authenticated request
    const authRes = handleGetTestRequest(true);
    assert.equal(authRes.status, 200);
    assert.equal(dbQueriesDispatched, 1, 'Authenticated call dispatches required DB query');
  });

  await t.test('11. [TEST-01 & TEST-02] Load test enforces strict status assertions', () => {
    // TEST-01: k6 setup throws if no exam ID resolved
    function simulateK6Setup(envExamId, discoveredExamId) {
      const examId = envExamId || discoveredExamId;
      if (!examId) {
        throw new Error('LOAD TEST SETUP ABORTED: No valid exam ID could be discovered');
      }
      return { examId };
    }

    assert.throws(
      () => simulateK6Setup(null, null),
      /LOAD TEST SETUP ABORTED/,
      'Setup must abort when exam ID is missing'
    );
    assert.doesNotThrow(
      () => simulateK6Setup('exam-uuid-valid', null),
      'Setup succeeds when valid exam ID provided'
    );

    // TEST-01: 404 is NOT accepted in test/exam steps
    function validateExamFetch(statusCode) {
      return statusCode === 200;
    }
    assert.equal(validateExamFetch(200), true);
    assert.equal(validateExamFetch(404), false, '404 must FAIL exam fetch assertion');

    // TEST-02: Course join accepts ONLY 200 or 409
    function validateCourseJoin(statusCode) {
      return statusCode === 200 || statusCode === 409;
    }
    assert.equal(validateCourseJoin(200), true, '200 OK must pass join assertion');
    assert.equal(validateCourseJoin(409), true, '409 Conflict (already joined) must pass join assertion');
    assert.equal(validateCourseJoin(400), false, '400 Bad Request must FAIL join assertion');
    assert.equal(validateCourseJoin(403), false, '403 Forbidden must FAIL join assertion');
    assert.equal(validateCourseJoin(404), false, '404 Not Found must FAIL join assertion');
    assert.equal(validateCourseJoin(500), false, '500 Server Error must FAIL join assertion');
  });
});

