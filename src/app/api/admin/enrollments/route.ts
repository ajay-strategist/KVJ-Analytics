import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function isAuthorized(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase not configured." },
      { status: 500 }
    );
  }

  try {
    // 1. Fetch all enrollments with student profile detail columns
    const { data: enrollments, error: enrollError } = await supabaseAdmin
      .from("enrollments")
      .select(`
        id,
        course_slug,
        enrollment_method,
        status,
        created_at,
        profiles (
          name,
          organization,
          phone
        )
      `)
      .order("created_at", { ascending: false });

    if (enrollError) throw enrollError;

    // 2. Fetch mock test attempts with student name and organization
    const { data: attempts, error: attemptError } = await supabaseAdmin
      .from("test_attempts")
      .select(`
        id,
        test_slug,
        score,
        passed,
        started_at,
        submitted_at,
        profiles (
          name,
          organization
        )
      `)
      .order("submitted_at", { ascending: false });

    if (attemptError) throw attemptError;

    // 3. Fetch paid orders with student profile names
    const { data: orders, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        course_slug,
        amount,
        razorpay_order_id,
        razorpay_payment_id,
        status,
        created_at,
        profiles (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (orderError) throw orderError;

    return NextResponse.json({ enrollments, attempts, orders });
  } catch (error: any) {
    console.error("Failed to fetch admin learning records:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
