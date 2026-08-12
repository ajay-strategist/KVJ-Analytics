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
  Users,
  Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";
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

  // Student roster state
  const [activeBatchForStudents, setActiveBatchForStudents] = useState<Batch | null>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState("");

  // Excel parsing state
  const [previewStudents, setPreviewStudents] = useState<any[]>([]);
  const [previewInvalidCount, setPreviewInvalidCount] = useState(0);
  const [importResult, setImportResult] = useState<{ inserted: number; skipped: number } | null>(null);
  const [importing, setImporting] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const fetchRoster = async (batchId: string) => {
    setRosterLoading(true);
    setRosterError("");
    try {
      const res = await fetch(`/api/admin/batches/${batchId}/students`);
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load student roster");
      setRoster(data.students || []);
    } catch (err: any) {
      setRosterError(err.message || "Failed to fetch student roster");
    } finally {
      setRosterLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string, batchId: string) => {
    if (!confirm("Are you sure you want to remove this student from the batch roster?")) return;
    try {
      const res = await fetch(`/api/admin/batches/${batchId}/students`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove student");
      fetchRoster(batchId);
    } catch (err: any) {
      alert(err.message || "Failed to remove student");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportResult(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Read as array of arrays to find header columns
        const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
        if (rows.length === 0) {
          alert("The uploaded Excel file is empty.");
          return;
        }

        const headerRow = (rows[0] || []).map((h) => String(h || "").trim().toLowerCase());

        // Find indices for name, email, phone/mobile/contact, student_id, and department
        let nameIdx = -1;
        let emailIdx = -1;
        let phoneIdx = -1;
        let studentIdIdx = -1;
        let deptIdx = -1;

        for (let i = 0; i < headerRow.length; i++) {
          const val = headerRow[i];
          if (val === "name") {
            nameIdx = i;
          } else if (val === "email") {
            emailIdx = i;
          } else if (val === "phone" || val === "mobile" || val === "contact") {
            phoneIdx = i;
          } else if (val === "student id" || val === "employee id" || val === "student_id" || val === "employee_id" || val === "id") {
            studentIdIdx = i;
          } else if (val === "department" || val === "dept") {
            deptIdx = i;
          }
        }

        if (nameIdx === -1 && emailIdx === -1 && phoneIdx === -1) {
          // If no headers matched, assume first 3 columns are Name, Email, Phone
          nameIdx = 0;
          emailIdx = 1;
          phoneIdx = 2;
        }

        const parsed: any[] = [];
        let invalidCount = 0;

        for (let r = 1; r < rows.length; r++) {
          const row = rows[r];
          if (!row || row.length === 0) continue;

          // Make sure columns are within row limits
          const rawName = nameIdx !== -1 && row[nameIdx] !== undefined ? String(row[nameIdx]).trim() : "";
          const rawEmail = emailIdx !== -1 && row[emailIdx] !== undefined ? String(row[emailIdx]).trim() : "";
          const rawPhone = phoneIdx !== -1 && row[phoneIdx] !== undefined ? String(row[phoneIdx]).trim() : "";
          const rawStudentId = studentIdIdx !== -1 && row[studentIdIdx] !== undefined ? String(row[studentIdIdx]).trim() : "";
          const rawDept = deptIdx !== -1 && row[deptIdx] !== undefined ? String(row[deptIdx]).trim() : "";

          // Drop/flag if both email and phone are empty
          const isValid = !!rawEmail || !!rawPhone;
          if (!isValid) {
            invalidCount++;
          }

          parsed.push({
            name: rawName,
            email: rawEmail,
            phone: rawPhone,
            student_id: rawStudentId,
            department: rawDept,
            isValid,
          });
        }

        setPreviewStudents(parsed);
        setPreviewInvalidCount(invalidCount);
      } catch (err: any) {
        alert("Failed to parse Excel file: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportStudents = async (batchId: string) => {
    const validStudents = previewStudents.filter((s) => s.isValid);
    if (validStudents.length === 0) {
      alert("No valid student rows to import.");
      return;
    }

    setImporting(true);
    try {
      const res = await fetch(`/api/admin/batches/${batchId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: validStudents }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to import students");
      setImportResult({
        inserted: data.inserted,
        skipped: data.skipped,
      });
      // Clear preview
      setPreviewStudents([]);
      setPreviewInvalidCount(0);
      setFileInputKey((prev) => prev + 1);
      // Reload roster
      fetchRoster(batchId);
    } catch (err: any) {
      alert(err.message || "Failed to import students");
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [["Name", "Email", "Phone", "Student ID", "Department"]];
    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "student_roster_template.xlsx");
  };

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
        {/* Action Bar */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">College Batches</h2>
            <p className="text-sm text-slate-500">Rotating-code batches for college cohorts.</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant="primary"
            className="px-4 py-2 text-sm bg-education hover:bg-teal-700 text-white flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New College Batch</span>
          </Button>
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
                            <button
                              onClick={() => {
                                setActiveBatchForStudents(batch);
                                fetchRoster(batch.id);
                                setPreviewStudents([]);
                                setPreviewInvalidCount(0);
                                setImportResult(null);
                              }}
                              className="text-slate hover:text-brand transition-colors p-1.5 rounded-lg hover:bg-brand/5 cursor-pointer"
                              title="Manage Student Roster"
                            >
                              <Users className="w-5 h-5" />
                            </button>
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

      {/* Student Roster Modal */}
      {activeBatchForStudents && (
        <div className="fixed inset-0 z-[150] grid place-items-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-6xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-fade-up">
            {/* Modal Header */}
            <div className="border-b border-slate-100 p-5 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand" />
                  <span>Student Roster</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                  {activeBatchForStudents.college_name} • {getCourseTitle(activeBatchForStudents.course_slug)}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveBatchForStudents(null);
                  setRoster([]);
                }}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Split layout */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              
              {/* Left Column: Import / Upload */}
              <div className="lg:col-span-2 p-6 overflow-y-auto space-y-6 flex flex-col justify-start">
                
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Upload Student List</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload an Excel spreadsheet with student details. Ensure columns for Name, Email, and Phone/Mobile/Contact are present.
                  </p>
                </div>

                {/* File Upload card */}
                <div className="border border-dashed border-slate-200 hover:border-brand/40 bg-slate-50/30 hover:bg-brand/5 rounded-xl p-6 transition-all relative group flex flex-col items-center justify-center text-center">
                  <input
                    key={fileInputKey}
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center mx-auto text-slate-500 group-hover:text-brand group-hover:border-brand/20 transition-all">
                      <Plus className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      Click or drag .xlsx/.xls file here
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Supported formats: Excel files
                    </p>
                  </div>
                </div>

                {/* Templates & Info */}
                <div className="flex items-center justify-between text-xs border border-slate-100 bg-slate-50/50 p-3 rounded-lg">
                  <span className="text-slate-500 font-medium">Need a starting point?</span>
                  <button
                    onClick={handleDownloadTemplate}
                    className="text-brand hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Download Template
                  </button>
                </div>

                {/* Import Result Banner */}
                {importResult && (
                  <div className="border border-emerald-100 bg-emerald-50 text-emerald-800 p-4 rounded-xl space-y-1">
                    <p className="text-xs font-bold flex items-center gap-1.5 text-emerald-900">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Roster Import Completed</span>
                    </p>
                    <p className="text-xs">
                      Successfully added <strong>{importResult.inserted}</strong> new students.
                      {importResult.skipped > 0 && (
                        <span> Skipped <strong>{importResult.skipped}</strong> rows (duplicates or invalid).</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Excel Preview Panel */}
                {previewStudents.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">
                        Spreadsheet Preview ({previewStudents.length} rows)
                      </span>
                      {previewInvalidCount > 0 && (
                        <span className="text-[10px] font-bold text-error bg-error/5 border border-error/20 px-2 py-0.5 rounded">
                          {previewInvalidCount} invalid skipped
                        </span>
                      )}
                    </div>

                    <div className="border border-slate-100 rounded-lg overflow-hidden max-h-[220px] overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-50/80 sticky top-0 border-b border-slate-100">
                          <tr className="font-bold text-slate-500 uppercase tracking-wider">
                            <th className="p-2">Name</th>
                            <th className="p-2">ID / Dept</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Phone</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {previewStudents.map((s, idx) => (
                            <tr
                               key={idx}
                               className={s.isValid ? "hover:bg-slate-50/30" : "bg-error/5 text-error/80"}
                            >
                              <td className="p-2 font-medium truncate max-w-[120px]">{s.name || <span className="italic text-slate-400">Empty</span>}</td>
                              <td className="p-2 truncate max-w-[120px]">
                                {s.student_id ? <span className="font-mono">{s.student_id}</span> : <span className="italic text-slate-400">—</span>}
                                {s.department && <span className="text-[10px] text-slate-550 block">{s.department}</span>}
                              </td>
                              <td className="p-2 truncate max-w-[150px]">{s.email || <span className="italic text-slate-400">Empty</span>}</td>
                              <td className="p-2 truncate max-w-[120px]">{s.phone || <span className="italic text-slate-400">Empty</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Button
                      onClick={() => handleImportStudents(activeBatchForStudents.id)}
                      disabled={importing}
                      className="w-full justify-center py-2.5 bg-brand text-white hover:bg-brand/90"
                    >
                      {importing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                          <span>Importing...</span>
                        </>
                      ) : (
                        <span>
                          Import {previewStudents.filter((s) => s.isValid).length} Valid Students
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Column: Current Roster Table */}
              <div className="lg:col-span-3 p-6 overflow-y-auto space-y-4 flex flex-col justify-start">
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Enrolled Roster</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      List of students authorized to join this college batch.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate bg-slate/10 px-2.5 py-1 rounded-full">
                    {roster.length} Total
                  </span>
                </div>

                {rosterLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-brand mb-2" />
                    <span className="text-xs font-semibold">Loading roster...</span>
                  </div>
                ) : rosterError ? (
                  <div className="border border-error/20 bg-error/5 text-error p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-xs font-semibold">{rosterError}</p>
                  </div>
                ) : roster.length === 0 ? (
                  <div className="border border-dashed border-slate-100 rounded-xl py-16 text-center text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate" />
                    <p className="text-sm font-semibold text-slate-600">No students registered yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                      Upload an Excel spreadsheet on the left to authorize student registrations for this batch.
                    </p>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-xl overflow-hidden flex-1 overflow-y-auto max-h-[50vh]">
                    <table className="w-full text-left border-collapse text-[13px]">
                      <thead className="bg-slate-55 sticky top-0 border-b border-slate-100 z-10 bg-slate-50">
                        <tr className="font-bold text-slate-500 uppercase tracking-wider text-xs">
                          <th className="p-3 pl-4">Student Details</th>
                          <th className="p-3">ID / Department</th>
                          <th className="p-3">Email / Phone</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {roster.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="p-3 pl-4 font-semibold text-slate-900">
                              {student.name || <span className="italic text-slate-400 text-xs">Unnamed Student</span>}
                            </td>
                            <td className="p-3 text-slate">
                              {student.student_id ? (
                                <div className="text-xs text-slate-700 font-semibold font-mono">
                                  {student.student_id}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 italic">—</span>
                              )}
                              {student.department && (
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {student.department}
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-slate">
                              {student.email && (
                                <div className="text-xs text-slate-700 font-medium">
                                  {student.email}
                                </div>
                              )}
                              {student.phone && (
                                <div className="text-[11px] text-slate-500 font-bold font-mono mt-0.5">
                                  {student.phone}
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {student.status === "JOINED" ? (
                                <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                                  Joined
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                                  Invited
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleRemoveStudent(student.id, activeBatchForStudents.id)}
                                className="text-slate-400 hover:text-error transition-colors p-1.5 rounded-lg hover:bg-error/5 cursor-pointer"
                                title="Remove student from roster"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
