import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  const supabaseAdmin = getAdminClient();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  }

  try {
    const { email, user_id } = await req.json();

    if (!email || !user_id) {
      return NextResponse.json({ error: "Missing email or user_id" }, { status: 400 });
    }

    // 1. Fetch pending invited batch student records matching email
    const { data: batchRecords, error: batchErr } = await supabaseAdmin
      .from("batch_students")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .eq("status", "INVITED");

    if (batchErr) throw batchErr;

    if (!batchRecords || batchRecords.length === 0) {
      return NextResponse.json({ success: true, claimed: 0 });
    }

    let claimedCount = 0;

    for (const record of batchRecords) {
      // 2. Fetch the corresponding batch to get course_slug and college_name
      const { data: batch, error: bErr } = await supabaseAdmin
        .from("batches")
        .select("course_slug, college_name")
        .eq("id", record.batch_id)
        .maybeSingle();

      if (bErr || !batch) {
        console.warn(`Claim error: Batch ${record.batch_id} not found. Skipping.`);
        continue;
      }

      // 3. Create active enrollment
      const { error: enrollError } = await supabaseAdmin
        .from("enrollments")
        .upsert(
          {
            user_id: user_id,
            course_slug: batch.course_slug,
            enrollment_method: "college_code",
            status: "active",
          },
          { onConflict: "user_id,course_slug" }
        );

      if (enrollError) {
        console.error(`Claim error: failed to upsert enrollment for course ${batch.course_slug}:`, enrollError);
        continue;
      }

      // 4. Update profile details with organization & account type
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({
          organization: batch.college_name,
          account_type: "college"
        })
        .eq("id", user_id);

      if (profileError) {
        console.warn(`Profile update warning for user ${user_id}:`, profileError);
      }

      // 5. Update batch student record status to JOINED and link profile_id
      const { error: recordUpdateError } = await supabaseAdmin
        .from("batch_students")
        .update({
          status: "JOINED",
          profile_id: user_id
        })
        .eq("id", record.id);

      if (recordUpdateError) {
        console.error(`Claim error: failed to update batch_student record ${record.id}:`, recordUpdateError);
      } else {
        claimedCount++;
      }
    }

    return NextResponse.json({ success: true, claimed: claimedCount });

  } catch (err: any) {
    console.error("Failed to claim pending enrollments:", err);
    return NextResponse.json({ error: err.message || "Failed to process pre-enrollments claim." }, { status: 500 });
  }
}
