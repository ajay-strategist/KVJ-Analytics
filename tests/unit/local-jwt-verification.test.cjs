const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

// Minimal ES256 & HS256 JWT generator and verification test suite
test("Local JWT Verification Unit Tests", async (t) => {
  const secret = "test-secret-key-32-characters-minimum!!";
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", {
    namedCurve: "prime256v1",
  });

  const base64UrlEncode = (str) =>
    Buffer.from(str)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const base64UrlDecode = (str) => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return Buffer.from(base64, "base64").toString("utf-8");
  };

  const createHs256Jwt = (payload, secretKey, expiresInSec = 3600) => {
    const header = { alg: "HS256", typ: "JWT" };
    const body = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInSec,
    };
    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const bodyB64 = base64UrlEncode(JSON.stringify(body));
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(`${headerB64}.${bodyB64}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    return `${headerB64}.${bodyB64}.${signature}`;
  };

  const verifyHs256Jwt = (token, secretKey) => {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT format");
    const [headerB64, bodyB64, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", secretKey)
      .update(`${headerB64}.${bodyB64}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    if (signature !== expectedSig) {
      throw new Error("Invalid JWT signature");
    }

    const payload = JSON.parse(base64UrlDecode(bodyB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("JWT has expired");
    }
    return payload;
  };

  await t.test("Successfully verifies valid HS256 JWT and extracts user claims", () => {
    const studentUser = {
      sub: "student-uuid-1234",
      email: "student@kvjanalytics.in",
      role: "authenticated",
    };
    const token = createHs256Jwt(studentUser, secret, 3600);
    const verified = verifyHs256Jwt(token, secret);

    assert.equal(verified.sub, "student-uuid-1234");
    assert.equal(verified.email, "student@kvjanalytics.in");
    assert.equal(verified.role, "authenticated");
    assert.ok(verified.exp > Math.floor(Date.now() / 1000));
  });

  await t.test("Rejects JWT with tampered payload", () => {
    const studentUser = { sub: "student-uuid-1234", role: "authenticated" };
    const token = createHs256Jwt(studentUser, secret, 3600);
    const parts = token.split(".");

    // Tamper with payload (e.g. elevate to admin)
    const tamperedPayload = JSON.parse(base64UrlDecode(parts[1]));
    tamperedPayload.role = "admin";
    tamperedPayload.sub = "admin-uuid-0000";
    const tamperedBodyB64 = base64UrlEncode(JSON.stringify(tamperedPayload));
    const tamperedToken = `${parts[0]}.${tamperedBodyB64}.${parts[2]}`;

    assert.throws(() => verifyHs256Jwt(tamperedToken, secret), {
      message: "Invalid JWT signature",
    });
  });

  await t.test("Rejects JWT signed with incorrect secret", () => {
    const studentUser = { sub: "student-uuid-1234" };
    const token = createHs256Jwt(studentUser, "wrong-secret-key-attacker", 3600);

    assert.throws(() => verifyHs256Jwt(token, secret), {
      message: "Invalid JWT signature",
    });
  });

  await t.test("Rejects expired JWT token", () => {
    const studentUser = { sub: "student-uuid-1234" };
    // Create token that expired 10 seconds ago
    const expiredToken = createHs256Jwt(studentUser, secret, -10);

    assert.throws(() => verifyHs256Jwt(expiredToken, secret), {
      message: "JWT has expired",
    });
  });
});

