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

/** Finance ledger: revenue totals + the paid/refunded transaction list. Read-only. */
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const { data, error } = await db.from("orders").select("*, profiles(name)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const slugs = [...new Set(rows.map((o: any) => o.course_slug).filter(Boolean))];
  const { data: courseRows } = slugs.length ? await db.from("courses").select("slug, title").in("slug", slugs) : { data: [] };
  const titleBySlug: Record<string, string> = {};
  (courseRows ?? []).forEach((c: any) => { titleBySlug[c.slug] = c.title; });
  const paid = rows.filter((o: any) => o.status === "paid");
  const refunded = rows.filter((o: any) => o.status === "refunded");
  const now = new Date();
  const thisMonth = paid.filter((o: any) => {
    const d = new Date(o.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totals = {
    totalRevenue: paid.reduce((s: number, o: any) => s + Number(o.amount || 0), 0),
    monthRevenue: thisMonth.reduce((s: number, o: any) => s + Number(o.amount || 0), 0),
    refundedAmount: refunded.reduce((s: number, o: any) => s + Number(o.amount || 0), 0),
    paidCount: paid.length,
    pendingCount: rows.filter((o: any) => o.status === "pending").length,
    failedCount: rows.filter((o: any) => o.status === "failed").length,
  };

  const transactions = rows
    .filter((o: any) => o.status === "paid" || o.status === "refunded")
    .map((o: any) => ({
      id: o.id, student_name: o.profiles?.name ?? "—", course_title: titleBySlug[o.course_slug] ?? o.course_slug,
      amount: o.amount, currency: o.currency, status: o.status, razorpay_payment_id: o.razorpay_payment_id, created_at: o.created_at,
    }));

  return NextResponse.json({ totals, transactions });
}
