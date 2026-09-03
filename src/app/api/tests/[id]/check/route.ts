import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";
import { evaluateStudentCode } from "@/lib/codeEvaluator";

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function getCorrectAnswerLabel(type: string, config: any) {
  if (!config) return "";
  if (type === "single") {
    const optText = config.options?.[config.correctIndex];
    const hasImage = Boolean(config.optionImages?.[config.correctIndex]);
    const label = optText ? optText : hasImage ? "(Image Option)" : `Option ${String.fromCharCode(65 + config.correctIndex)}`;
    return `Option ${String.fromCharCode(65 + config.correctIndex)}: ${label}`;
  }
  if (type === "multiple") {
    const labels = (config.correctIndexes || []).map((idx: number) => {
      const txt = config.options?.[idx];
      const hasImage = Boolean(config.optionImages?.[idx]);
      const label = txt ? txt : hasImage ? "(Image Option)" : `Option ${String.fromCharCode(65 + idx)}`;
      return `Option ${String.fromCharCode(65 + idx)}: ${label}`;
    });
    return labels.join(", ");
  }
  if (type === "truefalse") return config.correct ? "True" : "False";
  if (type === "dragtable" || type === "pivot_table") {
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await params;
    const db = getAdmin();

    if (!db) {
      return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
    }

    const body = await req.json();
    const { questionId, studentAnswer } = body;

    if (!questionId) {
      return NextResponse.json({ error: "Missing questionId." }, { status: 400 });
    }

    // 1. Fetch complete mock_test details
    const { data: test, error: testErr } = await db
      .from("mock_tests")
      .select("*")
      .eq("id", testId)
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
            { error: "Access denied. You must be enrolled in the course to check answers." },
            { status: 403 }
          );
        }
      }
    }

    // 4. Fetch the real question with answer configurations
    const { data: q, error: qErr } = await db
      .from("questions")
      .select("*")
      .eq("id", questionId)
      .eq("test_id", testId)
      .maybeSingle();

    if (qErr || !q) {
      return NextResponse.json({ error: "Failed to fetch question." }, { status: 404 });
    }

    let config = q.config || {};
    if (typeof config === "string") {
      try {
        config = JSON.parse(config);
      } catch {
        config = {};
      }
    }
    let isCorrect = false;

    if (studentAnswer === undefined || studentAnswer === null) {
      isCorrect = false;
    } else if (q.type === "dragtable" || q.type === "pivot_table") {
      const correct = config.correct || {};
      const slotKeys = Object.keys(correct);
      let correctSlotsCount = 0;
      if (typeof studentAnswer === "object" && studentAnswer !== null) {
        for (const key of slotKeys) {
          const studentVal = String(studentAnswer[key] || "").trim();
          const expectedVal = String(correct[key] || "").trim();
          if (studentVal.length > 0 && studentVal.toLowerCase() === expectedVal.toLowerCase()) {
            correctSlotsCount++;
          }
        }
      }
      isCorrect = slotKeys.length > 0 && correctSlotsCount === slotKeys.length;
    } else if (q.type === "dragdrop") {
      const correctPairs = config.correctPairs || [];
      const rightList = config.right || [];
      const numPairs = correctPairs.length > 0 ? correctPairs.length : 1;

      // Build positional lookup: leftIndex -> expected rightValue (string)
      const expectedByLeftIdx: Record<number, string> = {};
      for (const p of correctPairs) {
        expectedByLeftIdx[Number(p[0])] = String(rightList[p[1]] ?? "").trim();
      }

      let correctPairsCount = 0;
      if (Array.isArray(studentAnswer)) {
        studentAnswer.forEach((pair: any, slotIdx: number) => {
          if (!Array.isArray(pair) || pair.length !== 2) return;
          const [, r] = pair;
          const expected = expectedByLeftIdx[slotIdx];
          if (expected !== undefined && String(r ?? "").trim() === expected) {
            correctPairsCount++;
          }
        });
      }
      isCorrect = numPairs > 0 && correctPairsCount === numPairs;
    } else if (q.type === "fillblank") {
      const blanks = config.blanks || [];
      const numBlanks = blanks.length > 0 ? blanks.length : 1;
      let correctBlanksCount = 0;
      if (Array.isArray(studentAnswer)) {
        blanks.forEach((b: any, idx: number) => {
          const accepted = b?.accepted || [];
          const cleanAns = (studentAnswer[idx] || "").toString().trim().toLowerCase();
          if (accepted.map((a: string) => (a || "").toString().trim().toLowerCase()).includes(cleanAns)) {
            correctBlanksCount++;
          }
        });
      }
      isCorrect = numBlanks > 0 && correctBlanksCount === numBlanks;
    } else if (q.type === "matrix") {
      const correctRows = config.correct || [];
      const numRows = correctRows.length > 0 ? correctRows.length : 1;
      let correctRowsCount = 0;
      if (Array.isArray(studentAnswer)) {
        correctRows.forEach((correctCols: number[], rowIdx: number) => {
          const pickedSet = Array.from(new Set<number>((Array.isArray(studentAnswer[rowIdx]) ? studentAnswer[rowIdx] : []).map((x: any) => Number(x)))).sort((a: number, b: number) => a - b);
          const wantSet = Array.from(new Set<number>((correctCols || []).map((x: any) => Number(x)))).sort((a: number, b: number) => a - b);
          if (pickedSet.length === wantSet.length && wantSet.every((c: number, i: number) => c === pickedSet[i])) {
            correctRowsCount++;
          }
        });
      }
      isCorrect = numRows > 0 && correctRowsCount === numRows;
    } else if (q.type === "single") {
      isCorrect = typeof studentAnswer !== "boolean" && studentAnswer !== "" && Number(studentAnswer) === Number(config.correctIndex);
    } else if (q.type === "multiple") {
      if (!Array.isArray(studentAnswer) || !Array.isArray(config.correctIndexes)) {
        isCorrect = false;
      } else {
        const studentSet = Array.from(new Set<number>(studentAnswer.map((x: any) => Number(x)))).sort((a: number, b: number) => a - b);
        const correctSet = Array.from(new Set<number>(config.correctIndexes.map((x: any) => Number(x)))).sort((a: number, b: number) => a - b);
        isCorrect = studentSet.length === correctSet.length && studentSet.every((val, idx) => val === correctSet[idx]);
      }
    } else if (q.type === "truefalse") {
      isCorrect = String(studentAnswer).toLowerCase() === String(config.correct).toLowerCase();
    } else if (q.type === "sequence") {
      const correctOrder = config.correctOrder || [];
      const items = config.items || [];
      if (!Array.isArray(studentAnswer) || studentAnswer.length !== correctOrder.length) {
        isCorrect = false;
      } else {
        isCorrect = studentAnswer.every((x: any, i: number) => {
          if (typeof x === "string") {
            const correctStr = items[correctOrder[i]];
            return String(x).trim() === String(correctStr || "").trim();
          }
          return Number(x) === Number(correctOrder[i]);
        });
      }
    } else if (q.type === "code") {
      const evalRes = await evaluateStudentCode(studentAnswer, config);
      return NextResponse.json({
        correct: evalRes.isCorrect,
        correctAnswerLabel: evalRes.feedback,
        explanation: config.explanation || evalRes.feedback,
        codeResults: evalRes.testCaseResults,
      });
    }

    const correctAnswerLabel = getCorrectAnswerLabel(q.type, config);

    return NextResponse.json({
      correct: isCorrect,
      correctAnswerLabel,
      explanation: config.explanation || "",
      correctIndex: config.correctIndex,
      correctIndexes: config.correctIndexes,
      correctTF: config.correct,
    });
  } catch (error: any) {
    console.error("Check single answer error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
