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

function normalizePhone(phone: any): string | null {
  if (phone === undefined || phone === null) return null;
  let formattedPhone = String(phone).trim();
  if (!formattedPhone) return null;
  if (!formattedPhone.startsWith("+")) {
    // Assume Indian country code if missing, strip all non-digits
    formattedPhone = `+91${formattedPhone.replace(/\D/g, "")}`;
  } else {
    // Strip non-digits after the initial +
    formattedPhone = `+${formattedPhone.substring(1).replace(/\D/g, "")}`;
  }
  return formattedPhone;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  try {
    const { data: students, error } = await supabaseAdmin
      .from("batch_students")
      .select("*")
      .eq("batch_id", id)
      .order("added_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ students: students || [] });
  } catch (error: any) {
    console.error("Failed to fetch batch students:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  try {
    const { students } = await req.json();

    if (!Array.isArray(students)) {
      return NextResponse.json(
        { error: "Invalid payload: students must be an array." },
        { status: 400 }
      );
    }

    // Fetch batch details to get course slug and college/organization name
    const { data: batch, error: batchFetchError } = await supabaseAdmin
      .from("batches")
      .select("course_slug, college_name")
      .eq("id", id)
      .single();

    if (batchFetchError || !batch) {
      throw new Error(batchFetchError?.message || "Batch not found.");
    }

    // Fetch existing students in this batch to prevent duplicates
    const { data: existingStudents, error: fetchError } = await supabaseAdmin
      .from("batch_students")
      .select("email, phone")
      .eq("batch_id", id);

    if (fetchError) throw fetchError;

    const existingEmails = new Set(
      (existingStudents || [])
        .map((s: any) => s.email?.toLowerCase().trim())
        .filter(Boolean)
    );
    const existingPhones = new Set(
      (existingStudents || [])
        .map((s: any) => s.phone?.trim())
        .filter(Boolean)
    );

    const processedEmails = new Set<string>();
    const processedPhones = new Set<string>();
    const toInsert: any[] = [];
    let skipped = 0;

    for (const student of students) {
      const email = student.email?.trim().toLowerCase() || null;
      const phone = normalizePhone(student.phone);
      const name = student.name?.trim() || null;
      const studentIdVal = student.student_id?.trim() || student.employee_id?.trim() || null;
      const departmentVal = student.department?.trim() || null;

      // Drop rows with neither email nor phone
      if (!email && !phone) {
        skipped++;
        continue;
      }

      let isDuplicate = false;

      // Check email duplicate
      if (email) {
        if (existingEmails.has(email) || processedEmails.has(email)) {
          isDuplicate = true;
        }
      }

      // Check phone duplicate
      if (phone && !isDuplicate) {
        if (existingPhones.has(phone) || processedPhones.has(phone)) {
          isDuplicate = true;
        }
      }

      if (isDuplicate) {
        skipped++;
        continue;
      }

      // Determine if student has a registered account and auto-link
      let profileId = null;
      let status = "INVITED";

      if (email) {
        try {
          const { data: authUser } = await supabaseAdmin.auth.admin.getUserByEmail(email);
          if (authUser?.user) {
            profileId = authUser.user.id;
            status = "JOINED";
          }
        } catch (err) {
          console.warn(`User search failed for email ${email}:`, err);
        }
      }

      if (!profileId && phone) {
        try {
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("phone", phone)
            .maybeSingle();
          if (profile) {
            profileId = profile.id;
            status = "JOINED";
          }
        } catch (err) {
          console.warn(`User search failed for phone ${phone}:`, err);
        }
      }

      // Add to insertion list
      toInsert.push({
        batch_id: id,
        name,
        email,
        phone,
        status,
        profile_id: profileId,
        student_id: studentIdVal,
        department: departmentVal,
      });

      if (email) processedEmails.add(email);
      if (phone) processedPhones.add(phone);
    }

    if (toInsert.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from("batch_students")
        .insert(toInsert);

      if (insertError) throw insertError;

      // Auto-enroll matched registered students
      const joinedStudents = toInsert.filter(s => s.status === "JOINED" && s.profile_id);
      if (joinedStudents.length > 0) {
        const enrollmentsToInsert = joinedStudents.map(s => ({
          user_id: s.profile_id,
          course_slug: batch.course_slug,
          enrollment_method: "college_code",
          status: "active"
        }));

        const { error: enrollError } = await supabaseAdmin
          .from("enrollments")
          .upsert(enrollmentsToInsert, { onConflict: "user_id,course_slug" });

        if (enrollError) {
          console.error("Auto-enrollment error for joined batch students:", enrollError);
        }

        // Also update their profile organization and account type
        for (const js of joinedStudents) {
          await supabaseAdmin
            .from("profiles")
            .update({
              organization: batch.college_name,
              account_type: "college"
            })
            .eq("id", js.profile_id);
        }
      }
    }

    return NextResponse.json({
      inserted: toInsert.length,
      skipped
    });
  } catch (error: any) {
    console.error("Failed to import batch students:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { error: "Missing student ID to remove." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("batch_students")
      .delete()
      .eq("id", studentId)
      .eq("batch_id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete batch student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  try {
    const body = await req.json();
    const { studentId, name, email, phone, student_id, department, status } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: "Missing student ID to update." },
        { status: 400 }
      );
    }

    const cleanEmail = email !== undefined ? (email ? email.trim().toLowerCase() : null) : undefined;
    const cleanPhone = phone !== undefined ? (phone ? normalizePhone(phone) : null) : undefined;
    const cleanName = name !== undefined ? (name ? name.trim() : null) : undefined;
    const cleanStudentId = student_id !== undefined ? (student_id ? student_id.trim() : null) : undefined;
    const cleanDept = department !== undefined ? (department ? department.trim() : null) : undefined;

    const updatePayload: Record<string, any> = {};
    if (cleanName !== undefined) updatePayload.name = cleanName;
    if (cleanEmail !== undefined) updatePayload.email = cleanEmail;
    if (cleanPhone !== undefined) updatePayload.phone = cleanPhone;
    if (cleanStudentId !== undefined) updatePayload.student_id = cleanStudentId;
    if (cleanDept !== undefined) updatePayload.department = cleanDept;
    if (status !== undefined) updatePayload.status = status;

    // If email or phone updated, check if matched to registered user
    if (cleanEmail || cleanPhone) {
      let profileId = null;
      if (cleanEmail) {
        try {
          const { data: authUser } = await supabaseAdmin.auth.admin.getUserByEmail(cleanEmail);
          if (authUser?.user) {
            profileId = authUser.user.id;
          }
        } catch (err) {
          console.warn(`User search failed for email ${cleanEmail}:`, err);
        }
      }
      if (!profileId && cleanPhone) {
        try {
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("phone", cleanPhone)
            .maybeSingle();
          if (profile) {
            profileId = profile.id;
          }
        } catch (err) {
          console.warn(`User search failed for phone ${cleanPhone}:`, err);
        }
      }
      if (profileId) {
        updatePayload.profile_id = profileId;
        if (status === undefined) {
          updatePayload.status = "JOINED";
        }
      }
    }

    const { data: updatedStudent, error } = await supabaseAdmin
      .from("batch_students")
      .update(updatePayload)
      .eq("id", studentId)
      .eq("batch_id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error: any) {
    console.error("Failed to update batch student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

