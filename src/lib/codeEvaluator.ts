import { spawnSync } from "child_process";

export async function runCodeExecution(
  sourceCode: string,
  language: string = "python",
  stdin: string = ""
): Promise<{ stdout: string; stderr: string; err?: string }> {
  const judge0Url = process.env.JUDGE0_URL;
  if (judge0Url) {
    try {
      const apiKey = process.env.JUDGE0_API_KEY;
      let langId = 71; // Python default
      const lower = (language || "").toLowerCase();
      if (lower.includes("javascript") || lower.includes("js") || lower.includes("node")) langId = 93;
      else if (lower.includes("sql")) langId = 82;

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) {
        headers["X-Judge0-Key"] = apiKey;
        headers["X-Auth-Token"] = apiKey;
        headers["x-rapidapi-key"] = apiKey;
      }

      const res = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: langId,
          stdin: stdin || "",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          stdout: (data.stdout || "").trim(),
          stderr: (data.stderr || data.compile_output || "").trim(),
        };
      }
    } catch (e) {
      console.warn("Judge0 execution failed, using local process runner fallback:", e);
    }
  }

  // Local child_process execution fallback
  const lang = (language || "python").toLowerCase();
  try {
    let res;
    if (lang.includes("javascript") || lang.includes("js") || lang.includes("node")) {
      res = spawnSync("node", ["-e", sourceCode], {
        input: stdin || "",
        timeout: 5000,
        encoding: "utf-8",
        maxBuffer: 1024 * 1024,
      });
    } else {
      const pyCmd = process.platform === "win32" ? "python" : "python3";
      res = spawnSync(pyCmd, ["-c", sourceCode], {
        input: stdin || "",
        timeout: 5000,
        encoding: "utf-8",
        maxBuffer: 1024 * 1024,
      });
    }

    if (res.error) {
      return { stdout: "", stderr: res.error.message, err: res.error.message };
    }

    return {
      stdout: (res.stdout || "").trim(),
      stderr: (res.stderr || "").trim(),
    };
  } catch (err: any) {
    return { stdout: "", stderr: err.message || "Execution error", err: err.message };
  }
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
  const code = String(studentCode || "").trim();
  const starter = String(config?.starterCode || "").trim();

  if (!code || code === starter) {
    return {
      isCorrect: false,
      scoreRatio: 0,
      passedCount: 0,
      totalCases: 0,
      feedback: "No code submitted or code is unchanged from starter template.",
      testCaseResults: [],
    };
  }

  const language = config?.language || "python";
  const testCases = Array.isArray(config?.testCases) ? config.testCases : [];

  // 1. Explicit Test Cases defined in question configuration
  if (testCases.length > 0) {
    let passedCount = 0;
    const testCaseResults = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const run = await runCodeExecution(code, language, tc.stdin || "");
      const cleanStdout = (run.stdout || "").trim().replace(/\r/g, "");
      const cleanExpected = (tc.expectedOutput || "").trim().replace(/\r/g, "");

      const isPass = !run.stderr && (cleanExpected ? cleanStdout === cleanExpected : cleanStdout.length > 0);
      if (isPass) passedCount++;

      testCaseResults.push({
        passed: isPass,
        stdin: tc.stdin || "",
        stdout: cleanStdout,
        expected: cleanExpected,
        error: run.stderr || run.err || undefined,
      });
    }

    const isCorrect = passedCount === testCases.length;
    const ratio = testCases.length > 0 ? passedCount / testCases.length : 0;
    const feedback = isCorrect
      ? `✅ All ${testCases.length} test cases passed!`
      : `❌ Passed ${passedCount} of ${testCases.length} test cases.`;

    return {
      isCorrect,
      scoreRatio: ratio,
      passedCount,
      totalCases: testCases.length,
      feedback,
      testCaseResults,
    };
  }

  // 2. Single expectedOutput configured
  if (config?.expectedOutput) {
    const run = await runCodeExecution(code, language, "");
    const cleanStdout = (run.stdout || "").trim().replace(/\r/g, "");
    const cleanExpected = String(config.expectedOutput).trim().replace(/\r/g, "");
    const isCorrect = !run.stderr && cleanStdout === cleanExpected;

    return {
      isCorrect,
      scoreRatio: isCorrect ? 1 : 0,
      passedCount: isCorrect ? 1 : 0,
      totalCases: 1,
      feedback: isCorrect
        ? "✅ Code executed successfully and produced expected output!"
        : run.stderr
        ? `❌ Execution Error: ${run.stderr}`
        : `❌ Output mismatch. Expected: "${cleanExpected}", Got: "${cleanStdout}"`,
      testCaseResults: [
        {
          passed: isCorrect,
          stdin: "",
          stdout: cleanStdout,
          expected: cleanExpected,
          error: run.stderr,
        },
      ],
    };
  }

  // 3. Open code execution (verify syntax & error-free execution)
  const run = await runCodeExecution(code, language, "");
  if (run.stderr || run.err) {
    return {
      isCorrect: false,
      scoreRatio: 0,
      passedCount: 0,
      totalCases: 1,
      feedback: `❌ Code Execution Error: ${run.stderr || run.err}`,
      testCaseResults: [
        {
          passed: false,
          stdin: "",
          stdout: run.stdout,
          expected: "No execution errors",
          error: run.stderr || run.err,
        },
      ],
    };
  }

  return {
    isCorrect: true,
    scoreRatio: 1,
    passedCount: 1,
    totalCases: 1,
    feedback: "✅ Code executed cleanly with 0 syntax or runtime errors.",
    testCaseResults: [
      {
        passed: true,
        stdin: "",
        stdout: run.stdout,
        expected: run.stdout,
      },
    ],
  };
}
