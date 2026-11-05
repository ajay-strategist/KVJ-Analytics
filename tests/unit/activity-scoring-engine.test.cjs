const test = require("node:test");
const assert = require("node:assert/strict");

// Server-side evaluation logic mirrored from /api/activity-result
function evaluateActivityResult({ rawScore, authoritativeMaxScore }) {
  const numScore = Number(rawScore);
  const authoritativeMax = Number(authoritativeMaxScore);

  if (isNaN(numScore) || numScore < 0) {
    throw new Error("Invalid score value. Score must be a non-negative number.");
  }
  if (isNaN(authoritativeMax) || authoritativeMax <= 0) {
    throw new Error("Invalid authoritative max score.");
  }

  // Server-side clamping to prevent client score inflation
  const validatedScore = Math.min(numScore, authoritativeMax);
  const scorePercent = Math.round((validatedScore / authoritativeMax) * 100);
  const passed = scorePercent >= 60;

  return {
    score: validatedScore,
    maxScore: authoritativeMax,
    scorePercent,
    passed,
  };
}

test("Server-Side Activity Scoring Engine Tests", async (t) => {
  await t.test("Calculates correct passing score (100% full marks)", () => {
    const result = evaluateActivityResult({ rawScore: 100, authoritativeMaxScore: 100 });
    assert.equal(result.score, 100);
    assert.equal(result.maxScore, 100);
    assert.equal(result.scorePercent, 100);
    assert.equal(result.passed, true);
  });

  await t.test("Calculates passing boundary score (60%)", () => {
    const result = evaluateActivityResult({ rawScore: 60, authoritativeMaxScore: 100 });
    assert.equal(result.score, 60);
    assert.equal(result.scorePercent, 60);
    assert.equal(result.passed, true);
  });

  await t.test("Calculates failing boundary score (59%)", () => {
    const result = evaluateActivityResult({ rawScore: 59, authoritativeMaxScore: 100 });
    assert.equal(result.score, 59);
    assert.equal(result.scorePercent, 59);
    assert.equal(result.passed, false);
  });

  await t.test("Prevents score inflation beyond authoritative max (cheating prevention)", () => {
    // Malicious client claims 500 points on a 100-point activity
    const result = evaluateActivityResult({ rawScore: 500, authoritativeMaxScore: 100 });
    assert.equal(result.score, 100); // Clamped to authoritativeMax
    assert.equal(result.maxScore, 100);
    assert.equal(result.scorePercent, 100);
    assert.equal(result.passed, true);
  });

  await t.test("Rejects negative scores", () => {
    assert.throws(
      () => evaluateActivityResult({ rawScore: -10, authoritativeMaxScore: 100 }),
      { message: /non-negative number/ }
    );
  });

  await t.test("Rejects non-numeric NaN scores", () => {
    assert.throws(
      () => evaluateActivityResult({ rawScore: "not-a-number", authoritativeMaxScore: 100 }),
      { message: /non-negative number/ }
    );
  });
});

