"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Download,
  Users,
  Search,
  BookOpen,
  Award,
  CreditCard,
  Calendar,
  Layers,
  LogOut,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Building,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Enrollment {
  id: string;
  course_slug: string;
  enrollment_method: "paid" | "college_code";
  status: "active" | "suspended" | "completed";
  created_at: string;
  profiles: {
    name: string;
    organization: string;
    phone: string;
  };
}

interface TestAttempt {
  id: string;
  test_slug: string;
  score: number;
  passed: boolean;
  started_at: string;
  submitted_at: string;
  profiles: {
    name: string;
    organization: string;
  };
}

interface Order {
  id: string;
  course_slug: string;
  amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  status: "pending" | "paid" | "failed" | "cancelled";
  created_at: string;
  profiles: {
    name: string;
  };
}

export default function AdminEnrollmentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [activityResults, setActivityResults] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sub-tabs within reporting console
  const [activeTab, setActiveTab] = useState<"enrollments" | "attempts" | "activity" | "orders">("enrollments");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/enrollments");
      if (response.status === 401) {
        router.push("/admin");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load database records.");
      }

      setEnrollments(data.enrollments || []);
      setAttempts(data.attempts || []);
      setActivityResults(data.activityResults || []);
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch student data reports.");
    } finally {
      setLoading(false);
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

  // CSV Exporters
  const handleExportCSV = () => {
    if (activeTab === "enrollments") {
      if (enrollments.length === 0) return;
      const headers = ["ID", "Date", "Student Name", "Institution", "Phone", "Course", "Method", "Status"];
      const rows = filteredEnrollments.map((e) => [
        e.id,
        new Date(e.created_at).toLocaleDateString(),
        e.profiles?.name || "N/A",
        e.profiles?.organization || "N/A",
        e.profiles?.phone || "N/A",
        e.course_slug,
        e.enrollment_method,
        e.status,
      ]);
      triggerDownload(headers, rows, "KVJ_Analytics_Enrollments");
    } else if (activeTab === "attempts") {
      if (attempts.length === 0) return;
      const headers = ["Attempt ID", "Date", "Student Name", "Institution", "Test ID", "Score", "Passed"];
      const rows = filteredAttempts.map((a) => [
        a.id,
        new Date(a.submitted_at).toLocaleDateString(),
        a.profiles?.name || "N/A",
        a.profiles?.organization || "N/A",
        a.test_slug,
        a.score,
        a.passed ? "PASSED" : "FAILED",
      ]);
      triggerDownload(headers, rows, "KVJ_Analytics_MockTest_Results");
    } else {
      if (orders.length === 0) return;
      const headers = ["ID", "Date", "Student Name", "Course", "Amount (INR)", "Razorpay Order ID", "Payment ID", "Status"];
      const rows = filteredOrders.map((o) => [
        o.id,
        new Date(o.created_at).toLocaleDateString(),
        o.profiles?.name || "N/A",
        o.course_slug,
        o.amount,
        o.razorpay_order_id,
        o.razorpay_payment_id || "N/A",
        o.status,
      ]);
      triggerDownload(headers, rows, "KVJ_Analytics_Payment_Orders");
    }
  };

  const triggerDownload = (headers: string[], rows: any[][], fileName: string) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters & Search logic
  const filteredEnrollments = enrollments.filter((e) => {
    const term = searchQuery.toLowerCase();
    return (
      e.profiles?.name?.toLowerCase().includes(term) ||
      e.profiles?.organization?.toLowerCase().includes(term) ||
      e.course_slug.toLowerCase().includes(term) ||
      e.enrollment_method.toLowerCase().includes(term)
    );
  });

  const filteredAttempts = attempts.filter((a) => {
    const term = searchQuery.toLowerCase();
    return (
      a.profiles?.name?.toLowerCase().includes(term) ||
      a.profiles?.organization?.toLowerCase().includes(term) ||
      a.test_slug.toLowerCase().includes(term)
    );
  });

  const filteredOrders = orders.filter((o) => {
    const term = searchQuery.toLowerCase();
    return (
      o.profiles?.name?.toLowerCase().includes(term) ||
      o.course_slug.toLowerCase().includes(term) ||
      o.razorpay_order_id.toLowerCase().includes(term) ||
      (o.razorpay_payment_id && o.razorpay_payment_id.toLowerCase().includes(term))
    );
  });

  // Helper format Course Slug to title
  const getCourseTitle = (slug: string) => {
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
          Loading learning database records...
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
              KVJ Analytics student database
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleExportCSV}
              variant="secondary"
              className="px-4 py-2 text-sm border-line text-slate hover:bg-surface flex items-center space-x-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
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
          {[
            { label: "Leads Inbox",     href: "/admin/leads" },
            { label: "College Batches", href: "/admin/batches" },
            { label: "Enrollments",     href: "/admin/enrollments" },
            { label: "Clients",         href: "/admin/clients" },
            { label: "Testimonials",    href: "/admin/testimonials" },
            { label: "Case Studies",    href: "/admin/case-studies" },
            { label: "Team",            href: "/admin/team" },
            { label: "Website Content", href: "/admin/content" },
            { label: "Courses",         href: "/admin/courses" },
          ].map((tab) => (
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

        {/* Sub Navigation Tabs inside Dashboard */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-card border border-line shadow-soft">
          <div className="flex bg-surface p-1 rounded-lg border border-line w-full md:w-auto">
            {[
              { id: "enrollments", label: "Enrollments", count: enrollments.length, icon: Users },
              { id: "attempts", label: "Mock Test Results", count: attempts.length, icon: Award },
              { id: "activity", label: "Activity Scores", count: activityResults.length, icon: Award },
              { id: "orders", label: "Orders & Payments", count: orders.length, icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-brand shadow-sm font-bold"
                    : "text-slate hover:text-ink"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="bg-slate/10 px-1.5 py-0.5 rounded-full text-[9px]">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all"
            />
            <Search className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Dynamic Sub-Tab Tables */}
        <div className="bg-white border border-line rounded-card shadow-soft overflow-hidden">
          
          {/* TAB 1: ENROLLMENTS */}
          {activeTab === "enrollments" && (
            <div className="overflow-x-auto">
              {filteredEnrollments.length === 0 ? (
                <div className="p-12 text-center text-slate">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate" />
                  <p className="text-base font-semibold">No student enrollments found matching search.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                      <th className="p-4 pl-6">Student Info</th>
                      <th className="p-4">College / Organization</th>
                      <th className="p-4">Registered Course</th>
                      <th className="p-4">Enrollment Method</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-[14px]">
                    {filteredEnrollments.map((e) => {
                      const dateStr = new Date(e.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      });

                      return (
                        <tr key={e.id} className="hover:bg-surface/30 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="font-bold text-ink">{e.profiles?.name || "Anonymous User"}</div>
                            <div className="flex flex-col space-y-0.5 text-xs text-slate mt-1">
                              <span className="flex items-center">
                                <Phone className="w-3 h-3 mr-1 text-slate/55" />
                                {e.profiles?.phone || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1.5 font-semibold text-ink">
                              <Building className="w-3.5 h-3.5 opacity-55 text-slate" />
                              <span>{e.profiles?.organization || "Corporate / Private"}</span>
                            </div>
                          </td>
                          <td className="p-4 text-brand font-semibold">
                            {getCourseTitle(e.course_slug)}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            {e.enrollment_method === "paid" ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-corporate bg-corporate/5 border border-corporate/25">
                                Paid Portal
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-education bg-education/5 border border-education/25">
                                College Code
                              </span>
                            )}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                              {e.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate text-xs whitespace-nowrap">
                            {dateStr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: TEST ATTEMPTS */}
          {activeTab === "attempts" && (
            <div className="overflow-x-auto">
              {filteredAttempts.length === 0 ? (
                <div className="p-12 text-center text-slate">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate" />
                  <p className="text-base font-semibold">No test submissions found matching search.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                      <th className="p-4 pl-6">Student Name</th>
                      <th className="p-4">College / Organization</th>
                      <th className="p-4">Evaluation Test ID</th>
                      <th className="p-4 text-center">Score Marks</th>
                      <th className="p-4 text-center">Outcome</th>
                      <th className="p-4">Submitted Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-[14px]">
                    {filteredAttempts.map((a) => {
                      const dateStr = new Date(a.submitted_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                      });

                      return (
                        <tr key={a.id} className="hover:bg-surface/30 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="font-bold text-ink">{a.profiles?.name}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1.5 font-semibold text-slate">
                              <Building className="w-3.5 h-3.5 opacity-55" />
                              <span>{a.profiles?.organization || "Corporate / Private"}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono font-bold text-xs text-brand">
                            {a.test_slug}
                          </td>
                          <td className="p-4 text-center font-bold text-ink">
                            {a.score} Marks
                          </td>
                          <td className="p-4 text-center">
                            {a.passed ? (
                              <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-success bg-success/10 px-2.5 py-0.5 rounded border border-success/20">
                                Passed
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-error bg-error/10 px-2.5 py-0.5 rounded border border-error/20">
                                Failed
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate text-xs whitespace-nowrap">
                            {dateStr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB: ACTIVITY SCORES */}
          {activeTab === "activity" && (
            <div className="overflow-x-auto">
              {activityResults.length === 0 ? (
                <div className="p-12 text-center text-slate">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate" />
                  <p className="text-base font-semibold">No activity scores recorded yet.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                      <th className="p-4 pl-6">Student Name</th>
                      <th className="p-4">College / Organization</th>
                      <th className="p-4">Activity</th>
                      <th className="p-4">Course</th>
                      <th className="p-4 text-center">Score</th>
                      <th className="p-4">Submitted Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-[14px]">
                    {activityResults.map((r) => {
                      const dateStr = new Date(r.submitted_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
                      });
                      return (
                        <tr key={r.id} className="hover:bg-surface/30 transition-colors">
                          <td className="p-4 pl-6"><div className="font-bold text-ink">{r.profiles?.name}</div></td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1.5 font-semibold text-slate">
                              <Building className="w-3.5 h-3.5 opacity-55" />
                              <span>{r.profiles?.organization || "—"}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-ink">{r.lessons?.title || "—"}</td>
                          <td className="p-4 font-mono font-bold text-xs text-brand">{r.course_slug}</td>
                          <td className="p-4 text-center font-bold text-ink">{r.score} / {r.max_score}</td>
                          <td className="p-4 text-slate text-xs whitespace-nowrap">{dateStr}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === "orders" && (
            <div className="overflow-x-auto">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-slate">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate" />
                  <p className="text-base font-semibold">No order logs found matching search.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                      <th className="p-4 pl-6">Student Name</th>
                      <th className="p-4">Program / Course</th>
                      <th className="p-4">Amount Paid</th>
                      <th className="p-4">Razorpay Order ID</th>
                      <th className="p-4">Razorpay Payment ID</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4">Checkout Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-[14px]">
                    {filteredOrders.map((o) => {
                      const dateStr = new Date(o.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      });

                      const paidStyles = {
                        paid: "bg-success/10 text-success border-success/35",
                        pending: "bg-corporate/10 text-corporate border-corporate/35",
                        failed: "bg-error/10 text-error border-error/35",
                        cancelled: "bg-slate/10 text-slate border-slate/35",
                      };

                      return (
                        <tr key={o.id} className="hover:bg-surface/30 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="font-bold text-ink">{o.profiles?.name}</div>
                          </td>
                          <td className="p-4 text-brand font-semibold">
                            {getCourseTitle(o.course_slug)}
                          </td>
                          <td className="p-4 font-bold text-ink whitespace-nowrap">
                            ₹{o.amount}
                          </td>
                          <td className="p-4 font-mono text-xs text-slate whitespace-nowrap">
                            {o.razorpay_order_id}
                          </td>
                          <td className="p-4 font-mono text-xs text-slate whitespace-nowrap">
                            {o.razorpay_payment_id || "N/A"}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                              paidStyles[o.status] || "bg-slate/10 text-slate"
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate text-xs whitespace-nowrap">
                            {dateStr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
