import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";

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
  } else if (type === "dragtable") {
    delete c.correct;
    if (c.draggables) {
      c.draggables = [...c.draggables].sort(() => Math.random() - 0.5);
    }
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
  if (!config) return "";
  if (type === "single") {
    const optText = config.options?.[config.correctIndex];
    return optText ? `Option ${config.correctIndex + 1}: ${optText}` : `Option index: ${config.correctIndex}`;
  }
  if (type === "multiple") {
    const labels = (config.correctIndexes || []).map((idx: number) => {
      const txt = config.options?.[idx];
      return txt ? `Option ${idx + 1}: ${txt}` : `Option ${idx + 1}`;
    });
    return labels.join(", ");
  }
  if (type === "truefalse") return config.correct ? "True" : "False";
  if (type === "dragtable") {
    const correct = config.correct || {};
    return Object.entries(correct)
      .map(([slot, val]) => `${slot} = ${val}`)
      .join("; ");
  }
  if (type === "dragdrop") {
    const pairs = (config.correctPairs || []).map((p: any) => {
      const l = config.left?.[p[0]] ?? p[0];
      const r = config.right?.[p[1]] ?? p[1];
      return `${l} → ${r}`;
    });
    return pairs.join("; ");
  }
  if (type === "sequence") {
    const order = (config.correctOrder || []).map((idx: number) => config.items?.[idx] ?? `Item ${idx + 1}`);
    return order.join(" → ");
  }
  if (type === "fillblank") {
    return (config.blanks || []).map((b: any, i: number) => `[Blank ${i + 1}: ${(b.accepted || []).join(" or ")}]`).join(", ");
  }
  if (type === "matrix") {
    return (config.correct || []).map((cols: number[], i: number) => {
      const rowName = config.rows?.[i] ?? `Row ${i + 1}`;
      const colNames = (cols || []).map((ci: number) => config.columns?.[ci] ?? `Column ${ci + 1}`);
      return `[${rowName}: ${colNames.join(", ")}]`;
    }).join("; ");
  }
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

    // 2. Validate session from cookie or Authorization header
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = req.cookies.get("sb-access-token")?.value || bearerToken;
    const adminSession = req.cookies.get("admin_session")?.value;
    const isExplicitPreview = req.nextUrl.searchParams.get("preview") === "1" || req.nextUrl.searchParams.get("preview") === "true";
    const isAdminPreview = (adminSession === adminToken()) && isExplicitPreview;

    if (!isAdminPreview) {
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

    // Shuffle questions if randomize is enabled
    let finalQuestions = [...strippedQuestions];
    if (test.randomize) {
      for (let i = finalQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalQuestions[i], finalQuestions[j]] = [finalQuestions[j], finalQuestions[i]];
      }
    }

    const sanitizedTest = {
      id: test.id,
      title: test.title,
      durationMins: test.duration_mins,
      passMark: test.pass_mark,
      questions: finalQuestions,
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

    // 2. Validate session from cookie or Authorization header
    let user: any = null;
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = req.cookies.get("sb-access-token")?.value || bearerToken;
    const adminSession = req.cookies.get("admin_session")?.value;
    const urlObj = new URL(req.url);
    const isExplicitPreview = urlObj.searchParams.get("preview") === "true" || urlObj.searchParams.get("preview") === "1";
    const isAdminPreview = (adminSession === adminToken()) && isExplicitPreview;

    if (!isAdminPreview) {
      if (!token) {
        return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
      }

      const { data: { user: authUser }, error: authError } = await db.auth.getUser(token);
      if (authError || !authUser) {
        return NextResponse.json({ error: "Invalid auth session." }, { status: 401 });
      }
      user = authUser;

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
    } else if (token && !user) {
      // If user token is available even during admin preview, extract user for reference
      const { data: { user: authUser } } = await db.auth.getUser(token);
      if (authUser) user = authUser;
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
      const config = q.config || {};
      const studentAns = answers[qId];

      let qMarks = Number(q.marks) || 1;
      let earned = 0;
      let isCorrect = false;
      let pending = false;
      let feedback = "";
      let codeResults: any = null;

      if (q.type === "dragtable") {
        const correct = config.correct || {};
        const slotKeys = Object.keys(correct);
        const numSlots = slotKeys.length > 0 ? slotKeys.length : 1;
        qMarks = numSlots; // 1 mark per slot

        let correctSlotsCount = 0;
        if (typeof studentAns === "object" && studentAns !== null) {
          for (const key of slotKeys) {
            const studentVal = String(studentAns[key] || "").trim();
            const expectedVal = String(correct[key] || "").trim();
            if (studentVal.length > 0 && studentVal === expectedVal) {
              correctSlotsCount++;
            }
          }
        }
        earned = correctSlotsCount; // 1 mark per correct option
        isCorrect = slotKeys.length > 0 && correctSlotsCount === slotKeys.length;
        feedback = isCorrect
          ? "All table slots matched correctly."
          : `${correctSlotsCount}/${numSlots} table slots correct (+${correctSlotsCount} marks).`;
      } else if (q.type === "dragdrop") {
        const correctPairs = config.correctPairs || [];
        const leftList = config.left || [];
        const rightList = config.right || [];
        const numPairs = correctPairs.length > 0 ? correctPairs.length : 1;
        qMarks = numPairs; // 1 mark per pair

        let correctPairsCount = 0;
        if (Array.isArray(studentAns)) {
          for (const pair of studentAns) {
            if (!Array.isArray(pair) || pair.length !== 2) continue;
            const [l, r] = pair;
            const isPairCorrect = correctPairs.some((p: any) => {
              if (typeof l === "string" && typeof r === "string") {
                const correctLStr = leftList[p[0]];
                const correctRStr = rightList[p[1]];
                return String(l).trim() === String(correctLStr || "").trim() && String(r).trim() === String(correctRStr || "").trim();
              }
              return Number(p[0]) === Number(l) && Number(p[1]) === Number(r);
            });
            if (isPairCorrect) correctPairsCount++;
          }
        }
        earned = correctPairsCount;
        isCorrect = numPairs > 0 && correctPairsCount === numPairs;
        feedback = isCorrect
          ? "All pairs matched correctly."
          : `${correctPairsCount}/${numPairs} pairs matched correctly (+${correctPairsCount} marks).`;
      } else if (q.type === "fillblank") {
        const blanks = config.blanks || [];
        const numBlanks = blanks.length > 0 ? blanks.length : 1;
        qMarks = numBlanks; // 1 mark per blank

        let correctBlanksCount = 0;
        if (Array.isArray(studentAns)) {
          blanks.forEach((b: any, idx: number) => {
            const accepted = b?.accepted || [];
            const cleanAns = (studentAns[idx] || "").toString().trim().toLowerCase();
            if (accepted.map((a: string) => (a || "").toString().trim().toLowerCase()).includes(cleanAns)) {
              correctBlanksCount++;
            }
          });
        }
        earned = correctBlanksCount;
        isCorrect = numBlanks > 0 && correctBlanksCount === numBlanks;
        feedback = isCorrect
          ? "All blanks filled correctly."
          : `${correctBlanksCount}/${numBlanks} blanks correct (+${correctBlanksCount} marks).`;
      } else if (q.type === "matrix") {
        const correctRows = config.correct || [];
        const numRows = correctRows.length > 0 ? correctRows.length : 1;
        qMarks = numRows; // 1 mark per row

        let correctRowsCount = 0;
        if (Array.isArray(studentAns)) {
          correctRows.forEach((correctCols: number[], rowIdx: number) => {
            const pickedSet = Array.from(new Set<number>((Array.isArray(studentAns[rowIdx]) ? studentAns[rowIdx] : []).map((x: any) => Number(x)))).sort((a: number, b: number) => a - b);
            const wantSet = Array.from(new Set<number>((correctCols || []).map((x: any) => Number(x)))).sort((a: number, b: number) => a - b);
            if (pickedSet.length === wantSet.length && wantSet.every((c: number, i: number) => c === pickedSet[i])) {
              correctRowsCount++;
            }
          });
        }
        earned = correctRowsCount;
        isCorrect = numRows > 0 && correctRowsCount === numRows;
        feedback = isCorrect
          ? "All matrix rows matched correctly."
          : `${correctRowsCount}/${numRows} matrix rows correct (+${correctRowsCount} marks).`;
      } else {
        // Single, Multiple, True/False, Sequence, Code
        if (studentAns === undefined || studentAns === null) {
          isCorrect = false;
          feedback = "Not answered.";
        } else if (q.type === "single") {
          isCorrect = typeof studentAns !== "boolean" && studentAns !== "" && Number(studentAns) === Number(config.correctIndex);
        } else if (q.type === "multiple") {
          if (!Array.isArray(studentAns) || !Array.isArray(config.correctIndexes)) {
            isCorrect = false;
          } else {
            const studentSet = Array.from(new Set<number>(studentAns.map((x: any) => Number(x)))).sort((a: number, b: number) => a - b);
            const correctSet = Array.from(new Set<number>(config.correctIndexes.map((x: any) => Number(x)))).sort((a: number, b: number) => a - b);
            isCorrect = studentSet.length === correctSet.length && studentSet.every((val, idx) => val === correctSet[idx]);
          }
        } else if (q.type === "truefalse") {
          isCorrect = String(studentAns).toLowerCase() === String(config.correct).toLowerCase();
        } else if (q.type === "sequence") {
          const correctOrder = config.correctOrder || [];
          const items = config.items || [];
          if (!Array.isArray(studentAns) || studentAns.length !== correctOrder.length) {
            isCorrect = false;
          } else {
            isCorrect = studentAns.every((x: any, i: number) => {
              if (typeof x === "string") {
                const correctStr = items[correctOrder[i]];
                return String(x).trim() === String(correctStr || "").trim();
              }
              return Number(x) === Number(correctOrder[i]);
            });
          }
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
        earned = isCorrect ? qMarks : 0;
      }

      totalPossibleMarks += qMarks;
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
        config: {
          ...stripAnswers(q.type, config),
          headers: config.headers,
          rows: config.rows,
          draggables: config.draggables,
          correct: config.correct,
        },
        correctAnswer: getCorrectAnswerLabel(q.type, config),
        codeResults,
      };
    }

    const scorePercent = totalPossibleMarks > 0 ? Number(((earnedMarks / totalPossibleMarks) * 100).toFixed(2)) : 0;
    const passed = scorePercent >= Number(test.pass_mark || 84);
    const isPreview = isAdminPreview || isExplicitPreview;

    let attemptId = "preview-id";
    let dbSaveError: string | null = null;

    if (user?.id) {
      // 6. Store attempt in Supabase test_attempts table
      const fullRecord = {
        user_id: user.id,
        test_slug: id,
        test_id: id,
        answers: answers,
        score: earnedMarks,
        max_score: totalPossibleMarks,
        score_percent: scorePercent,
        passed: passed,
        per_question: perQuestionFeedback,
        started_at: startedAt,
        submitted_at: new Date().toISOString()
      };

      console.log("[test_attempts] Attempting full insert for user:", user.id, "test:", id);
      const resInsert = await db
        .from("test_attempts")
        .insert([fullRecord])
        .select()
        .single();

      if (resInsert.error) {
        console.error("[test_attempts] Full insert failed:", JSON.stringify(resInsert.error));
        // Fallback: minimal record without extended columns
        const standardRecord = {
          user_id: user.id,
          test_slug: id,
          answers: answers,
          score: earnedMarks,
          score_percent: scorePercent,
          passed: passed,
          started_at: startedAt,
          submitted_at: new Date().toISOString()
        };
        console.log("[test_attempts] Trying fallback minimal insert...");
        const fallbackInsert = await db
          .from("test_attempts")
          .insert([standardRecord])
          .select()
          .single();

        if (fallbackInsert.error) {
          console.error("[test_attempts] Fallback insert also failed:", JSON.stringify(fallbackInsert.error));
          console.error("[test_attempts] Fallback record:", JSON.stringify(standardRecord));
          // Don't block student from seeing results — save error for logging only
          dbSaveError = fallbackInsert.error.message;
        } else {
          attemptId = fallbackInsert.data.id;
          console.log("[test_attempts] Fallback insert succeeded. attemptId:", attemptId);
        }
      } else {
        attemptId = resInsert.data.id;
        console.log("[test_attempts] Full insert succeeded. attemptId:", attemptId);
      }
    }

    // 7. Return graded result details
    return NextResponse.json({
      success: true,
      score: earnedMarks,
      totalPossibleMarks,
      scorePercent,
      passed,
      passMark: test.pass_mark,
      gradedQuestions: perQuestionFeedback,
      attemptId: attemptId,
      isPreview: isPreview,
      dbSaveError: dbSaveError ?? undefined,
    });
  } catch (error: any) {
    console.error("POST mock test score error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
