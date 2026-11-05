const test = require("node:test");
const assert = require("node:assert/strict");

// Stripping logic mirrored from fn_strip_question_answers
function stripQuestionAnswers(type, config) {
  if (!config || typeof config !== "object") return config;
  const sanitized = JSON.parse(JSON.stringify(config));

  // Stripped keys
  delete sanitized.correctIndex;
  delete sanitized.correctIndexes;
  delete sanitized.correctPairs;
  delete sanitized.accepted;
  delete sanitized.acceptedCode;
  delete sanitized.testCases;
  delete sanitized.solution;
  delete sanitized.correctTF;

  if (type === "dragdrop" && Array.isArray(sanitized.pairs)) {
    // Keep items to match and options, but strip correct pairings
    delete sanitized.pairs;
  }

  return sanitized;
}

test("Question Bank Sanitization (Anti-Leak) Tests", async (t) => {
  await t.test("Strips correctIndex from single choice questions", () => {
    const rawConfig = {
      options: ["Apple", "Banana", "Cherry"],
      correctIndex: 1,
      explanation: "Banana is correct",
    };
    const sanitized = stripQuestionAnswers("single", rawConfig);

    assert.deepEqual(sanitized.options, ["Apple", "Banana", "Cherry"]);
    assert.equal(sanitized.correctIndex, undefined);
    assert.equal("correctIndex" in sanitized, false);
  });

  await t.test("Strips correctIndexes from multiple choice questions", () => {
    const rawConfig = {
      options: ["A", "B", "C", "D"],
      correctIndexes: [0, 2],
      shuffle: true,
    };
    const sanitized = stripQuestionAnswers("multiple", rawConfig);

    assert.deepEqual(sanitized.options, ["A", "B", "C", "D"]);
    assert.equal(sanitized.correctIndexes, undefined);
    assert.equal("correctIndexes" in sanitized, false);
  });

  await t.test("Strips correct pairs from dragdrop questions", () => {
    const rawConfig = {
      left: ["Item 1", "Item 2"],
      right: ["Match A", "Match B"],
      pairs: [["Item 1", "Match A"], ["Item 2", "Match B"]],
    };
    const sanitized = stripQuestionAnswers("dragdrop", rawConfig);

    assert.deepEqual(sanitized.left, ["Item 1", "Item 2"]);
    assert.deepEqual(sanitized.right, ["Match A", "Match B"]);
    assert.equal(sanitized.pairs, undefined);
    assert.equal("pairs" in sanitized, false);
  });
});

