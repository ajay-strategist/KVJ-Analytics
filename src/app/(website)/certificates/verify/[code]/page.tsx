import React from "react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const revalidate = 0;

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url === "https://placeholder.supabase.co") {
    return require("@/lib/mockSupabase").mockSupabaseClient;
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

async function lookupCertificate(code: string) {
  const db = getAdmin();
  if (!db) return null;
  const { data } = await db
    .from("certificates")
    .select("certificate_number, course_slug, status, issued_at, profiles(name, full_name)")
    .eq("verify_code", code.toUpperCase())
    .maybeSingle();
  return data;
}

export default async function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert: any = await lookupCertificate(code);
  const valid = !!cert && cert.status === "issued";

  return (
    <Section className="py-20 md:py-28">
      <Container className="max-w-xl">
        <div className={`rounded-2xl border p-8 text-center ${valid ? "border-emerald-500/30 bg-emerald-500/5" : "border-line bg-card"}`}>
          {valid ? (
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
          ) : cert ? (
            <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          ) : (
            <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-muted" />
          )}
          <h1 className="font-display text-2xl font-bold text-ink">
            {valid ? "Certificate Verified" : cert ? "Certificate Revoked" : "Certificate Not Found"}
          </h1>
          {cert ? (
            <div className="mt-6 space-y-2 text-left text-sm text-slate">
              <Row label="Certificate #" value={cert.certificate_number} />
              <Row label="Issued to" value={cert.profiles?.full_name || cert.profiles?.name || "—"} />
              <Row label="Course" value={cert.course_slug} />
              <Row label="Issued on" value={new Date(cert.issued_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })} />
              <Row label="Status" value={cert.status} />
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate">No certificate matches this verification code. Check the code and try again.</p>
          )}
        </div>
      </Container>
    </Section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-2 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
