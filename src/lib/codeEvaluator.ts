/**
 * evaluateStudentCode — Text Comparison Mode
 *
 * Compares the student's entered code/text directly against the
 * predefined correct answer(s) set by the admin.
 *
 * Priority:
 *  1. config.testCases[]  — each case has { expectedOutput } to match against student entry
 *  2. config.correctAnswer — single string direct match
 *  3. config.expectedOutput — fallback single string direct match
 *  4. No answer configured → mark correct if student typed something different from starter
 */

function normalizeText(s: string): string {
  return (s || "")
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // collapse runs of blank lines to a single blank line
    .replace(/\n{3,}/g, "\n\n");
}

export async function evaluateStudentCode(
  studentCode: string,
  config: any
): Promise<{
  isCorrect: boolean;
  scoreRatio: number;
  passedCount: number;
  totalCases: number;
  feedback: string;
  testCaseResults: Array<{
    passed: boolean;
    stdin: string;
    stdout: string;
    expected: string;
    error?: string;
  }>;
}> {
  const studentEntry = normalizeText(studentCode);
  const starter = normalizeText(config?.starterCode || "");

  // Nothing entered / unchanged from starter
  if (!studentEntry || studentEntry === starter) {
    return {
      isCorrect: false,
      scoreRatio: 0,
      passedCount: 0,
      totalCases: 0,
      feedback: "No answer submitted or answer is unchanged from the starter template.",
      testCaseResults: [],
    };
  }

  const testCases = Array.isArray(config?.testCases) ? config.testCases : [];

  // ── 1. Multiple test cases → compare student entry against each expectedOutput ──
  if (testCases.length > 0) {
    let passedCount = 0;
    const testCaseResults = [];

    for (const tc of testCases) {
      const expected = normalizeText(tc.expectedOutput || "");

      // Case-insensitive comparison (trim both sides)
      const passed = expected.length > 0 && studentEntry.toLowerCase() === expected.toLowerCase();
      if (passed) passedCount++;

      testCaseResults.push({
        passed,
        stdin: tc.stdin || "",
        stdout: studentEntry,
        expected,
      });
    }

    const totalCases = testCases.length;
    const isCorrect = passedCount === totalCases;
    const scoreRatio = totalCases > 0 ? passedCount / totalCases : 0;
    const feedback = isCorrect
      ? `✅ Correct! Answer matches the expected answer.`
      : `❌ Your answer doesn't match the expected answer. (${passedCount}/${totalCases} matched)`;

    return { isCorrect, scoreRatio, passedCount, totalCases, feedback, testCaseResults };
  }

  // ── 2. Single correctAnswer field ──
  const correctAnswer = normalizeText(
    config?.correctAnswer || config?.expectedOutput || ""
  );

  if (correctAnswer) {
    const isCorrect = studentEntry.toLowerCase() === correctAnswer.toLowerCase();
    return {
      isCorrect,
      scoreRatio: isCorrect ? 1 : 0,
      passedCount: isCorrect ? 1 : 0,
      totalCases: 1,
      feedback: isCorrect
        ? "✅ Correct! Your answer matches the expected answer."
        : "❌ Incorrect. Your answer does not match the expected answer.",
      testCaseResults: [
        {
          passed: isCorrect,
          stdin: "",
          stdout: studentEntry,
          expected: correctAnswer,
        },
      ],
    };
  }

  // ── 3. No answer configured → accept any non-empty, non-starter entry ──
  return {
    isCorrect: true,
    scoreRatio: 1,
    passedCount: 1,
    totalCases: 1,
    feedback: "✅ Answer submitted successfully.",
    testCaseResults: [
      {
        passed: true,
        stdin: "",
        stdout: studentEntry,
        expected: "(open-ended)",
      },
    ],
  };
}
