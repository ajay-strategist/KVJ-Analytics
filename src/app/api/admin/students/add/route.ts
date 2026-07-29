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

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const db = getAdmin();
  if (!db) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  try {
    const body = await req.json();
    const { name, email, phone, password, account_type, course_id } = body;

    if (!name || !email || !password || !account_type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Format phone to E.164 if provided
    let formattedPhone = phone?.trim();
    if (formattedPhone) {
      if (!formattedPhone.startsWith("+")) {
        // Assume Indian country code if missing
        formattedPhone = `+91${formattedPhone.replace(/\D/g, "")}`;
      }
    }

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await db.auth.admin.createUser({
      email,
      password,
      phone: formattedPhone || undefined,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        full_name: name,
        account_type,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Update profile with phone and account_type 
    // (A trigger usually creates the profile, so we just update it)
    await db.from("profiles").update({
      phone: formattedPhone,
      full_name: name,
      account_type,
      role: "student"
    }).eq("id", userId);

    // 3. Enroll in course if selected
    if (course_id) {
      const { data: courseData } = await db.from("courses").select("slug").eq("id", course_id).single();
      if (courseData) {
        await db.from("enrollments").insert({
          user_id: userId,
          course_slug: courseData.slug,
          status: "active",
          enrollment_method: account_type === "college" ? "college_code" : "admin_manual"
        });
      }
    }

    return NextResponse.json({ success: true, user: authData.user });

  } catch (err: any) {
    console.error("Add Student API Error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred" }, { status: 500 });
  }
}
