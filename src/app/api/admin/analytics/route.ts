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

function isAuthenticated(req: NextRequest) {
  return req.cookies.get("admin_session")?.value === adminToken();
}

/**
 * Learning + lead analytics computed from real DB rows. This is deliberately scoped to what the
 * platform actually tracks server-side — website traffic/behavior analytics live in Google
 * Analytics / Meta Pixel (client-side, wired via env vars) rather than being duplicated here.
 */
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const [attemptsRes, enrollmentsRes, leadsRes, studentsRes] = await Promise.all([
    db.from("test_attempts").select("passed"),
    db.from("enrollments").select("enrollment_method, status"),
    db.from("leads").select("status"),
    db.from("profiles").select("account_type").eq("role", "student"),
  ]);

  const attempts = attemptsRes.data ?? [];
  const enrollments = enrollmentsRes.data ?? [];
  const leads = leadsRes.data ?? [];
  const students = studentsRes.data ?? [];

  const passRate = attempts.length ? Math.round((attempts.filter((a: any) => a.passed).length / attempts.length) * 100) : null;

  const byMethod: Record<string, number> = {};
  enrollments.forEach((e: any) => { byMethod[e.enrollment_method] = (byMethod[e.enrollment_method] || 0) + 1; });

  const byAccountType: Record<string, number> = {};
  students.forEach((s: any) => { const t = s.account_type || "individual"; byAccountType[t] = (byAccountType[t] || 0) + 1; });

  const funnel = [
    { label: "New", value: leads.filter((l: any) => l.status === "new").length },
    { label: "Contacted", value: leads.filter((l: any) => l.status === "contacted").length },
    { label: "Closed", value: leads.filter((l: any) => l.status === "closed").length },
  ];

  return NextResponse.json({
    testAttempts: attempts.length,
    passRate,
    enrollmentsByMethod: Object.entries(byMethod).map(([label, value]) => ({ label, value })),
    studentsByAccountType: Object.entries(byAccountType).map(([label, value]) => ({ label, value })),
    leadFunnel: funnel,
    activeCompletedEnrollments: enrollments.filter((e: any) => e.status === "completed").length,
    gaConfigured: !!process.env.NEXT_PUBLIC_GA_ID,
    metaPixelConfigured: !!process.env.NEXT_PUBLIC_META_PIXEL,
  });
}
