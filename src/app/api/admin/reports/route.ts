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

function monthKey(d: string) {
  const dt = new Date(d);
  return `${dt.toLocaleString("en-IN", { month: "short" })} ${dt.getFullYear()}`;
}
function lastNMonthKeys(n: number) {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(`${d.toLocaleString("en-IN", { month: "short" })} ${d.getFullYear()}`);
  }
  return out;
}

/** Cross-module reports, all computed from real rows — nothing fabricated. */
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const [enrollmentsRes, ordersRes, leadsRes, coursesRes] = await Promise.all([
    db.from("enrollments").select("course_slug, created_at"),
    db.from("orders").select("amount, status, created_at"),
    db.from("leads").select("status, source_page, created_at"),
    db.from("courses").select("id, title, slug"),
  ]);

  const enrollments = enrollmentsRes.data ?? [];
  const orders = ordersRes.data ?? [];
  const leads = leadsRes.data ?? [];
  const courses = couresTitleMap(coursesRes.data ?? []);

  const months = lastNMonthKeys(6);
  const enrollmentsByMonth = months.map((m) => ({ label: m, value: enrollments.filter((e: any) => monthKey(e.created_at) === m).length }));
  const revenueByMonth = months.map((m) => ({
    label: m,
    value: orders.filter((o: any) => o.status === "paid" && monthKey(o.created_at) === m).reduce((s: number, o: any) => s + Number(o.amount || 0), 0),
  }));

  const bySlug: Record<string, number> = {};
  enrollments.forEach((e: any) => { bySlug[e.course_slug] = (bySlug[e.course_slug] || 0) + 1; });
  const topCourses = Object.entries(bySlug)
    .map(([slug, count]) => ({ label: courses[slug] || slug, value: count }))
    .sort((a, b) => b.value - a.value).slice(0, 8);

  const leadStatus: Record<string, number> = {};
  leads.forEach((l: any) => { leadStatus[l.status] = (leadStatus[l.status] || 0) + 1; });
  const leadsByStatus = Object.entries(leadStatus).map(([label, value]) => ({ label, value }));

  const leadSource: Record<string, number> = {};
  leads.forEach((l: any) => { const s = l.source_page || "direct"; leadSource[s] = (leadSource[s] || 0) + 1; });
  const leadsBySource = Object.entries(leadSource).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8);

  return NextResponse.json({ enrollmentsByMonth, revenueByMonth, topCourses, leadsByStatus, leadsBySource });
}

function couresTitleMap(courses: any[]) {
  const m: Record<string, string> = {};
  courses.forEach((c) => { m[c.slug] = c.title; });
  return m;
}
