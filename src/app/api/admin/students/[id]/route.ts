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

function normalizePhone(phone: any): string | null {
  if (phone === undefined || phone === null) return null;
  let formattedPhone = String(phone).trim();
  if (!formattedPhone) return null;
  if (!formattedPhone.startsWith("+")) {
    formattedPhone = `+91${formattedPhone.replace(/\D/g, "")}`;
  } else {
    formattedPhone = `+${formattedPhone.substring(1).replace(/\D/g, "")}`;
  }
  return formattedPhone;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const db = getAdmin();
  if (!db) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { name, full_name, phone, organization, profession, account_type } = body;

    const studentName = name?.trim() || full_name?.trim();
    const cleanPhone = phone ? normalizePhone(phone) : null;

    const updatePayload: Record<string, any> = {};
    if (studentName !== undefined) {
      updatePayload.name = studentName;
      updatePayload.full_name = studentName;
    }
    if (phone !== undefined) updatePayload.phone = cleanPhone;
    if (organization !== undefined) updatePayload.organization = organization?.trim() || null;
    if (profession !== undefined) updatePayload.profession = profession?.trim() || null;
    if (account_type !== undefined) updatePayload.account_type = account_type;

    const { data: updatedProfile, error } = await db
      .from("profiles")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Sync auth user metadata if name changed
    if (studentName) {
      try {
        await db.auth.admin.updateUserById(id, {
          user_metadata: { full_name: studentName, name: studentName }
        });
      } catch (authErr) {
        console.warn("Could not sync auth user metadata:", authErr);
      }
    }

    return NextResponse.json({ success: true, student: updatedProfile });
  } catch (error: any) {
    console.error("Failed to update student profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
