import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabaseAdmin";
import { adminToken } from "@/lib/adminAuth";

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
          email,
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

    // 4. Fetch batches configured for this active course
    const { data: courseBatches, error: batchesErr } = await supabaseAdmin
      .from("batches")
      .select("id, college_name, course_slug, valid_from, valid_to, active, created_at")
      .eq("course_slug", activeCourse.slug)
      .order("college_name", { ascending: true });

    if (batchesErr) {
      console.warn("Error fetching course batches:", batchesErr);
    }

    const batchIds = (courseBatches || []).map((b: any) => b.id);

    // 5. Fetch all batch students roster for these batches
    let batchStudents: any[] = [];
    if (batchIds.length > 0) {
      const { data: bsData, error: bsErr } = await supabaseAdmin
        .from("batch_students")
        .select("id, batch_id, name, email, phone, status, profile_id, student_id, department, added_at, batches(id, college_name, course_slug)")
        .in("batch_id", batchIds)
        .order("added_at", { ascending: true });

      if (bsErr) {
        console.warn("Error fetching batch students:", bsErr);
      } else if (bsData) {
        batchStudents = bsData;
      }
    }

    // 6. Resolve Auth Emails directly from loaded profiles
    let emailMap: Record<string, string> = {};
    (enrollments || []).forEach((e: any) => {
      const pEmail = e.profiles?.email;
      if (e.user_id && pEmail) {
        emailMap[e.user_id] = pEmail;
      }
    });

    // Helper to clean phone for matching
    const cleanPhone = (p: any): string => {
      if (!p) return "";
      return String(p).replace(/\D/g, "");
    };

    // Link batch students to enrollments
    const linkedBatchStudentIds = new Set<string>();
    const batchMap: Record<string, string> = {};
    const batchIdMap: Record<string, string> = {};

    // 6a. First match by profile_id
    batchStudents.forEach((bs: any) => {
      if (bs.profile_id && userIds.includes(bs.profile_id)) {
        batchMap[bs.profile_id] = bs.batches?.college_name || bs.department || "Batch";
        batchIdMap[bs.profile_id] = bs.batch_id;
        linkedBatchStudentIds.add(bs.id);
      }
    });

    // 6b. Then match by email or phone
    (enrollments || []).forEach((enroll: any) => {
      const uId = enroll.user_id;
      if (batchMap[uId]) return;

      const profile = enroll.profiles || {};
      const uEmail = (emailMap[uId] || "").trim().toLowerCase();
      const uPhone = cleanPhone(profile.phone);

      const matchedBs = batchStudents.find((bs: any) => {
        if (linkedBatchStudentIds.has(bs.id)) return false;
        const bsEmail = (bs.email || "").trim().toLowerCase();
        const bsPhone = cleanPhone(bs.phone);
        return (uEmail && bsEmail && uEmail === bsEmail) || (uPhone && bsPhone && uPhone === bsPhone);
      });

      if (matchedBs) {
        batchMap[uId] = matchedBs.batches?.college_name || matchedBs.department || "Batch";
        batchIdMap[uId] = matchedBs.batch_id;
        linkedBatchStudentIds.add(matchedBs.id);
      }
    });

    // 7. Fetch Activity Results (Topic completions) for active course
    const { data: activityResults, error: actErr } = await supabaseAdmin
      .from("activity_results")
      .select("id, user_id, lesson_id, score, max_score, score_percent, passed, submitted_at")
      .eq("course_slug", activeCourse.slug);

    if (actErr) throw actErr;

    // 8. Fetch Mock Test attempts for active course
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

    // 9. Calculate Student Matrix Rows for enrolled students
    let totalCompletionAccumulator = 0;
    let totalScoreAccumulator = 0;
    let scoredStudentsCount = 0;
    let passedAssessmentsCount = 0;
    let completedCourseCount = 0;

    const studentMatrixRows: any[] = (enrollments || []).map((enroll: any) => {
      const uId = enroll.user_id;
      const profile = enroll.profiles || {};
      const studentName = profile.full_name || profile.name || "Student";
      const email = emailMap[uId] || "student@kvjanalytics.com";
      const collegeOrOrg = batchMap[uId] || profile.organization || "Individual";
      const batchId = batchIdMap[uId] || null;

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
        batchId,
        accountType: profile.account_type || "individual",
        enrollmentMethod: enroll.enrollment_method,
        enrolledAt: enroll.created_at,
        status: "JOINED",
        isInvited: false,
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

    // 10. Add invited roster students (students in batch_students who have not enrolled yet)
    const unlinkedBatchStudents = batchStudents.filter((bs: any) => !linkedBatchStudentIds.has(bs.id));

    unlinkedBatchStudents.forEach((bs: any) => {
      const bName = bs.batches?.college_name || bs.department || "Batch";

      // Default empty module progress
      const emptyModuleProgress: Record<string, { moduleId: string; moduleTitle: string; total: number; completed: number; pct: number }> = {};
      sortedModules.forEach((m: any) => {
        emptyModuleProgress[m.id] = {
          moduleId: m.id,
          moduleTitle: m.title,
          total: m.lessons.length,
          completed: 0,
          pct: 0,
        };
      });

      // Default empty topic statuses
      const emptyTopicStatuses: Record<string, { completed: boolean; status: "Yes" | ""; score: number | null; maxScore: number | null; passed: boolean | null; submittedAt: string | null }> = {};
      allLessons.forEach((lesson: any) => {
        emptyTopicStatuses[lesson.id] = {
          completed: false,
          status: "",
          score: null,
          maxScore: lesson.max_score || null,
          passed: null,
          submittedAt: null,
        };
      });

      studentMatrixRows.push({
        studentId: `roster-${bs.id}`,
        studentName: bs.name || "Student",
        email: bs.email || "—",
        phone: bs.phone || "—",
        organization: bName,
        batchId: bs.batch_id,
        accountType: "invited",
        enrollmentMethod: "batch_roster",
        enrolledAt: bs.added_at,
        status: bs.status || "INVITED",
        isInvited: true,
        completedTopicsCount: 0,
        totalTopicsCount: totalCourseTopics,
        courseCompletionPct: 0,
        avgModuleCompletionPct: 0,
        avgActivityScorePct: null,
        assessmentScore: null,
        assessmentPassed: null,
        assessmentAttempts: 0,
        moduleProgress: emptyModuleProgress,
        topicStatuses: emptyTopicStatuses,
      });
    });

    // 11. Compute detailed batch progress summaries for each batch
    const batchSummaries = (courseBatches || []).map((b: any) => {
      const bStudents = studentMatrixRows.filter(
        (s) => s.batchId === b.id || s.organization === b.college_name
      );
      const total = bStudents.length;
      const joined = bStudents.filter((s) => !s.isInvited || s.status === "JOINED").length;
      const invited = bStudents.filter((s) => s.isInvited && s.status === "INVITED").length;
      const completed = bStudents.filter((s) => s.courseCompletionPct >= 100).length;
      const inProgress = bStudents.filter((s) => s.courseCompletionPct > 0 && s.courseCompletionPct < 100).length;
      const notStarted = bStudents.filter((s) => s.courseCompletionPct === 0).length;

      const sumPct = bStudents.reduce((acc, s) => acc + (s.courseCompletionPct || 0), 0);
      const avgCompletion = total > 0 ? Number((sumPct / total).toFixed(1)) : 0;
      const joinedSumPct = bStudents.filter((s) => !s.isInvited).reduce((acc, s) => acc + (s.courseCompletionPct || 0), 0);
      const avgJoinedCompletion = joined > 0 ? Number((joinedSumPct / joined).toFixed(1)) : 0;

      const passedAssessments = bStudents.filter((s) => s.assessmentPassed).length;
      const passRate = joined > 0 ? Number(((passedAssessments / joined) * 100).toFixed(1)) : 0;

      return {
        id: b.id,
        name: b.college_name,
        courseSlug: b.course_slug,
        validFrom: b.valid_from,
        validTo: b.valid_to,
        active: b.active,
        totalStudents: total,
        joinedStudents: joined,
        invitedStudents: invited,
        inProgressStudents: inProgress,
        notStartedStudents: notStarted,
        completedCount: completed,
        avgCompletionPct: avgCompletion,
        avgJoinedCompletionPct: avgJoinedCompletion,
        passRatePct: passRate,
      };
    });

    const studentCount = studentMatrixRows.length;
    const enrolledCount = (enrollments || []).length;
    const avgOverallCompletion = studentCount > 0 ? Number((totalCompletionAccumulator / studentCount).toFixed(1)) : 0;
    const avgOverallScore = scoredStudentsCount > 0 ? Number((totalScoreAccumulator / scoredStudentsCount).toFixed(1)) : 0;
    const overallPassRate = enrolledCount > 0 ? Number(((passedAssessmentsCount / enrolledCount) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      courses: (courses || []).map((c: any) => ({ id: c.id, title: c.title, slug: c.slug })),
      activeCourse: {
        id: activeCourse.id,
        title: activeCourse.title,
        slug: activeCourse.slug,
        totalModules: sortedModules.length,
        totalTopics: totalCourseTopics,
      },
      batches: batchSummaries,
      modules: sortedModules,
      students: studentMatrixRows,
      kpis: {
        totalStudents: studentCount,
        enrolledStudents: enrolledCount,
        invitedStudents: unlinkedBatchStudents.length,
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
