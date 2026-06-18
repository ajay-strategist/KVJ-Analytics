import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { client as sanityClient } from "@/sanity/lib/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// GET: Returns test details and questions *without* correctIndex
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
    }

    // 1. Fetch test details from Sanity
    const test = await sanityClient.fetch(
      `*[_type == "mockTest" && _id == $id][0] {
        _id,
        title,
        durationMins,
        passMark,
        questions[] {
          stem,
          options,
          marks
        },
        "courseSlug": course->slug.current
      }`,
      { id }
    );

    if (!test) {
      return NextResponse.json({ error: "Mock test not found." }, { status: 404 });
    }

    // 2. Validate session from cookie
    const token = req.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid auth token." }, { status: 401 });
    }

    // 3. Allow admins or check student enrollment
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      const { data: enrollment, error: enrollError } = await supabaseAdmin
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_slug", test.courseSlug)
        .eq("status", "active")
        .maybeSingle();

      if (enrollError || !enrollment) {
        return NextResponse.json(
          { error: "Access denied. You must be enrolled in the course to take this mock test." },
          { status: 403 }
        );
      }
    }

    // Return the sanitized test (correctIndex stripped)
    return NextResponse.json({ test });
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
    const body = await req.json();
    const { answers, startedAt } = body; // answers is an array of indices, e.g. [1, 0, null, 2]

    if (!answers || !startedAt) {
      return NextResponse.json({ error: "Submission is missing answers or started timestamp." }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
    }

    // 1. Fetch complete test (with correctIndex keys) from Sanity
    const test = await sanityClient.fetch(
      `*[_type == "mockTest" && _id == $id][0] {
        _id,
        title,
        durationMins,
        passMark,
        questions[] {
          stem,
          options,
          correctIndex,
          marks
        },
        "courseSlug": course->slug.current
      }`,
      { id }
    );

    if (!test) {
      return NextResponse.json({ error: "Mock test not found." }, { status: 404 });
    }

    // 2. Validate session
    const token = req.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Invalid auth session." }, { status: 401 });
    }

    // 3. Allow admins or verify enrollment
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";

    if (!isAdmin) {
      const { data: enrollment, error: enrollError } = await supabaseAdmin
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_slug", test.courseSlug)
        .eq("status", "active")
        .maybeSingle();

      if (enrollError || !enrollment) {
        return NextResponse.json(
          { error: "Access denied. You must be enrolled in the course to evaluate this mock test." },
          { status: 403 }
        );
      }
    }

    // 4. Score answers on the server side
    let earnedMarks = 0;
    let totalPossibleMarks = 0;
    const questionsList = test.questions || [];

    const gradedQuestions = questionsList.map((q: any, idx: number) => {
      const questionMarks = q.marks || 1;
      totalPossibleMarks += questionMarks;

      const studentChoice = answers[idx];
      const correctIdx = q.correctIndex;
      const isCorrect = studentChoice !== undefined && studentChoice !== null && Number(studentChoice) === Number(correctIdx);

      if (isCorrect) {
        earnedMarks += questionMarks;
      }

      return {
        stem: q.stem,
        options: q.options,
        correctIndex: correctIdx,
        studentIndex: studentChoice,
        isCorrect,
        marks: questionMarks
      };
    });

    const passed = earnedMarks >= test.passMark;

    // 5. Store attempt in Supabase test_attempts table
    const { data: attemptRecord, error: dbError } = await supabaseAdmin
      .from("test_attempts")
      .insert([
        {
          user_id: user.id,
          test_slug: id, // store test ID here
          answers: answers, // save student response array
          score: earnedMarks,
          passed: passed,
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

    // 6. Return response containing answers feedback
    return NextResponse.json({
      success: true,
      score: earnedMarks,
      totalPossibleMarks,
      passed,
      passMark: test.passMark,
      gradedQuestions,
      attemptId: attemptRecord.id
    });
  } catch (error: any) {
    console.error("POST mock test score error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
