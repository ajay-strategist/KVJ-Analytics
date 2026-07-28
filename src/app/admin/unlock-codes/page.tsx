"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, X, Check, Loader2, AlertCircle, Key, Calendar,
  Copy, Search, Eye, Filter, Play, Pause, AlertTriangle, ArrowUpDown,
  ChevronDown, GraduationCap, Building2, User, HelpCircle, CheckCircle2,
  Clock, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Course {
  id: string;
  title: string;
}

interface College {
  id: string;
  name: string;
}

interface Client {
  id: string;
  name: string;
}

interface UnlockCode {
  id: string;
  code: string;
  course_id: string | null;
  courses?: { title: string } | null;
  colleges?: { name: string } | null;
  clients?: { name: string } | null;
  batch_label: string;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  training_type: "ONE_TO_ONE" | "COLLEGE" | "CORPORATE" | null;
  seats: number;
  seats_used: number;
  valid_from: string | null;
  valid_until: string | null;
  status: "ACTIVE" | "PAUSED" | "REVOKED" | "EXHAUSTED";
  college_id: string | null;
  organization_id: string | null;
  coordinator_name: string | null;
  coordinator_email: string | null;
  allowed_email_domain: string | null;
  notes: string | null;
  created_at: string;
}

interface RedemptionLog {
  id: string;
  user_id: string;
  redeemed_at: string;
  profiles: {
    name: string;
    email: string;
  } | null;
  enrollment_id: string | null;
}

const EMPTY_FORM = {
  training_type: "" as any,
  code: "",
  course_id: "",
  batch_label: "",
  seats: 10,
  valid_from: "",
  valid_until: "",
  college_id: "",
  organization_id: "",
  coordinator_name: "",
  coordinator_email: "",
  allowed_email_domain: "",
  notes: "",
  is_active: true,
  bulk: false,
  bulk_count: 5,
  prefix: "",
};

export default function AdminUnlockCodesPage() {
  const router = useRouter();

  // Primary data states
  const [codes, setCodes] = useState<UnlockCode[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search & filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Log Modal state
  const [activeLogCode, setActiveLogCode] = useState<UnlockCode | null>(null);
  const [redemptions, setRedemptions] = useState<RedemptionLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Extend validity modal state
  const [activeExtendCode, setActiveExtendCode] = useState<UnlockCode | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [extending, setExtending] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [codesRes, coursesRes, collegesRes, clientsRes] = await Promise.all([
        fetch("/api/admin/unlock-codes"),
        fetch("/api/admin/courses"),
        fetch("/api/admin/colleges"),
        fetch("/api/admin/clients")
      ]);

      if (codesRes.status === 401 || coursesRes.status === 401) {
        router.push("/admin");
        return;
      }

      const codesData = await codesRes.json();
      const coursesData = await coursesRes.json();
      const collegesData = await collegesRes.json();
      const clientsData = await clientsRes.json();

      if (!codesRes.ok) throw new Error(codesData.error || "Failed to load unlock codes");
      if (!coursesRes.ok) throw new Error(coursesData.error || "Failed to load courses");
      if (!collegesRes.ok) throw new Error(collegesData.error || "Failed to load colleges");
      if (!clientsRes.ok) throw new Error(clientsData.error || "Failed to load clients");

      setCodes(codesData.codes || []);
      setCourses(coursesData.courses || []);
      setColleges(collegesData.colleges || []);
      setClients(clientsData.clients || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch unlock codes configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Preset configuration autofill helper
  const handlePresetChange = (type: "ONE_TO_ONE" | "COLLEGE" | "CORPORATE" | "") => {
    let prefix = "";
    let seats = 10;
    if (type === "ONE_TO_ONE") {
      prefix = "O2O-";
      seats = 1;
    } else if (type === "COLLEGE") {
      prefix = "COL-";
      seats = 30;
    } else if (type === "CORPORATE") {
      prefix = "CORP-";
      seats = 50;
    }
    
    // Generate sample code on the fly if not bulk
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    setForm((prev) => ({
      ...prev,
      training_type: type,
      prefix,
      code: prev.bulk ? "" : `${prefix}${randomPart}`,
      seats,
      allowed_email_domain: "",
      college_id: "",
      organization_id: "",
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.batch_label.trim()) {
      alert("Batch label / description is required.");
      return;
    }
    
    if (!form.bulk && !form.code.trim()) {
      alert("Alphanumeric access code is required.");
      return;
    }

    setSaving(true);

    const submitBody = {
      training_type: form.training_type || null,
      code: form.bulk ? undefined : form.code,
      course_id: form.course_id === "" ? null : form.course_id,
      batch_label: form.batch_label,
      seats: form.seats,
      max_uses: form.seats, // Sync legacy max_uses for backward compatibility
      valid_from: form.valid_from === "" ? null : new Date(form.valid_from).toISOString(),
      valid_until: form.valid_until === "" ? null : new Date(form.valid_until).toISOString(),
      expires_at: form.valid_until === "" ? null : new Date(form.valid_until).toISOString(), // Sync legacy expires_at
      college_id: form.training_type === "COLLEGE" && form.college_id ? form.college_id : null,
      organization_id: form.training_type === "CORPORATE" && form.organization_id ? form.organization_id : null,
      coordinator_name: form.coordinator_name || null,
      coordinator_email: form.coordinator_email || null,
      allowed_email_domain: form.allowed_email_domain || null,
      notes: form.notes || null,
      is_active: form.is_active,
      status: "ACTIVE",
      // Bulk generation params
      bulk: form.bulk,
      bulk_count: form.bulk_count,
      prefix: form.prefix
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/unlock-codes/${editingId}` : "/api/admin/unlock-codes";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitBody),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save operation failed.");
      
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchData();
    } catch (e: any) {
      alert(e.message || "Failed to save access code configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (code: UnlockCode) => {
    setEditingId(code.id);
    setForm({
      training_type: code.training_type || "",
      code: code.code,
      course_id: code.course_id || "",
      batch_label: code.batch_label,
      seats: code.seats !== null ? code.seats : code.max_uses,
      valid_from: code.valid_from ? new Date(code.valid_from).toISOString().slice(0, 16) : "",
      valid_until: code.valid_until ? new Date(code.valid_until).toISOString().slice(0, 16) : (code.expires_at ? new Date(code.expires_at).toISOString().slice(0, 16) : ""),
      college_id: code.college_id || "",
      organization_id: code.organization_id || "",
      coordinator_name: code.coordinator_name || "",
      coordinator_email: code.coordinator_email || "",
      allowed_email_domain: code.allowed_email_domain || "",
      notes: code.notes || "",
      is_active: code.is_active,
      bulk: false,
      bulk_count: 5,
      prefix: "",
    });
    setShowForm(true);
  };

  const updateStatus = async (id: string, newStatus: string, isActive: boolean = true) => {
    try {
      const res = await fetch(`/api/admin/unlock-codes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, is_active: isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Status update failed.");
      
      setCodes((prev) => 
        prev.map((c) => (c.id === id ? { ...c, status: newStatus as any, is_active: isActive } : c))
      );
    } catch (e: any) {
      alert(e.message || "Failed to update code status.");
    }
  };

  const handleExtendValidity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExtendCode || !newExpiryDate) return;
    setExtending(true);

    const expiresUtc = new Date(newExpiryDate).toISOString();

    try {
      const res = await fetch(`/api/admin/unlock-codes/${activeExtendCode.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          valid_until: expiresUtc,
          expires_at: expiresUtc,
          status: activeExtendCode.seats_used >= activeExtendCode.seats ? "EXHAUSTED" : "ACTIVE",
          is_active: true
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extension failed.");
      
      setActiveExtendCode(null);
      setNewExpiryDate("");
      fetchData();
    } catch (e: any) {
      alert(e.message || "Failed to extend validity.");
    } finally {
      setExtending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this access code? Existing enrolled users will remain active, but new users won't be able to redeem it.")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/unlock-codes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete access code.");
    } finally {
      setDeletingId(null);
    }
  };

  const openLogModal = async (code: UnlockCode) => {
    setActiveLogCode(code);
    setRedemptions([]);
    setLoadingLogs(true);
    try {
      const res = await fetch(`/api/admin/unlock-codes/${code.id}/redemptions`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load redemption logs");
      setRedemptions(data.redemptions || []);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Could not retrieve redemption logs.");
    } finally {
      setLoadingLogs(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Code "${text}" copied to clipboard!`);
  };

  // Filtering & Sorting Logic
  const filteredCodes = codes.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      c.code.toLowerCase().includes(term) ||
      c.batch_label.toLowerCase().includes(term) ||
      (c.courses?.title || "").toLowerCase().includes(term) ||
      (c.colleges?.name || "").toLowerCase().includes(term) ||
      (c.clients?.name || "").toLowerCase().includes(term) ||
      (c.coordinator_name || "").toLowerCase().includes(term);

    const matchesType = 
      filterType === "ALL" || 
      (filterType === "STANDARD" && c.training_type === null) ||
      (c.training_type === filterType);

    const now = new Date();
    const hasExpired = Boolean(c.valid_until || c.expires_at) && new Date(c.valid_until || c.expires_at!) < now;
    
    let matchesStatus = true;
    if (filterStatus === "ACTIVE") {
      matchesStatus = c.status === "ACTIVE" && c.is_active && !hasExpired;
    } else if (filterStatus === "PAUSED") {
      matchesStatus = c.status === "PAUSED";
    } else if (filterStatus === "REVOKED") {
      matchesStatus = c.status === "REVOKED" || !c.is_active;
    } else if (filterStatus === "EXHAUSTED") {
      matchesStatus = c.status === "EXHAUSTED" || c.seats_used >= c.seats;
    } else if (filterStatus === "EXPIRED") {
      matchesStatus = hasExpired;
    }

    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedCodes = [...filteredCodes].sort((a, b) => {
    let av: any = a[sortBy as keyof UnlockCode];
    let bv: any = b[sortBy as keyof UnlockCode];
    
    if (sortBy === "course") av = a.courses?.title || "";
    if (sortBy === "course") bv = b.courses?.title || "";

    if (av == null) return sortAsc ? 1 : -1;
    if (bv == null) return sortAsc ? -1 : 1;
    
    if (av < bv) return sortAsc ? -1 : 1;
    if (av > bv) return sortAsc ? 1 : -1;
    return 0;
  });

  const requestSort = (field: string) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in font-sans">
      
      {/* Upper header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-700" />
            Training Access &amp; Enrollment Codes
          </h2>
          <p className="text-xs text-slate-500 mt-1">Deploy access code batches for One-to-One mentoring, College partnerships, and Corporate cohorts.</p>
        </div>
        
        <Button
          onClick={() => {
            setForm(EMPTY_FORM);
            setEditingId(null);
            setShowForm(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 rounded-xl transition-all shadow-sm shrink-0 border-0"
        >
          <Plus className="w-4 h-4" /> Generate Access Codes
        </Button>
      </div>

      {error && (
        <div className="bg-red-50/50 border border-red-200 p-4 rounded-xl flex items-start space-x-3 text-red-700 animate-fade-up">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Modern Filter Toolbar */}
      <div className="bg-white border border-slate-250/60 rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search code, batch, course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-450 focus:outline-none focus:border-cyan-600/40 text-slate-800 font-medium"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap gap-3 items-center">
          
          {/* Training type */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-655 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="ONE_TO_ONE">One-to-One</option>
              <option value="COLLEGE">College Batches</option>
              <option value="CORPORATE">Corporate Cohorts</option>
              <option value="STANDARD">Standard Vouchers</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-655 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="EXHAUSTED">Exhausted</option>
              <option value="EXPIRED">Expired</option>
              <option value="REVOKED">Revoked / Disabled</option>
            </select>
          </div>

          {/* Reset */}
          {(searchTerm || filterType !== "ALL" || filterStatus !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("ALL");
                setFilterStatus("ALL");
              }}
              className="text-xs text-slate-500 hover:text-slate-855 font-bold hover:underline cursor-pointer border-0 bg-transparent px-2"
            >
              Clear filters
            </button>
          )}

        </div>

      </div>

      {/* Main Table Grid */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-700" />
          <p className="text-xs text-slate-400">Loading code assets configuration...</p>
        </div>
      ) : sortedCodes.length === 0 ? (
        <div className="py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white text-center flex flex-col items-center justify-center p-6 shadow-sm">
          <ShieldAlert className="w-10 h-10 text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-800">No Access Codes Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1">There are no records matching your active filters. Try clearing them or create a new code.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="p-4 cursor-pointer hover:bg-slate-100/80 transition-colors" onClick={() => requestSort("code")}>
                    <div className="flex items-center gap-1.5">Code <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100/80 transition-colors" onClick={() => requestSort("training_type")}>
                    <div className="flex items-center gap-1.5">Type <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100/80 transition-colors" onClick={() => requestSort("batch_label")}>
                    <div className="flex items-center gap-1.5">Batch / Account Scope <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100/80 transition-colors" onClick={() => requestSort("course")}>
                    <div className="flex items-center gap-1.5">Course <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4">Seats Claimed</th>
                  <th className="p-4">Validity Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-[13px] text-slate-700 font-medium">
                {sortedCodes.map((c) => {
                  const now = new Date();
                  const hasExpired = (c.valid_until || c.expires_at) && new Date(c.valid_until || c.expires_at!) < now;
                  
                  const isPaused = c.status === "PAUSED";
                  const isRevoked = c.status === "REVOKED" || !c.is_active;
                  const isExhausted = c.status === "EXHAUSTED" || c.seats_used >= c.seats;
                  
                  // Label badge for training type
                  let typeLabel = "Standard";
                  let typeClass = "bg-slate-100 text-slate-700 border-slate-200/50";
                  if (c.training_type === "ONE_TO_ONE") {
                    typeLabel = "One-to-One";
                    typeClass = "bg-emerald-50 text-emerald-800 border-emerald-100";
                  } else if (c.training_type === "COLLEGE") {
                    typeLabel = "College";
                    typeClass = "bg-blue-50 text-blue-800 border-blue-100";
                  } else if (c.training_type === "CORPORATE") {
                    typeLabel = "Corporate";
                    typeClass = "bg-purple-50 text-purple-800 border-purple-100";
                  }

                  // Label for status
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase px-2 py-0.5 rounded border bg-emerald-50 text-emerald-800 border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  );
                  if (isRevoked) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase px-2 py-0.5 rounded border bg-rose-50 text-rose-800 border-rose-100">
                        <X className="w-3 h-3" /> Revoked
                      </span>
                    );
                  } else if (isPaused) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase px-2 py-0.5 rounded border bg-amber-50 text-amber-800 border-amber-100">
                        <Pause className="w-3 h-3" /> Paused
                      </span>
                    );
                  } else if (isExhausted) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase px-2 py-0.5 rounded border bg-slate-100 text-slate-600 border-slate-200">
                        <ShieldAlert className="w-3 h-3" /> Exhausted
                      </span>
                    );
                  } else if (hasExpired) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase px-2 py-0.5 rounded border bg-red-50 text-red-800 border-red-100">
                        <Clock className="w-3 h-3" /> Expired
                      </span>
                    );
                  }

                  // Format dates
                  const formatUntil = c.valid_until || c.expires_at
                    ? new Date(c.valid_until || c.expires_at!).toLocaleDateString("en-IN")
                    : "No Limit";

                  const totalSeats = c.seats !== null ? c.seats : c.max_uses;
                  const claimedSeats = c.seats_used !== null ? c.seats_used : c.used_count;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Code */}
                      <td className="p-4 font-mono font-bold text-cyan-850 tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <span>{c.code}</span>
                          <button 
                            onClick={() => copyToClipboard(c.code)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyan-700 p-0.5 hover:bg-slate-100 rounded transition-all cursor-pointer border-0 bg-transparent"
                            title="Copy code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="p-4">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${typeClass}`}>
                          {typeLabel}
                        </span>
                      </td>

                      {/* Batch label */}
                      <td className="p-4 max-w-[200px] truncate">
                        <div className="font-bold text-slate-800">{c.batch_label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate font-normal">
                          {c.training_type === "COLLEGE" && c.colleges ? `College: ${c.colleges.name}` : ""}
                          {c.training_type === "CORPORATE" && c.clients ? `Org: ${c.clients.name}` : ""}
                          {c.training_type === "ONE_TO_ONE" && c.coordinator_email ? `Learner: ${c.coordinator_email}` : ""}
                          {(!c.training_type && c.notes) ? c.notes : ""}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="p-4 max-w-[150px] truncate text-slate-655">
                        {c.courses?.title || "Universal / Site-wide"}
                      </td>

                      {/* Seats claim */}
                      <td className="p-4">
                        <div className="flex items-center justify-between text-xs text-slate-800 font-bold mb-1 w-20">
                          <span>{claimedSeats} / {totalSeats}</span>
                          {totalSeats > 0 && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              {Math.round((claimedSeats / totalSeats) * 100)}%
                            </span>
                          )}
                        </div>
                        <div className="w-20 bg-slate-100 border border-slate-200/50 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isExhausted ? "bg-slate-400" : "bg-cyan-600"}`} 
                            style={{ width: `${Math.min((claimedSeats / totalSeats) * 100, 100)}%` }} 
                          />
                        </div>
                      </td>

                      {/* Validity */}
                      <td className="p-4 text-xs font-semibold text-slate-600">
                        <div>Until: {formatUntil}</div>
                        {c.allowed_email_domain && (
                          <div className="text-[10px] text-cyan-700 mt-0.5 font-bold uppercase tracking-wider">
                            @{c.allowed_email_domain} only
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">{statusBadge}</td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openLogModal(c)}
                            className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors shadow-sm bg-white"
                            title="View usage logs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {/* Pause/Resume toggles */}
                          {(!isRevoked && !isExhausted) && (
                            <button
                              onClick={() => updateStatus(c.id, isPaused ? "ACTIVE" : "PAUSED", true)}
                              className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-cyan-700 transition-colors shadow-sm bg-white"
                              title={isPaused ? "Resume Code" : "Pause Code"}
                            >
                              {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4" />}
                            </button>
                          )}

                          {/* Revoke button */}
                          {!isRevoked && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to revoke code "${c.code}"? It will be permanently disabled.`)) {
                                  updateStatus(c.id, "REVOKED", false);
                                }
                              }}
                              className="p-1.5 border border-slate-200 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-700 transition-colors shadow-sm bg-white"
                              title="Revoke / Disable"
                            >
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            </button>
                          )}

                          {/* Extend button */}
                          {(hasExpired || isPaused || isRevoked) && (
                            <button
                              onClick={() => {
                                setActiveExtendCode(c);
                                setNewExpiryDate(c.valid_until ? c.valid_until.slice(0, 16) : "");
                              }}
                              className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-amber-700 transition-colors shadow-sm bg-white"
                              title="Extend Expiry Date"
                            >
                              <Calendar className="w-4 h-4 text-amber-600" />
                            </button>
                          )}

                          <button
                            onClick={() => handleEdit(c)}
                            className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-cyan-700 transition-colors shadow-sm bg-white"
                            title="Edit details"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          
                          <button
                            disabled={deletingId === c.id}
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 border border-slate-200 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-655 disabled:opacity-35 transition-colors shadow-sm bg-white"
                            title="Delete"
                          >
                            {deletingId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Access Code Generation Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-y-auto max-h-[90vh] animate-scale-up">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold border-0 bg-transparent text-lg cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-600" />
              {editingId ? "Modify Access Code Configuration" : "Generate Access Codes"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Preset Selector (Only for new codes) */}
              {!editingId && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Access Code Preset Mode
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { val: "", label: "Standard" },
                      { val: "ONE_TO_ONE", label: "One-to-One" },
                      { val: "COLLEGE", label: "College" },
                      { val: "CORPORATE", label: "Corporate" },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => handlePresetChange(p.val as any)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          form.training_type === p.val
                            ? "bg-cyan-50 border-cyan-300 text-cyan-800"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Single vs Bulk Code Generation */}
              {!editingId && (
                <div className="bg-slate-50/50 border border-slate-150 p-3.5 rounded-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="bulk_mode"
                        checked={form.bulk}
                        onChange={(e) => {
                          const isBulk = e.target.checked;
                          setForm((prev) => ({
                            ...prev,
                            bulk: isBulk,
                            code: isBulk ? "" : `${prev.prefix}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
                          }));
                        }}
                        className="w-4 h-4 rounded text-cyan-700 border-slate-300"
                      />
                      <label htmlFor="bulk_mode" className="text-xs font-bold text-slate-700">
                        Bulk generate multiple unique codes
                      </label>
                    </div>
                  </div>

                  {form.bulk ? (
                    <div className="grid grid-cols-2 gap-4 animate-fade-in">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Code Prefix *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.prefix}
                          onChange={(e) => setForm((prev) => ({ ...prev, prefix: e.target.value.toUpperCase() }))}
                          placeholder="e.g. COL-"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Batch Count *
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={100}
                          value={form.bulk_count}
                          onChange={(e) => setForm((prev) => ({ ...prev, bulk_count: Math.max(1, Number(e.target.value)) }))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Access Code *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={form.code}
                          onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                          placeholder="e.g. CORP-KERALA"
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-wider text-cyan-850"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
                            setForm((prev) => ({ ...prev, code: `${prev.prefix}${rand}` }));
                          }}
                          className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl"
                        >
                          Regenerate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Preset Scoping Dropdowns */}
              {form.training_type === "COLLEGE" && (
                <div className="grid grid-cols-2 gap-4 bg-blue-50/20 border border-blue-100/40 p-4 rounded-xl animate-fade-in">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Academic Institution / College *
                    </label>
                    <select
                      required
                      value={form.college_id}
                      onChange={(e) => setForm((prev) => ({ ...prev, college_id: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                    >
                      <option value="">Select College...</option>
                      {colleges.map((col) => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {form.training_type === "CORPORATE" && (
                <div className="grid grid-cols-2 gap-4 bg-purple-50/20 border border-purple-100/40 p-4 rounded-xl animate-fade-in">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Corporate Partner / Organization *
                    </label>
                    <select
                      required
                      value={form.organization_id}
                      onChange={(e) => setForm((prev) => ({ ...prev, organization_id: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                    >
                      <option value="">Select Organization...</option>
                      {clients.map((cli) => (
                        <option key={cli.id} value={cli.id}>{cli.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Core Details (Label, Seats, Course) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Batch Label / Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.batch_label}
                    onChange={(e) => setForm((prev) => ({ ...prev, batch_label: e.target.value }))}
                    placeholder="e.g. CUSAT MCA - Batch 2026"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Seats / Max Allowed Uses *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.seats}
                    onChange={(e) => setForm((prev) => ({ ...prev, seats: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Target Course / Program
                  </label>
                  <select
                    value={form.course_id}
                    onChange={(e) => setForm((prev) => ({ ...prev, course_id: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold"
                  >
                    <option value="">Universal / Unlocks Any Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coordinator & Domain Rules */}
              {(form.training_type === "COLLEGE" || form.training_type === "CORPORATE" || form.training_type === "ONE_TO_ONE") && (
                <div className="border border-slate-150 p-4 rounded-xl space-y-3 bg-slate-50/30">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Contact Coordinator &amp; Domain Restrictions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Coordinator Name
                      </label>
                      <input
                        type="text"
                        value={form.coordinator_name}
                        onChange={(e) => setForm((prev) => ({ ...prev, coordinator_name: e.target.value }))}
                        placeholder="e.g. Thomas Mathew"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Coordinator Email
                      </label>
                      <input
                        type="email"
                        value={form.coordinator_email}
                        onChange={(e) => setForm((prev) => ({ ...prev, coordinator_email: e.target.value }))}
                        placeholder="tmathew@cusat.ac.in"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                        Allowed Email Domain Constraint
                        <span title="Restrict redemption to users signing up with this email domain. e.g. 'cusat.ac.in'">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                        </span>
                      </label>
                      <input
                        type="text"
                        value={form.allowed_email_domain}
                        onChange={(e) => setForm((prev) => ({ ...prev, allowed_email_domain: e.target.value.replace(/@/g, "") }))}
                        placeholder="e.g. cusat.ac.in"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Expiration and Notes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Valid From Date
                  </label>
                  <input
                    type="datetime-local"
                    value={form.valid_from}
                    onChange={(e) => setForm((prev) => ({ ...prev, valid_from: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Valid Until / Expiration
                  </label>
                  <input
                    type="datetime-local"
                    value={form.valid_until}
                    onChange={(e) => setForm((prev) => ({ ...prev, valid_until: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Notes / Admin Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Provide additional details regarding batch scoping or approval."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded text-cyan-700 border-slate-350"
                />
                <label htmlFor="is_active" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Access Code Enabled / Active immediately
                </label>
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold flex items-center justify-center rounded-xl transition-all shadow-md shrink-0 border-0"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? "Save Changes" : "Generate Batch Codes")}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Redemption Logs Modal */}
      {activeLogCode && (
        <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[2px] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col max-h-[85vh] animate-scale-up">
            <button
              onClick={() => setActiveLogCode(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold border-0 bg-transparent text-lg cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-600" />
              Redemption Audit History
            </h3>
            <p className="text-xs text-slate-400 font-mono tracking-wider mb-4">Passcode: {activeLogCode.code} &middot; {activeLogCode.batch_label}</p>

            <div className="flex-1 overflow-y-auto min-h-[250px] scrollbar-thin">
              {loadingLogs ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-700" />
                  <span className="text-xs text-slate-400">Fetching audit logs from database...</span>
                </div>
              ) : redemptions.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-8 h-8 text-slate-200" />
                  <p className="font-bold text-slate-655">No Redemptions Yet</p>
                  <p className="font-normal text-slate-400">This code has not been claimed by any student yet.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/30">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="p-3">Learner Name</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Claim Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-xs font-semibold text-slate-700">
                      {redemptions.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="p-3 text-slate-800 font-bold">{log.profiles?.name || "Student Demo"}</td>
                          <td className="p-3 font-mono text-slate-550">{log.profiles?.email || "student@kvjanalytics.in"}</td>
                          <td className="p-3 text-slate-450 font-normal">
                            {new Date(log.redeemed_at).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-right">
              <Button
                onClick={() => setActiveLogCode(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm shrink-0"
              >
                Close Logs
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Validity Modal */}
      {activeExtendCode && (
        <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setActiveExtendCode(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold border-0 bg-transparent text-lg cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Extend Validity Window
            </h3>
            <p className="text-xs text-slate-450 mt-1">Select a new expiration date for access code &ldquo;{activeExtendCode.code}&rdquo;.</p>

            <form onSubmit={handleExtendValidity} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  New Expiry Date &amp; Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveExtendCode(null)}
                  className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl shadow-sm"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={extending}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl border-0 shadow-md shrink-0 flex items-center gap-1.5"
                >
                  {extending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Extend Code"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
