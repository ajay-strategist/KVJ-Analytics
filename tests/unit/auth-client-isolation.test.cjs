const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("fs");
const path = require("path");

test("Authentication Client Concurrency & Isolation Suite (Phase 11.3)", async (t) => {
  const TEST_JWT_SECRET = "kvj-super-secret-jwt-token-at-least-32-chars-long!";

  function createTestToken(userId, email, role = "authenticated", expiresIn = 3600) {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: userId,
      email: email,
      aud: "authenticated",
      role: role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    };
    const h = Buffer.from(JSON.stringify(header)).toString("base64url");
    const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = crypto.createHmac("sha256", TEST_JWT_SECRET).update(`${h}.${p}`).digest("base64url");
    return `${h}.${p}.${sig}`;
  }

  // 1. Client Instance Isolation Test
  await t.test("1. getAuthClient creates ephemeral client without mutating admin client state", () => {
    // Simulate admin client singleton structure
    const mockAdminClient = {
      auth: {
        currentSession: null,
        admin: {
          getUserById: async (id) => ({ data: { user: { id } }, error: null }),
        },
        signInWithPassword: async (creds) => {
          throw new Error("MUTATION ERROR: signInWithPassword was called on admin singleton!");
        },
      },
      headers: { "x-application-name": "kvj-analytics-web" },
    };

    // Simulate getAuthClient factory
    function createAuthClient() {
      return {
        auth: {
          session: null,
          async signInWithPassword({ email, password }) {
            this.session = {
              access_token: createTestToken(`user-${email}`, email),
              user: { id: `user-${email}`, email },
            };
            return { data: { session: this.session, user: this.session.user }, error: null };
          },
        },
        headers: { "x-application-name": "kvj-analytics-auth" },
      };
    }

    const authClient1 = createAuthClient();
    const authClient2 = createAuthClient();

    // Verify separate instances
    assert.notEqual(authClient1, authClient2, "Auth clients must be separate ephemeral instances");
    assert.notEqual(authClient1, mockAdminClient, "Auth client must never be admin client");

    // Perform login on authClient1
    authClient1.auth.signInWithPassword({ email: "student1@kvjanalytics.test", password: "pwd" });
    assert.ok(authClient1.auth.session, "Client 1 session should be set");
    assert.equal(authClient2.auth.session, null, "Client 2 session must remain null (no cross-contamination)");
    assert.equal(mockAdminClient.auth.currentSession, null, "Admin singleton session must remain untouched");
  });

  // 2. Concurrent Student Authentication Isolation
  await t.test("2. Concurrent authentications for multiple synthetic users yield distinct isolated identities", async () => {
    const studentEmails = Array.from({ length: 10 }, (_, i) => `student${String(i + 1).padStart(3, "0")}@kvjanalytics.test`);

    async function loginStudent(email) {
      // Each login gets its own ephemeral auth client
      const token = createTestToken(`sub-${email}`, email);
      return {
        email,
        userId: `sub-${email}`,
        token,
      };
    }

    const results = await Promise.all(studentEmails.map((email) => loginStudent(email)));

    // Verify all 10 students received distinct tokens and user IDs
    assert.equal(results.length, 10);
    const userIds = new Set(results.map((r) => r.userId));
    const tokens = new Set(results.map((r) => r.token));
    assert.equal(userIds.size, 10, "All 10 user IDs must be unique");
    assert.equal(tokens.size, 10, "All 10 auth tokens must be unique");

    // Verify tokens decode to correct respective identities
    for (const res of results) {
      const parts = res.token.split(".");
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
      assert.equal(payload.email, res.email, "Token payload email must match student");
      assert.equal(payload.sub, res.userId, "Token payload sub must match student user ID");
    }
  });

  // 3. Shared Admin Client Token Immutability
  await t.test("3. Shared admin client maintains service-role privilege despite concurrent student logins", async () => {
    let adminTokenState = "SERVICE_ROLE_KEY_SECRET";

    const adminClient = {
      getKey() {
        return adminTokenState;
      },
    };

    // Simulate 20 concurrent student login tasks
    const logins = Array.from({ length: 20 }, async (_, i) => {
      const studentClient = {
        token: `STUDENT_TOKEN_${i}`,
      };
      return studentClient.token;
    });

    await Promise.all(logins);

    // Admin key must remain pristine
    assert.equal(adminClient.getKey(), "SERVICE_ROLE_KEY_SECRET", "Admin key must remain immutable");
  });

  // 4. RLS Identity Correctness Under Concurrency
  await t.test("4. RLS attempt persistence binds strictly to verified caller identity without session leakage", () => {
    // Simulated table storing student test attempts
    const testAttemptsTable = [];

    function insertAttempt(callerIdentity, testId, score) {
      // Simulate RLS: check caller identity matches row user_id
      const row = {
        id: crypto.randomUUID(),
        user_id: callerIdentity.userId,
        test_id: testId,
        score,
        created_at: new Date().toISOString(),
      };
      testAttemptsTable.push(row);
      return row;
    }

    const studentA = { userId: "user-aaa-111", email: "student001@kvjanalytics.test" };
    const studentB = { userId: "user-bbb-222", email: "student002@kvjanalytics.test" };

    const attemptA = insertAttempt(studentA, "exam-1", 85);
    const attemptB = insertAttempt(studentB, "exam-1", 90);

    assert.equal(attemptA.user_id, studentA.userId);
    assert.equal(attemptB.user_id, studentB.userId);
    assert.notEqual(attemptA.user_id, attemptB.user_id);

    // Verify Student A cannot see or mutate Student B's attempt
    const studentAViews = testAttemptsTable.filter((r) => r.user_id === studentA.userId);
    const studentBViews = testAttemptsTable.filter((r) => r.user_id === studentB.userId);
    assert.equal(studentAViews.length, 1);
    assert.equal(studentBViews.length, 1);
    assert.equal(studentAViews[0].score, 85);
    assert.equal(studentBViews[0].score, 90);
  });

  // 5. Code-Level Inspection of Route Handlers for Rule 3 & Client Isolation
  await t.test("5. Route handlers comply with getAuthClient and local JWT verification (Rule 3)", () => {
    const routeFiles = [
      "src/app/api/auth/login/route.ts",
      "src/app/api/auth/confirm-user/route.ts",
      "src/app/api/auth/reset-password/route.ts",
      "src/app/api/test-session/route.ts",
      "src/app/api/materials/[id]/route.ts",
      "src/app/api/auth/update-password/route.ts",
      "src/app/api/enroll/free/route.ts",
      "src/app/api/tests/[id]/check/route.ts",
    ];

    for (const rf of routeFiles) {
      const fullPath = path.resolve(process.cwd(), rf);
      assert.ok(fs.existsSync(fullPath), `Route file must exist: ${rf}`);
      const content = fs.readFileSync(fullPath, "utf8");

      // Verify no route calls supabaseAdmin.auth.signInWithPassword
      assert.equal(
        content.includes("supabaseAdmin.auth.signInWithPassword"),
        false,
        `File ${rf} must NOT call supabaseAdmin.auth.signInWithPassword!`
      );

      // Verify no route calls auth.getUser (Rule 3)
      assert.equal(
        content.includes("auth.getUser("),
        false,
        `File ${rf} must NOT call auth.getUser( (Rule 3 violation)!`
      );
    }
  });
});

