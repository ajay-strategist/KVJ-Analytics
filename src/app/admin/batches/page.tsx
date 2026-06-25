"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Building,
  Key,
  Calendar,
  Layers,
  LogOut,
  Loader2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Maximize2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { client as sanityClient } from "@/sanity/lib/client";

interface Batch {
  id: string;
  college_name: string;
  course_slug: string;
  totp_secret: string;
  valid_from: string;
  valid_to: string;
  active: boolean;
  currentCode: string;
  secondsRemaining: number;
  created_at: string;
}

const NAV_TABS = [
  { label: "Leads Inbox",     href: "/admin/leads" },
  { label: "College Batches", href: "/admin/batches" },
  { label: "Enrollments",     href: "/admin/enrollments" },
  { label: "Clients",         href: "/admin/clients" },
  { label: "Testimonials",    href: "/admin/testimonials" },
  { label: "Case Studies",    href: "/admin/case-studies" },
  { label: "Team",            href: "/admin/team" },
  { label: "Website Content", href: "/admin/content" },
  { label: "Courses",         href: "/admin/courses" },
];

export default function AdminBatchesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Rotating Timer state
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Full-screen "present code" mode
  const [presentId, setPresentId] = useState<string | null>(null);
  useEffect(() => {
    if (!presentId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPresentId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presentId]);

  // Form state to add new batch
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newCourseSlug, setNewCourseSlug] = useState("");
  const [newValidFrom, setNewValidFrom] = useState("");
  const [newValidTo, setNewValidTo] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch batches and courses
  useEffect(() => {
    fetchBatches();
    fetchCourses();
  }, []);

  // Set up local countdown timer for code rotations
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Trigger a silent reload of TOTP codes when timer hits 0
          reloadCodesOnly();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/batches");
      if (response.status === 401) {
        router.push("/admin");
        return;
      }
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load batches");
      }
      
      const batchList = data.batches || [];
      setBatches(batchList);
      if (batchList.length > 0) {
        setSecondsLeft(batchList[0].secondsRemaining || 30);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch batches.");
    } finally {
      setLoading(false);
    }
  };

  const reloadCodesOnly = async () => {
    try {
      const response = await fetch("/api/admin/batches");
      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches || []);
        if (data.batches && data.batches.length > 0) {
          setSecondsLeft(data.batches[0].secondsRemaining || 30);
        }
      }
    } catch (err) {
      console.warn("Silent TOTP refresh failed:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/admin/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
        if (data.courses && data.courses.length > 0) {
          setNewCourseSlug(data.courses[0].slug);
        }
      }
    } catch (err) {
      console.error("Failed to load courses for dropdown:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleToggleActive = async (batchId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/batches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: batchId, active: !currentStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Update failed");
      }

      setBatches((prev) =>
        prev.map((b) => (b.id === batchId ? { ...b, active: !currentStatus } : b))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const response = await fetch("/api/admin/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college_name: newCollegeName,
          course_slug: newCourseSlug,
          valid_from: new Date(newValidFrom).toISOString(),
          valid_to: new Date(newValidTo).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Batch creation failed.");
      }

      setNewCollegeName("");
      setNewValidFrom("");
      setNewValidTo("");
      setShowAddForm(false);
      fetchBatches();
    } catch (err: any) {
      setFormError(err.message || "Failed to create batch.");
    } finally {
      setFormLoading(false);
    }
  };

  // Helper format Course Slug to Title
  const getCourseTitle = (slug: string) => {
    const found = courses.find((c) => c.slug === slug);
    if (found) return found.title;
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand mb-4" />
        <span className="text-sm font-semibold text-slate font-display">
          Loading Batch manager...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 font-body">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-card border border-line shadow-soft">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand" />
              <span className="text-xs font-bold text-slate uppercase tracking-wider">
                operator panel
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-ink mt-1">
              KVJ Analytics batches manager
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant="primary"
              className="px-4 py-2 text-sm bg-education hover:bg-teal-700 text-white flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New College Batch</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="px-4 py-2 text-sm text-error hover:bg-error/5 flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation Panel */}
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

        {/* Add Batch Overlay / Form */}
        {showAddForm && (
          <Card className="p-6 border-line bg-white shadow-soft max-w-xl mx-auto animate-fade-up">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-5">
              <h3 className="text-lg font-bold font-display text-ink">
                Create College Batch Secret
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate hover:text-ink font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error mb-5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                  College / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  placeholder="e.g. Rajagiri College of Social Sciences"
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                  Select Associated Course *
                </label>
                <select
                  value={newCourseSlug}
                  onChange={(e) => setNewCourseSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-line bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  {courses.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title} ({c.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Valid From Date/Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newValidFrom}
                    onChange={(e) => setNewValidFrom(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-line bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Valid To Date/Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newValidTo}
                    onChange={(e) => setNewValidTo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-line bg-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <Button
                  onClick={() => setShowAddForm(false)}
                  type="button"
                  variant="ghost"
                  className="px-4 py-2 text-xs border border-line text-slate hover:bg-surface font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 text-xs bg-education hover:bg-teal-700 text-white font-bold"
                >
                  {formLoading ? "Creating Secret..." : "Generate Batch Code"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Dynamic Timer Band */}
        {batches.length > 0 && (
          <div className="bg-brand/5 border border-brand/20 p-5 rounded-card flex items-center justify-between shadow-soft">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-brand animate-spin" style={{ animationDuration: "6s" }} />
              <div>
                <span className="text-xs font-bold text-slate uppercase tracking-wider">
                  Live Passcode Rotation Timer
                </span>
                <p className="text-sm text-slate mt-0.5 leading-none">
                  passcodes rotate in <strong className="text-brand font-mono text-base">{secondsLeft}s</strong>
                </p>
              </div>
            </div>
            
            <button
              onClick={reloadCodesOnly}
              className="p-2 rounded bg-white border border-line hover:border-brand/40 text-slate hover:text-brand transition-colors cursor-pointer"
              title="Force reload passcode secrets"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Batches Table List */}
        <div className="bg-white border border-line rounded-card shadow-soft overflow-hidden">
          {batches.length === 0 ? (
            <div className="p-12 text-center text-slate">
              <Layers className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate" />
              <p className="text-base font-semibold">No college batches registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                    <th className="p-4 pl-6">Institution</th>
                    <th className="p-4">Program / Course</th>
                    <th className="p-4 text-center">Active Code</th>
                    <th className="p-4">Validation Window</th>
                    <th className="p-4">Active</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-[14px]">
                  {batches.map((batch) => {
                    const startStr = new Date(batch.valid_from).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit"
                    });
                    const endStr = new Date(batch.valid_to).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit"
                    });

                    const isExpired = new Date(batch.valid_to).getTime() < Date.now();

                    return (
                      <tr key={batch.id} className="hover:bg-surface/30 transition-colors">
                        {/* Institution Name */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center space-x-2 font-bold text-ink">
                            <Building className="w-4 h-4 text-slate opacity-65" />
                            <span>{batch.college_name}</span>
                          </div>
                        </td>

                        {/* Course Name */}
                        <td className="p-4 text-slate">
                          <div className="font-semibold text-brand">
                            {getCourseTitle(batch.course_slug)}
                          </div>
                          <span className="text-[10px] text-slate/70 font-bold block mt-0.5">
                            Slug: {batch.course_slug}
                          </span>
                        </td>

                        {/* Rotating Passcode Pin */}
                        <td className="p-4 text-center">
                          {batch.active && !isExpired ? (
                            <div className="inline-flex items-center space-x-2 bg-success/5 border border-success/35 px-4 py-2 rounded-lg">
                              <Key className="w-3.5 h-3.5 text-success animate-pulse" />
                              <span className="font-mono font-bold text-lg text-success tracking-wider">
                                {batch.currentCode}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate text-xs font-semibold uppercase italic">
                              {isExpired ? "Expired Window" : "Inactive"}
                            </span>
                          )}
                        </td>

                        {/* Validity Dates */}
                        <td className="p-4 text-slate text-xs leading-relaxed">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-slate/60" />
                            <span>From: {startStr}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate/60" />
                            <span className={isExpired ? "text-error font-semibold" : ""}>
                              To: {endStr}
                            </span>
                          </div>
                        </td>

                        {/* Status Active Badge */}
                        <td className="p-4">
                          {batch.active && !isExpired ? (
                            <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                              Live
                            </span>
                          ) : isExpired ? (
                            <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-error bg-error/10 px-2 py-0.5 rounded border border-error/20">
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-slate bg-slate/10 px-2 py-0.5 rounded border border-slate/20">
                              Disabled
                            </span>
                          )}
                        </td>

                        {/* Toggler Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {batch.active && !isExpired && (
                              <button
                                onClick={() => setPresentId(batch.id)}
                                className="text-slate hover:text-brand transition-colors p-1.5 rounded-lg hover:bg-brand/5 cursor-pointer"
                                title="Present code in full screen"
                              >
                                <Maximize2 className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleActive(batch.id, batch.active)}
                              className="text-slate hover:text-brand transition-colors p-1"
                              title={batch.active ? "Deactivate Batch Code" : "Activate Batch Code"}
                            >
                              {batch.active ? (
                                <ToggleRight className="w-9 h-9 text-brand cursor-pointer" />
                              ) : (
                                <ToggleLeft className="w-9 h-9 text-slate cursor-pointer" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Full-screen "present code" mode */}
      {(() => {
        const pb = presentId ? batches.find((b) => b.id === presentId) : null;
        if (!pb) return null;
        const expired = new Date(pb.valid_to).getTime() < Date.now();
        return (
          <div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center text-white p-8 text-center"
            style={{ background: "linear-gradient(135deg, #0B1635 0%, #16284f 55%, #1A56DB 130%)" }}
          >
            <button
              onClick={() => setPresentId(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-7 h-7" />
            </button>

            <p className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-white/60 mb-3">
              {pb.college_name}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold font-display mb-10">
              {getCourseTitle(pb.course_slug)}
            </h2>

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cta mb-4">Access Code</p>
            {pb.active && !expired ? (
              <div
                className="font-mono font-extrabold tracking-[0.15em] leading-none"
                style={{ fontSize: "clamp(4rem, 22vw, 18rem)" }}
              >
                {pb.currentCode}
              </div>
            ) : (
              <div className="text-3xl font-bold text-white/70">{expired ? "Expired" : "Inactive"}</div>
            )}

            <div className="mt-12 flex items-center gap-3 text-white/70">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-semibold">
                New code in <span className="text-cta font-mono font-bold">{secondsLeft}s</span>
              </span>
            </div>
            <p className="mt-8 text-white/40 text-xs uppercase tracking-[0.3em]">Press Esc to exit</p>
          </div>
        );
      })()}
    </div>
  );
}
