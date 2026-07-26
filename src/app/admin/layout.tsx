import React from "react";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Admin platform layout — wraps every /admin/* route in the modular AdminShell (sidebar + topbar).
 * The shell renders bare on the /admin login route. Existing module pages render inside the content
 * area unchanged (auth stays self-guarded per page). Additive: does not modify existing pages.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
