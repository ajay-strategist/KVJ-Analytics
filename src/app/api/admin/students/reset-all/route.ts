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
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdmin();
  if (!db) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const targetPassword = body.password || "password";
    const batchId = body.batchId || null;

    if (targetPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // 1. Get all admin profile IDs to exclude them from reset
    const { data: adminProfiles } = await db.from("profiles").select("id").eq("role", "admin");
    const adminIds = new Set((adminProfiles || []).map((p: any) => p.id));
    const adminEmails = new Set(["mail@thestrategist.co.in", "info@kvjanalytics.in", "ajaythomas218@gmail.com"]);

    // 2. Fetch target users
    let targetUserIds: string[] = [];

    if (batchId) {
      const { data: batchStudents } = await db
        .from("batch_students")
        .select("profile_id")
        .eq("batch_id", batchId)
        .not("profile_id", "is", null);
      targetUserIds = (batchStudents || []).map((b: any) => b.profile_id).filter(Boolean);
    } else {
      const { data: usersPage, error: listErr } = await db.auth.admin.listUsers({ perPage: 1000 });
      if (listErr) throw listErr;

      targetUserIds = (usersPage?.users || [])
        .filter((u: any) => !adminIds.has(u.id) && !adminEmails.has(u.email?.toLowerCase().trim()))
        .map((u: any) => u.id);
    }

    let successCount = 0;
    let failCount = 0;

    for (const uid of targetUserIds) {
      try {
        const { data: userData } = await db.auth.admin.getUserById(uid);
        const currentMeta = userData?.user?.user_metadata || {};

        const { error: updateErr } = await db.auth.admin.updateUserById(uid, {
          password: targetPassword,
          email_confirm: true,
          phone_confirm: true,
          user_metadata: {
            ...currentMeta,
            must_change_password: true,
          },
        });
        if (updateErr) {
          console.error(`Failed to reset password for user ${uid}:`, updateErr);
          failCount++;
        } else {
          successCount++;
        }
      } catch (e) {
        console.error(`Exception resetting user ${uid}:`, e);
        failCount++;
      }
    }

    return NextResponse.json({
      success: true,
      totalTargeted: targetUserIds.length,
      successCount,
      failCount,
      defaultPassword: targetPassword,
      message: `Successfully reset password to "${targetPassword}" for ${successCount} student(s).`,
    });
  } catch (error: any) {
    console.error("Bulk password reset error:", error);
    return NextResponse.json({ error: error.message || "Bulk reset failed." }, { status: 500 });
  }
}
