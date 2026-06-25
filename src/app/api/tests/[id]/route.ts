import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function stripAnswers(type: string, config: any) {
  if (!config) return {};
  const c = { ...config };
  if (type === "single") {
    delete c.correctIndex;
  } else if (type === "multiple") {
    delete c.correctIndexes;
  } else if (type === "truefalse") {
    delete c.correct;
  } else if (type === "dragdrop") {
    delete c.correctPairs;
    // Shuffle the right side items to present them randomly to the student
    if (c.right) {
      c.right = [...c.right].sort(() => Math.random() - 0.5);
    }
  } else if (type === "sequence") {
    delete c.correctOrder;
    // Shuffle the sequence items
    if (c.items) {
      c.items = [...c.items].sort(() => Math.random() - 0.5);
    }
  } else if (type === "fillblank") {
    if (c.blanks) {
      c.blanks = c.blanks.map((b: any) => {
        const nb = { ...b };
        delete nb.accepted;
        return nb;
      });
    }
  } else if (type === "matrix") {
    delete c.correct;
  } else if (type === "code") {
    if (c.testCases) {
      c.testCases = c.testCases.map((tc: any) => {
        const ntc = { ...tc };
        delete ntc.expectedOutput;
        return ntc;
      });
    }
  }
  return c;
}

function getCorrectAnswerLabel(type: string, config: any) {
  if (type === "single") return `Option index: ${config.correctIndex}`;
  if (type === "multiple") return `Option indices: ${config.correctIndexes?.join(", ")}`;
  if (type === "truefalse") return config.correct ? "True" : "False";
  if (type === "dragdrop") return `Correct matches: ${JSON.stringify(config.correctPairs)}`;
  if (type === "sequence") return `Correct order index sequence: ${config.correctOrder?.join(", ")}`;
  if (type === "fillblank") return `Blanks: ${config.blanks?.map((b: any, i: number) => `[Blank ${i + 1}: ${b.accepted?.join(" or ")}]`).join(", ")}`;
  if (type === "matrix") return `Rows → correct columns: ${(config.correct || []).map((cols: number[], i: number) => `[${config.rows?.[i] ?? "Row " + (i + 1)}: ${(cols || []).map((ci) => config.columns?.[ci] ?? ci).join(", ")}]`).join("; ")}`;
  if (type === "code") return "Passes all test cases.";
  return "";
}

async function runCode(sourceCode: string, language: string, stdin?: string): Promise<{ stdout: string; stderr: string; compile_output: string; err?: string }> {
  const url = process.env.JUDGE0_URL;
  const apiKey = process.env.JUDGE0_API_KEY;
  if (!url) {
    return { stdout: "", stderr: "", compile_output: "", err: "Judge0 not configured." };
  }

  // Map language string to Judge0 ID
  let langId = 71; // default Python
  const lower = language.toLowerCase();
  if (lower.includes("python")) langId = 71;
  else if (lower.includes("javascript") || lower.includes("node") || lower.includes("js")) langId = 93;
  else if (lower.includes("sql") || lower.includes("sqlite")) langId = 82;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["X-Judge0-Key"] = apiKey;
    headers["X-Auth-Token"] = apiKey;
    headers["x-rapidapi-key"] = apiKey;
  }

  try {
    const res = await fetch(`${url}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: langId,
        stdin: stdin || "",
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      return { stdout: "", stderr: "", compile_output: "", err: `Execution failed: ${txt}` };
    }

    const data = await res.json();
    return {
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      compile_output: data.compile_output || "",
    };
  } catch (err: any) {
    return { stdout: "", stderr: "", compile_output: "", err: err.message || "Failed to fetch Judge0" };
  }
}

// GET: Returns test details and questions *without* correctIndex/correct answers
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdmin();

    if (!db) {
      return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
    }

    // 1. Fetch test details from mock_tests table
    const { data: test, error: testErr } = await db
      .from("mock_tests")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (testErr || !test) {
      return NextResponse.json({ error: "Mock test not found." }, { status: 404 });
    }

    // Fetch the associated course slug
    const { data: course } = await db
      .from("courses")
      .select("slug")
      .eq("id", test.course_id)
      .maybeSingle();

    // 2. Validate session from cookie
    const token = req.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid auth token." }, { status: 401 });
    }

    // 3. Allow admins or check student enrollment
    const { data: profile } = await db
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      const { data: enrollment, error: enrollError } = await db
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_slug", course?.slug)
        .eq("status", "active")
        .maybeSingle();

      if (enrollError || !enrollment) {
        return NextResponse.json(
          { error: "Access denied. You must be enrolled in the course to take this mock test." },
          { status: 403 }
        );
      }
    }

    // 4. Fetch the questions sorted by display_order
    const { data: dbQuestions, error: qErr } = await db
      .from("questions")
      .select("*")
      .eq("test_id", id)
      .order("display_order", { ascending: true })
      .order("id", { ascending: true });

    if (qErr) {
      return NextResponse.json({ error: qErr.message }, { status: 500 });
    }

    // 5. Strip correct answers from config
    const strippedQuestions = (dbQuestions || []).map((q: any) => {
      return {
        id: q.id,
        type: q.type,
        stem: q.stem,
        marks: q.marks,
        config: stripAnswers(q.type, q.config),
      };
    });

    const sanitizedTest = {
      id: test.id,
      title: test.title,
      durationMins: test.duration_mins,
      passMark: test.pass_mark,
      questions: strippedQuestions,
      courseSlug: course?.slug || "",
    };

    return NextResponse.json({ test: sanitizedTest });
  } catch (error: any) {
    console.error("GET mock test error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// POST: Evaluates the submitted answers, saves result to Supabase, and returns feedback
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getAdmin();

    if (!db) {
      return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
    }

    const body = await req.json();
    const { answers, startedAt } = body; // answers is a record: { [qId: string]: studentAnswerValue }

    if (!answers || !startedAt) {
      return NextResponse.json({ error: "Submission is missing answers or started timestamp." }, { status: 400 });
    }

    // 1. Fetch complete mock_test details
    const { data: test, error: testErr } = await db
      .from("mock_tests")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (testErr || !test) {
      return NextResponse.json({ error: "Mock test not found." }, { status: 404 });
    }

    // Fetch the associated course slug
    const { data: course } = await db
      .from("courses")
      .select("slug")
      .eq("id", test.course_id)
      .maybeSingle();

    // 2. Validate session
    const token = req.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid auth session." }, { status: 401 });
    }

    // 3. Allow admins or verify enrollment
    const { data: profile } = await db
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";

    if (!isAdmin) {
      const { data: enrollment, error: enrollError } = await db
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_slug", course?.slug)
        .eq("status", "active")
        .maybeSingle();

      if (enrollError || !enrollment) {
        return NextResponse.json(
          { error: "Access denied. You must be enrolled in the course to evaluate this mock test." },
          { status: 403 }
        );
      }
    }

    // 4. Fetch the real questions with answer configurations
    const { data: questions, error: qErr } = await db
      .from("questions")
      .select("*")
      .eq("test_id", id)
      .order("display_order", { ascending: true })
      .order("id", { ascending: true });

    if (qErr || !questions) {
      return NextResponse.json({ error: "Failed to fetch test questions." }, { status: 500 });
    }

    // 5. Score answers on the server side
    let earnedMarks = 0;
    let totalPossibleMarks = 0;
    const perQuestionFeedback: Record<string, any> = {};

    for (const q of questions) {
      const qId = q.id;
      const qMarks = Number(q.marks) || 1;
      totalPossibleMarks += qMarks;

      const studentAns = answers[qId];
      const config = q.config;
      let isCorrect = false;
      let pending = false;
      let feedback = "";
      let codeResults: any = null;

      if (studentAns === undefined || studentAns === null) {
        isCorrect = false;
        feedback = "Not answered.";
      } else if (q.type === "single") {
        isCorrect = Number(studentAns) === Number(config.correctIndex);
      } else if (q.type === "multiple") {
        isCorrect = Array.isArray(studentAns) &&
          studentAns.length === config.correctIndexes.length &&
          studentAns.every((x: any) => config.correctIndexes.includes(Number(x)));
      } else if (q.type === "truefalse") {
        isCorrect = String(studentAns) === String(config.correct);
      } else if (q.type === "dragdrop") {
        // Support both string-based [leftVal, rightVal] and index-based [leftIdx, rightIdx] pairs
        isCorrect = Array.isArray(studentAns) &&
          studentAns.length === config.correctPairs.length &&
          studentAns.every((pair: any) => {
            if (!Array.isArray(pair) || pair.length !== 2) return false;
            const [l, r] = pair;
            if (typeof l === "string" && typeof r === "string") {
              return config.correctPairs.some((p: any) => {
                const correctLStr = config.left[p[0]];
                const correctRStr = config.right[p[1]];
                return String(l).trim() === String(correctLStr).trim() && String(r).trim() === String(correctRStr).trim();
              });
            }
            return config.correctPairs.some((p: any) => Number(p[0]) === Number(l) && Number(p[1]) === Number(r));
          });
      } else if (q.type === "sequence") {
        // Support both string-based reordered items and index-based lists
        isCorrect = Array.isArray(studentAns) &&
          studentAns.length === config.correctOrder.length &&
          studentAns.every((x: any, i: number) => {
            if (typeof x === "string") {
              const correctStr = config.items[config.correctOrder[i]];
              return String(x).trim() === String(correctStr).trim();
            }
            return Number(x) === Number(config.correctOrder[i]);
          });
      } else if (q.type === "fillblank") {
        isCorrect = Array.isArray(studentAns) &&
          studentAns.length === config.blanks.length &&
          studentAns.every((ans: any, idx: number) => {
            const accepted = config.blanks[idx].accepted || [];
            const cleanAns = (ans || "").toString().trim().toLowerCase();
            return accepted.map((a: string) => a.trim().toLowerCase()).includes(cleanAns);
          });
      } else if (q.type === "matrix") {
        // studentAns: number[][] — selected column indexes per row.
        // config.correct: number[][] — correct column indexes per row.
        const correctRows = config.correct || [];
        isCorrect = Array.isArray(studentAns) &&
          studentAns.length === correctRows.length &&
          correctRows.every((correctCols: number[], rowIdx: number) => {
            const picked = Array.isArray(studentAns[rowIdx]) ? studentAns[rowIdx].map((x: any) => Number(x)) : [];
            const want = (correctCols || []).map((x: any) => Number(x));
            return picked.length === want.length && want.every((c: number) => picked.includes(c));
          });
      } else if (q.type === "code") {
        if (!process.env.JUDGE0_URL) {
          pending = true;
          isCorrect = false;
          feedback = "Pending manual grading (Code execution sandbox offline).";
        } else {
          let passedCases = 0;
          const testCaseResults = [];
          const testCases = config.testCases || [];

          for (const tc of testCases) {
            const run = await runCode(studentAns, config.language, tc.stdin);
            if (run.err) {
              testCaseResults.push({ passed: false, stdout: "", expected: tc.expectedOutput, error: run.err });
            } else {
              const cleanStdout = run.stdout.trim().replace(/\r/g, "");
              const cleanExpected = tc.expectedOutput.trim().replace(/\r/g, "");
              const isPass = cleanStdout === cleanExpected;
              if (isPass) passedCases++;
              testCaseResults.push({
                passed: isPass,
                stdout: run.stdout,
                stderr: run.stderr,
                expected: tc.expectedOutput
              });
            }
          }

          isCorrect = testCases.length > 0 && passedCases === testCases.length;
          codeResults = testCaseResults;
          feedback = isCorrect
            ? "All test cases passed."
            : `${passedCases}/${testCases.length} test cases passed.`;
        }
      }

      const earned = isCorrect ? qMarks : 0;
      if (!pending) {
        earnedMarks += earned;
      }

      perQuestionFeedback[qId] = {
        type: q.type,
        stem: q.stem,
        marks: qMarks,
        earned,
        isCorrect,
        pending,
        feedback,
        studentAnswer: studentAns,
        config: stripAnswers(q.type, config),
        correctAnswer: getCorrectAnswerLabel(q.type, config),
        codeResults,
      };
    }

    const passed = earnedMarks >= Number(test.pass_mark || 0);

    // 6. Store attempt in Supabase test_attempts table
    const { data: attemptRecord, error: dbError } = await db
      .from("test_attempts")
      .insert([
        {
          user_id: user.id,
          test_slug: id, // maintain backward compatibility by saving uuid in test_slug
          test_id: id,   // pointing to FK test_id
          answers: answers,
          score: earnedMarks,
          max_score: totalPossibleMarks,
          passed: passed,
          per_question: perQuestionFeedback,
          started_at: startedAt,
          submitted_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Error saving test attempt:", dbError);
      return NextResponse.json({ error: "Failed to save test attempt results to database." }, { status: 500 });
    }

    // 7. Return graded result details
    return NextResponse.json({
      success: true,
      score: earnedMarks,
      totalPossibleMarks,
      passed,
      passMark: test.pass_mark,
      gradedQuestions: perQuestionFeedback,
      attemptId: attemptRecord.id
    });
  } catch (error: any) {
    console.error("POST mock test score error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
