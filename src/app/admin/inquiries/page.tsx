"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Trash2, Loader2, AlertCircle, Inbox, Mail, Phone, Building, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Inquiry {
  id: string;
  category: "one_to_one" | "corporate" | "college";
  name: string;
  email: string;
  phone: string;
  organization: string;
  message: string;
  created_at: string;
}

const NAV_TABS = [
  { label: "Leads Inbox",          href: "/admin/leads" },
  { label: "College Batches",      href: "/admin/batches" },
  { label: "Enrollments",          href: "/admin/enrollments" },
  { label: "Clients",              href: "/admin/clients" },
  { label: "Testimonials",         href: "/admin/testimonials" },
  { label: "Case Studies",         href: "/admin/case-studies" },
  { label: "Team",                 href: "/admin/team" },
  { label: "Website Content",      href: "/admin/content" },
  { label: "Courses",              href: "/admin/courses" },
  { label: "Categories",           href: "/admin/categories" },
  { label: "Unlock Codes",         href: "/admin/unlock-codes" },
  { label: "Internships",          href: "/admin/internships" },
  { label: "Jobs",                 href: "/admin/jobs" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Inquiries",            href: "/admin/inquiries" },
  { label: "Applications",         href: "/admin/applications" },
];

export default function AdminInquiriesPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/inquiries");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load inquiries");
      setInquiries(data.inquiries || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch inquiries.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program inquiry?")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setInquiries((prev) => prev.filter((item) => item.id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete inquiry.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-8 text-ink">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-ink">Admin Dashboard</h1>
            <p className="text-xs text-slate mt-1.5 font-medium">B2B training program requests inbox.</p>
          </div>
          <Button
            href="/"
            className="px-4 py-2 border border-line text-slate hover:text-ink text-xs font-bold"
          >
            Launch Main Website
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-line">
          {NAV_TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                pathname === tab.href
                  ? "border-brand text-brand font-bold"
                  : "border-transparent text-slate hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-4">
          <h2 className="text-lg font-bold font-display text-ink flex items-center gap-2">
            <Inbox className="w-5 h-5 text-brand" />
            B2B inquiries Inbox ({inquiries.length})
          </h2>
        </div>

        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-16 border-dashed border-2 border-line text-center text-slate">
            No B2B program requests received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => {
              const submitDate = new Date(inq.created_at).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <div key={inq.id} className="bg-white border border-line p-6 rounded-card shadow-soft relative flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="space-y-4 flex-1">
                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-[9px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded border ${
                        inq.category === "corporate" ? "bg-purple-100 text-purple-700 border-purple-250" : (inq.category === "college" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-teal-100 text-teal-700 border-teal-200")
                      }`}>
                        {inq.category.replace("_", " ")}
                      </span>
                      <span className="text-slate text-xs font-mono">{submitDate}</span>
                    </div>

                    {/* Sender Profile */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate">
                      <div className="flex items-center gap-2 font-bold text-ink">
                        <User className="w-4 h-4 text-brand shrink-0" />
                        {inq.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                        {inq.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                        {inq.phone}
                      </div>
                    </div>

                    {/* Organization details */}
                    {inq.organization && (
                      <div className="flex items-center gap-2 text-sm text-slate bg-surface/50 p-2.5 rounded-lg border border-line w-fit">
                        <Building className="w-4 h-4 text-slate shrink-0" />
                        <span>Org: <strong>{inq.organization}</strong></span>
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="bg-surface/30 p-4 rounded-xl border border-line text-sm text-slate whitespace-pre-wrap leading-relaxed">
                      {inq.message || "No custom requirements left."}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-start">
                    <button
                      disabled={deletingId === inq.id}
                      onClick={() => handleDelete(inq.id)}
                      className="p-2 border border-line hover:border-error/30 rounded-lg text-slate hover:text-error hover:bg-error/5"
                    >
                      {deletingId === inq.id ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Trash2 className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
