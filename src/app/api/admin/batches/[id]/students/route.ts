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

      // Add to insertion list
      toInsert.push({
        batch_id: id,
        name,
        email,
        phone,
        status: "INVITED"
      });

      if (email) processedEmails.add(email);
      if (phone) processedPhones.add(phone);
    }

    if (toInsert.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from("batch_students")
        .insert(toInsert);

      if (insertError) throw insertError;
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
