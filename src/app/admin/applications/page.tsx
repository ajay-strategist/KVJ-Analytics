"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Trash2, Loader2, AlertCircle, Inbox, Mail, Phone, FileText, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  message: string;
  created_at: string;
  internships?: { title: string } | null;
  jobs?: { title: string } | null;
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

export default function AdminApplicationsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [activeSubTab, setActiveSubTab] = useState<"internships" | "careers">("internships");
  
  const [internApps, setInternApps] = useState<Application[]>([]);
  const [jobApps, setJobApps] = useState<Application[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const [internRes, jobRes] = await Promise.all([
        fetch("/api/admin/internship-applications"),
        fetch("/api/admin/job-applications")
      ]);

      if (internRes.status === 401 || jobRes.status === 401) {
        router.push("/admin");
        return;
      }

      const internData = await internRes.json();
      const jobData = await jobRes.json();

      if (!internRes.ok) throw new Error(internData.error || "Failed to load internship applications");
      if (!jobRes.ok) throw new Error(jobData.error || "Failed to load job applications");

      setInternApps(internData.applications || []);
      setJobApps(jobData.applications || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: "internships" | "careers") => {
    if (!confirm("Are you sure you want to delete this applicant file? This action is irreversible.")) {
      return;
    }
    setDeletingId(id);
    try {
      const url = type === "internships"
        ? `/api/admin/internship-applications/${id}`
        : `/api/admin/job-applications/${id}`;

      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      
      if (type === "internships") {
        setInternApps((prev) => prev.filter((a) => a.id !== id));
      } else {
        setJobApps((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete applications.");
    } finally {
      setDeletingId(null);
    }
  };

  const activeApps = activeSubTab === "internships" ? internApps : jobApps;

  return (
    <div className="min-h-screen bg-surface p-8 text-ink">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-ink">Admin Dashboard</h1>
            <p className="text-xs text-slate mt-1.5 font-medium">Candidate resumes and applications files inbox.</p>
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

        {/* Sub tabs selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab("internships")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === "internships" ? "bg-brand text-white shadow" : "bg-white border border-line text-slate hover:text-ink"
            }`}
          >
            Internship Applications ({internApps.length})
          </button>
          <button
            onClick={() => setActiveSubTab("careers")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === "careers" ? "bg-brand text-white shadow" : "bg-white border border-line text-slate hover:text-ink"
            }`}
          >
            Job Board Applications ({jobApps.length})
          </button>
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
        ) : activeApps.length === 0 ? (
          <div className="p-16 border-dashed border-2 border-line text-center text-slate">
            No applicant profiles received for this track yet.
          </div>
        ) : (
          <div className="space-y-4">
            {activeApps.map((app) => {
              const submitDate = new Date(app.created_at).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });
              const appliedTo = activeSubTab === "internships"
                ? (app.internships?.title || "Internship Program")
                : (app.jobs?.title || "Job vacancy Role");

              return (
                <div key={app.id} className="bg-white border border-line p-6 rounded-card shadow-soft relative flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="space-y-4 flex-1">
                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-bold text-ink uppercase tracking-wider block bg-slate/10 px-2 py-0.5 border border-line rounded">
                        Role: {appliedTo}
                      </span>
                      <span className="text-slate text-xs font-mono">{submitDate}</span>
                    </div>

                    {/* Sender Profile */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate">
                      <div className="flex items-center gap-2 font-bold text-ink">
                        <User className="w-4 h-4 text-brand shrink-0" />
                        {app.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                        {app.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                        {app.phone}
                      </div>
                    </div>

                    {/* Resume download */}
                    {app.resume_url && (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-brand hover:underline w-fit bg-brand/5 border border-brand/20 p-2.5 rounded-lg"
                      >
                        <FileText className="w-4 h-4 shrink-0" />
                        <span>View / Open Resume File</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}

                    {/* Message Body */}
                    <div className="bg-surface/30 p-4 rounded-xl border border-line text-sm text-slate whitespace-pre-wrap leading-relaxed">
                      {app.message || "No statement message left."}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-start">
                    <button
                      disabled={deletingId === app.id}
                      onClick={() => handleDelete(app.id, activeSubTab)}
                      className="p-2 border border-line hover:border-error/30 rounded-lg text-slate hover:text-error hover:bg-error/5"
                    >
                      {deletingId === app.id ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Trash2 className="w-4.5 h-4.5" />}
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
