import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminToken } from "@/lib/adminAuth";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function isAuthorized(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return session === adminToken();
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase client not configured." }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const selectedCourseSlug = searchParams.get("course_slug");

    // 1. Fetch all available courses
    const { data: courses, error: coursesErr } = await supabaseAdmin
      .from("courses")
      .select("id, title, slug, duration, fee_inr, is_published")
      .order("title", { ascending: true });

    if (coursesErr) throw coursesErr;

    // Determine active course slug (default to first course if not specified)
    const activeCourseSlug = selectedCourseSlug || (courses && courses.length > 0 ? courses[0].slug : null);

    if (!activeCourseSlug) {
      return NextResponse.json({
        courses: [],
        activeCourse: null,
        modules: [],
        students: [],
        kpis: { totalStudents: 0, avgCompletionPct: 0, avgScorePct: 0, passRatePct: 0, completedCount: 0 }
      });
    }

    const activeCourse = courses?.find((c: any) => c.slug === activeCourseSlug) || courses?.[0];

    // 2. Fetch Modules & Lessons for the active course
    const { data: modulesData, error: modulesErr } = await supabaseAdmin
      .from("modules")
      .select(`
        id,
        title,
        display_order,
        lessons (
          id,
          title,
          kind,
          max_score,
          display_order
        )
      `)
      .eq("course_id", activeCourse.id)
      .order("display_order", { ascending: true });

    if (modulesErr) throw modulesErr;

    // Clean and sort modules & lessons
    const sortedModules = (modulesData || []).map((m: any, mIdx: number) => {
      const sortedLessons = (m.lessons || []).sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
      return {
        id: m.id,
        title: m.title,
        display_order: m.display_order ?? mIdx,
        lessons: sortedLessons.map((l: any, lIdx: number) => ({
          id: l.id,
          title: l.title,
          kind: l.kind,
          max_score: l.max_score || 0,
          display_order: l.display_order ?? lIdx,
          module_id: m.id,
          module_title: m.title,
        }))
      };
    });

    const allLessons = sortedModules.flatMap((m: any) => m.lessons);
    const totalCourseTopics = allLessons.length;

    // 3. Fetch enrollments for active course
    const { data: enrollments, error: enrollErr } = await supabaseAdmin
      .from("enrollments")
      .select(`
        id,
        user_id,
        course_slug,
        enrollment_method,
        status,
        created_at,
        profiles (
          id,
          name,
          full_name,
          organization,
          phone,
          role,
          account_type
        )
      `)
      .eq("course_slug", activeCourse.slug)
      .order("created_at", { ascending: false });

    if (enrollErr) throw enrollErr;

    const userIds = (enrollments || []).map((e: any) => e.user_id).filter(Boolean);

    // 4. Resolve Auth Emails & Batch Names for enrolled users
    let emailMap: Record<string, string> = {};
    try {
      const { data: usersPage } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      if (usersPage?.users) {
        usersPage.users.forEach((u: any) => {
          emailMap[u.id] = u.email;
        });
      }
    } catch (_) {
      // Non-fatal if listUsers fails in mock mode
    }

    let batchMap: Record<string, string> = {};
    if (userIds.length > 0) {
      try {
        const { data: bStudents } = await supabaseAdmin
          .from("batch_students")
          .select("profile_id, email, batches(college_name)")
          .in("profile_id", userIds);

        if (bStudents) {
          bStudents.forEach((bs: any) => {
            if (bs.profile_id && bs.batches?.college_name) {
              batchMap[bs.profile_id] = bs.batches.college_name;
            }
          });
        }
      } catch (_) {}
    }

    // 5. Fetch Activity Results (Topic completions) for active course
    const { data: activityResults, error: actErr } = await supabaseAdmin
      .from("activity_results")
      .select("id, user_id, lesson_id, score, max_score, score_percent, passed, submitted_at")
      .eq("course_slug", activeCourse.slug);

    if (actErr) throw actErr;

    // 6. Fetch Mock Test attempts for active course
    const { data: testAttempts, error: testErr } = await supabaseAdmin
      .from("test_attempts")
      .select(`
        id,
        user_id,
        test_id,
        score,
        passed,
        submitted_at,
        mock_tests (
          id,
          course_id,
          title,
          pass_mark
        )
      `)
      .order("submitted_at", { ascending: false });

    if (testErr) throw testErr;

    // Filter test attempts for active course
    const courseTestAttempts = (testAttempts || []).filter((ta: any) => ta.mock_tests?.course_id === activeCourse.id);

    // Build Activity Map: userId -> lessonId -> activityResult
    const userActivityMap: Record<string, Record<string, any>> = {};
    (activityResults || []).forEach((ar: any) => {
      if (!userActivityMap[ar.user_id]) {
        userActivityMap[ar.user_id] = {};
      }
      userActivityMap[ar.user_id][ar.lesson_id] = ar;
    });

    // Build Test Attempts Map: userId -> best score & pass
    const userTestMap: Record<string, { highestScore: number; passed: boolean; attemptsCount: number; latestSubmittedAt: string | null }> = {};
    courseTestAttempts.forEach((ta: any) => {
      const uId = ta.user_id;
      if (!userTestMap[uId]) {
        userTestMap[uId] = { highestScore: ta.score, passed: !!ta.passed, attemptsCount: 1, latestSubmittedAt: ta.submitted_at };
      } else {
        userTestMap[uId].attemptsCount += 1;
        if (ta.score > userTestMap[uId].highestScore) {
          userTestMap[uId].highestScore = ta.score;
        }
        if (ta.passed) {
          userTestMap[uId].passed = true;
        }
      }
    });

    // 7. Calculate Student Matrix Rows
    let totalCompletionAccumulator = 0;
    let totalScoreAccumulator = 0;
    let scoredStudentsCount = 0;
    let passedAssessmentsCount = 0;
    let completedCourseCount = 0;

    const studentMatrixRows = (enrollments || []).map((enroll: any) => {
      const uId = enroll.user_id;
      const profile = enroll.profiles || {};
      const studentName = profile.full_name || profile.name || "Student";
      const email = emailMap[uId] || "student@kvjanalytics.com";
      const collegeOrOrg = batchMap[uId] || profile.organization || "Individual";

      const userActivities = userActivityMap[uId] || {};
      let completedLessonsCount = 0;
      let userScoreSum = 0;
      let userScoredActivitiesCount = 0;

      // Build topic completion map: lessonId -> { completed: boolean, status: 'Yes' | '', score: number }
      const topicStatuses: Record<string, { completed: boolean; status: "Yes" | ""; score: number | null; maxScore: number | null; passed: boolean | null; submittedAt: string | null }> = {};

      allLessons.forEach((lesson: any) => {
        const act = userActivities[lesson.id];
        if (act) {
          completedLessonsCount++;
          topicStatuses[lesson.id] = {
            completed: true,
            status: "Yes",
            score: act.score ?? null,
            maxScore: act.max_score ?? lesson.max_score ?? null,
            passed: act.passed ?? true,
            submittedAt: act.submitted_at,
          };
          if (act.score_percent !== null && act.score_percent !== undefined) {
            userScoreSum += Number(act.score_percent);
            userScoredActivitiesCount++;
          }
        } else {
          topicStatuses[lesson.id] = {
            completed: false,
            status: "",
            score: null,
            maxScore: lesson.max_score || null,
            passed: null,
            submittedAt: null,
          };
        }
      });

      // Calculate Module-wise completion %
      const moduleProgress: Record<string, { moduleId: string; moduleTitle: string; total: number; completed: number; pct: number }> = {};
      let modulePctSum = 0;

      sortedModules.forEach((m: any) => {
        const modTotal = m.lessons.length;
        const modCompleted = m.lessons.filter((l: any) => !!userActivities[l.id]).length;
        const modPct = modTotal > 0 ? Number(((modCompleted / modTotal) * 100).toFixed(1)) : 0;

        moduleProgress[m.id] = {
          moduleId: m.id,
          moduleTitle: m.title,
          total: modTotal,
          completed: modCompleted,
          pct: modPct,
        };
        modulePctSum += modPct;
      });

      // Overall Course Completion %
      const courseCompletionPct = totalCourseTopics > 0 
        ? Number(((completedLessonsCount / totalCourseTopics) * 100).toFixed(1))
        : 0;

      const avgModuleCompletionPct = sortedModules.length > 0 
        ? Number((modulePctSum / sortedModules.length).toFixed(1))
        : 0;

      const avgActivityScorePct = userScoredActivitiesCount > 0 
        ? Number((userScoreSum / userScoredActivitiesCount).toFixed(1))
        : null;

      const testInfo = userTestMap[uId] || { highestScore: null, passed: null, attemptsCount: 0, latestSubmittedAt: null };

      // Accumulate for High-Level KPIs
      totalCompletionAccumulator += courseCompletionPct;
      if (avgActivityScorePct !== null) {
        totalScoreAccumulator += avgActivityScorePct;
        scoredStudentsCount++;
      }
      if (testInfo.passed) {
        passedAssessmentsCount++;
      }
      if (courseCompletionPct >= 100) {
        completedCourseCount++;
      }

      return {
        studentId: uId,
        studentName,
        email,
        phone: profile.phone || "",
        organization: collegeOrOrg,
        accountType: profile.account_type || "individual",
        enrollmentMethod: enroll.enrollment_method,
        enrolledAt: enroll.created_at,
        completedTopicsCount: completedLessonsCount,
        totalTopicsCount: totalCourseTopics,
        courseCompletionPct,
        avgModuleCompletionPct,
        avgActivityScorePct,
        assessmentScore: testInfo.highestScore,
        assessmentPassed: testInfo.passed,
        assessmentAttempts: testInfo.attemptsCount,
        moduleProgress,
        topicStatuses,
      };
    });

    const studentCount = studentMatrixRows.length;
    const avgOverallCompletion = studentCount > 0 ? Number((totalCompletionAccumulator / studentCount).toFixed(1)) : 0;
    const avgOverallScore = scoredStudentsCount > 0 ? Number((totalScoreAccumulator / scoredStudentsCount).toFixed(1)) : 0;
    const overallPassRate = studentCount > 0 ? Number(((passedAssessmentsCount / studentCount) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      courses: (courses || []).map((c: any) => ({ id: c.id, title: c.title, slug: c.slug })),
      activeCourse: {
        id: activeCourse.id,
        title: activeCourse.title,
        slug: activeCourse.slug,
        totalModules: sortedModules.length,
        totalTopics: totalCourseTopics,
      },
      modules: sortedModules,
      students: studentMatrixRows,
      kpis: {
        totalStudents: studentCount,
        avgCompletionPct: avgOverallCompletion,
        avgScorePct: avgOverallScore,
        passRatePct: overallPassRate,
        completedCount: completedCourseCount,
      }
    });
  } catch (error: any) {
    console.error("Failed to generate learning reports:", error);
    return NextResponse.json({ error: error.message || "Failed to generate report." }, { status: 500 });
  }
}
