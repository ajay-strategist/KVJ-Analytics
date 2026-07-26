import type { SupabaseClient } from "@supabase/supabase-js";

/** Best-effort audit trail write — never throws (a logging failure must not break the admin action it records). */
export async function logAudit(
  db: SupabaseClient,
  entry: { actor?: string; action: string; entity_type: string; entity_id?: string; meta?: Record<string, unknown> }
) {
  try {
    await db.from("audit_logs").insert([{
      actor: entry.actor || "admin",
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id ?? null,
      meta: entry.meta ?? {},
    }]);
  } catch {
    /* noop — audit logging must never break the calling request */
  }
}
