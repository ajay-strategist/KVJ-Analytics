"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Download,
  LogOut,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Users,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  Phone,
  Mail,
  Building,
  Star,
  Globe,
  MapPin,
  FileText,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Lead {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  whatsapp_number?: string;
  training_mode?: string;
  course_id?: string;
  course?: {
    id: string;
    title: string;
  };
  college_name?: string;
  current_education?: string;
  current_profession?: string;
  location?: string;
  preferred_start_date?: string;
  notes?: string;
  rating?: number;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
  status: "draft" | "new" | "contacted" | "interested" | "follow_up" | "qualified" | "converted" | "rejected" | "closed";
  created_at: string;
  service_interest: string;
  message: string;
  source_page: string;
}

const StarRating = ({ rating = 3, onChange }: { rating?: number; onChange: (r: number) => void }) => {
  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={`w-3.5 h-3.5 ${
              star <= rating ? "fill-amber-400 text-amber-500" : "text-slate-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function AdminLeadsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCourse, setFilterCourse] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterCampaign, setFilterCampaign] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");

  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/leads");
      if (response.status === 401) {
        router.push("/admin");
        return;
      }
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load leads");
      }
      
      setLeads(data.leads || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch leads database.");
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

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Update failed");
      }

      // Update locally
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus as any } : lead
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRatingChange = async (leadId: string, newRating: number) => {
    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, rating: newRating }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update rating");
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, rating: newRating } : lead
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to update rating.");
    }
  };

  const handleNoteBlur = async (leadId: string, value: string) => {
    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, notes: value }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save note");
      }

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, notes: value } : lead
        )
      );
    } catch (err: any) {
      console.error("Failed to auto-save note:", err);
    }
  };

  // CSV Exporter
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      "ID",
      "Date",
      "Name",
      "Email",
      "Phone",
      "WhatsApp",
      "Course Program",
      "Training Mode",
      "Location",
      "Profession",
      "Organization/College",
      "Notes",
      "Rating",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "UTM Term",
      "UTM Content",
      "Landing Page",
      "Referrer",
      "Status",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.id,
      new Date(lead.created_at).toLocaleDateString(),
      lead.name,
      lead.email,
      lead.phone,
      lead.whatsapp_number || "",
      lead.course?.title || lead.service_interest || "",
      lead.training_mode || "",
      lead.location || "",
      lead.current_profession || "",
      lead.organization || lead.college_name || "",
      (lead.notes || "").replace(/\n/g, " "),
      lead.rating || 3,
      lead.utm_source || "",
      lead.utm_medium || "",
      lead.utm_campaign || "",
      lead.utm_term || "",
      lead.utm_content || "",
      lead.landing_page || "",
      lead.referrer || "",
      lead.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KVJ_Analytics_Leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Derive dynamic filter lists from actual data
  const coursesList = Array.from(new Set(leads.map((l) => l.course?.title).filter(Boolean))) as string[];
  const modesList = Array.from(new Set(leads.map((l) => l.training_mode).filter(Boolean))) as string[];
  const campaignsList = Array.from(new Set(leads.map((l) => l.utm_campaign).filter(Boolean))) as string[];
  const sourcesList = Array.from(new Set(leads.map((l) => l.utm_source).filter(Boolean))) as string[];

  // Filtering / Search computation
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    const matchesCourse = filterCourse === "all" || lead.course?.title === filterCourse || (filterCourse === "none" && !lead.course);
    const matchesMode = filterMode === "all" || lead.training_mode === filterMode || (filterMode === "none" && !lead.training_mode);
    const matchesCampaign = filterCampaign === "all" || lead.utm_campaign === filterCampaign || (filterCampaign === "none" && !lead.utm_campaign);
    const matchesSource = filterSource === "all" || lead.utm_source === filterSource || (filterSource === "none" && !lead.utm_source);

    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.notes || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.service_interest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesStatus && matchesCourse && matchesMode && matchesCampaign && matchesSource && matchesSearch;
  });

  // Summary Metrics calculations
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const contactedLeads = leads.filter((l) => l.status === "contacted" || l.status === "interested" || l.status === "follow_up").length;
  const closedLeads = leads.filter((l) => l.status === "closed" || l.status === "converted").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand mb-4" />
        <span className="text-sm font-semibold text-slate font-display">
          Loading Leads inbox...
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
            <h2 className="text-lg font-bold text-slate-900">Leads Inbox</h2>
            <p className="text-sm text-slate-500">Contact-form submissions and course registrations.</p>
          </div>
          <Button
            onClick={handleExportCSV}
            disabled={filteredLeads.length === 0}
            variant="secondary"
            className="px-4 py-2 text-sm border-line text-slate hover:bg-surface flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Submissions", val: totalLeads, color: "text-brand bg-[#08A88A]/5 border-[#08A88A]/20" },
            { label: "New / Unread", val: newLeads, color: "text-corporate bg-[#0E7490]/5 border-[#0E7490]/20" },
            { label: "In Follow Up / Active", val: contactedLeads, color: "text-education bg-amber-500/5 border-amber-500/20" },
            { label: "Closed / Converted", val: closedLeads, color: "text-success bg-emerald-500/5 border-emerald-500/20" },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-card p-6 shadow-soft flex items-center justify-between ${card.color}`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate/75 block">
                  {card.label}
                </span>
                <span className="text-3xl font-bold font-display mt-1 block">
                  {card.val}
                </span>
              </div>
              <Users className="w-8 h-8 opacity-40" />
            </div>
          ))}
        </div>

        {/* Multi-Filters / Search Panel */}
        <div className="bg-white p-6 rounded-card border border-line shadow-soft space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between border-b border-line pb-4">
            {/* Search input */}
            <div className="relative w-full lg:max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, email, notes, messages..."
                className="w-full pl-10 pr-4 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all"
              />
              <Search className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
            </div>

            {/* General Status Selector */}
            <div className="flex items-center space-x-2.5 w-full lg:w-auto justify-end">
              <label className="text-xs font-bold text-slate uppercase tracking-wider whitespace-nowrap">
                Status:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full lg:w-auto px-4 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft (Auto-saves)</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="follow_up">Follow Up</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="rejected">Rejected</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Marketing & Program Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Course Filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate/75 uppercase tracking-wider block">Course Program</label>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-line bg-surface/40 focus:bg-white focus:outline-none text-slate"
              >
                <option value="all">All Courses</option>
                <option value="none">General Inquiries Only</option>
                {coursesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Training Mode Filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate/75 uppercase tracking-wider block">Training Mode</label>
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-line bg-surface/40 focus:bg-white focus:outline-none text-slate"
              >
                <option value="all">All Modes</option>
                <option value="none">None (General Inquiry)</option>
                {modesList.map((m) => (
                  <option key={m} value={m}>
                    {m.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Campaign Filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate/75 uppercase tracking-wider block">UTM Campaign</label>
              <select
                value={filterCampaign}
                onChange={(e) => setFilterCampaign(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-line bg-surface/40 focus:bg-white focus:outline-none text-slate"
              >
                <option value="all">All Campaigns</option>
                <option value="none">Organic / No Campaign</option>
                {campaignsList.map((camp) => (
                  <option key={camp} value={camp}>
                    {camp}
                  </option>
                ))}
              </select>
            </div>

            {/* UTM Source Filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate/75 uppercase tracking-wider block">UTM Source</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-line bg-surface/40 focus:bg-white focus:outline-none text-slate"
              >
                <option value="all">All Sources</option>
                <option value="none">Organic / Direct</option>
                {sourcesList.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Table Panel */}
        <div className="bg-white border border-line rounded-card shadow-soft overflow-hidden animate-fade-up">
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-slate">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate" />
              <p className="text-base font-semibold">No submissions found matching filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                    <th className="p-4 pl-6">Received</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Program / Mode</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredLeads.map((lead) => {
                    const isExpanded = expandedLeadId === lead.id;
                    const dateStr = new Date(lead.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    // Status Badge Styling
                    const statusStyles: Record<string, string> = {
                      draft: "bg-slate-100 text-slate-650 border-slate-300",
                      new: "bg-blue-550/10 text-blue-600 border-blue-300/30",
                      contacted: "bg-amber-500/10 text-amber-600 border-amber-500/30",
                      interested: "bg-teal-500/10 text-teal-650 border-teal-500/30",
                      follow_up: "bg-indigo-500/10 text-indigo-650 border-indigo-500/30",
                      qualified: "bg-purple-500/10 text-purple-600 border-purple-500/30",
                      converted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                      rejected: "bg-rose-500/10 text-rose-600 border-rose-500/30",
                      closed: "bg-zinc-500/10 text-zinc-600 border-zinc-500/30",
                    };

                    const leadProgram = lead.course?.title || lead.service_interest || "General Inquiry";

                    return (
                      <React.Fragment key={lead.id}>
                        <tr className="hover:bg-surface/30 transition-colors text-[14px]">
                          {/* Received Date */}
                          <td className="p-4 pl-6 text-slate whitespace-nowrap">
                            <div className="flex items-center space-x-1.5 font-medium">
                              <Calendar className="w-3.5 h-3.5 opacity-60 text-slate" />
                              <span>{dateStr}</span>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="p-4">
                            <div className="font-bold text-ink flex items-center space-x-1.5">
                              <span>{lead.name}</span>
                              {lead.status === "draft" && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded uppercase bg-slate-100 text-slate-500 tracking-wider">
                                  Draft
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col space-y-0.5 text-xs text-slate mt-1">
                              <a href={`mailto:${lead.email}`} className="flex items-center hover:underline">
                                <Mail className="w-3 h-3 mr-1 text-slate/60" />
                                {lead.email}
                              </a>
                              <a href={`tel:${lead.phone}`} className="flex items-center hover:underline">
                                <Phone className="w-3 h-3 mr-1 text-slate/60" />
                                {lead.phone}
                              </a>
                            </div>
                          </td>

                          {/* Program / Mode */}
                          <td className="p-4">
                            <div className="font-semibold text-ink truncate max-w-[200px]" title={leadProgram}>
                              {leadProgram}
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] text-slate/80 mt-0.5">
                              {lead.training_mode ? (
                                <span className="px-1.5 py-0.5 rounded bg-brand/5 border border-brand/20 font-bold uppercase tracking-wider text-brand">
                                  {lead.training_mode}
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-surface border border-line font-medium text-slate">
                                  Contact Form
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Star Rating Widget */}
                          <td className="p-4 whitespace-nowrap">
                            <StarRating
                              rating={lead.rating}
                              onChange={(r) => handleRatingChange(lead.id, r)}
                            />
                          </td>

                          {/* Status Dropdown */}
                          <td className="p-4 whitespace-nowrap">
                            <select
                              value={lead.status}
                              disabled={updatingId === lead.id}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`px-3 py-1 rounded border text-xs font-bold leading-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand ${
                                statusStyles[lead.status] || "bg-slate-100 text-slate-700"
                              }`}
                            >
                              <option value="draft">Draft</option>
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="interested">Interested</option>
                              <option value="follow_up">Follow Up</option>
                              <option value="qualified">Qualified</option>
                              <option value="converted">Converted</option>
                              <option value="rejected">Rejected</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>

                          {/* Read/Expand Action */}
                          <td className="p-4 text-center whitespace-nowrap">
                            <Button
                              onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                              variant="ghost"
                              className="px-3 py-1 text-xs text-slate hover:bg-surface border border-line hover:text-ink font-semibold"
                            >
                              <span className="mr-1">{isExpanded ? "Hide" : "Read"}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </Button>
                          </td>
                        </tr>

                        {/* Expanded Detailed Expander Panel */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="bg-surface/50 p-6 pl-8 border-b border-line animate-fade-up">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left/Center Column: Message & Details */}
                                <div className="lg:col-span-2 space-y-4">
                                  {/* Original customer message */}
                                  <div className="bg-white p-5 rounded-card border border-line shadow-sm">
                                    <div className="flex items-center space-x-2 border-b border-line pb-2.5 text-xs font-bold uppercase tracking-wider text-slate">
                                      <MessageSquare className="w-4 h-4 text-brand" />
                                      <span>Lead Requirement / Message</span>
                                    </div>
                                    <p className="text-base text-ink leading-relaxed whitespace-pre-wrap mt-3">
                                      {lead.message || "No custom message requirements provided."}
                                    </p>
                                  </div>

                                  {/* Dynamic Metadata grid (only rendered if it is a training registration) */}
                                  {lead.training_mode && (
                                    <div className="bg-white p-5 rounded-card border border-line shadow-sm space-y-3">
                                      <div className="flex items-center space-x-2 border-b border-line pb-2 text-xs font-bold uppercase tracking-wider text-slate">
                                        <UserCheck className="w-4 h-4 text-brand" />
                                        <span>Registration Details</span>
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs pt-1.5">
                                        {lead.whatsapp_number && (
                                          <div>
                                            <span className="text-slate-400 font-medium">WhatsApp Number:</span>
                                            <a href={`https://wa.me/${lead.whatsapp_number.replace(/\D/g,"")}`} target="_blank" className="font-bold text-brand hover:underline block mt-0.5">
                                              {lead.whatsapp_number}
                                            </a>
                                          </div>
                                        )}
                                        {lead.location && (
                                          <div>
                                            <span className="text-slate-400 font-medium">Location:</span>
                                            <span className="font-bold text-ink block mt-0.5">{lead.location}</span>
                                          </div>
                                        )}
                                        {lead.current_profession && (
                                          <div>
                                            <span className="text-slate-400 font-medium">Current Profession:</span>
                                            <span className="font-bold text-ink block mt-0.5">{lead.current_profession}</span>
                                          </div>
                                        )}
                                        {lead.college_name && (
                                          <div>
                                            <span className="text-slate-400 font-medium">College Name:</span>
                                            <span className="font-bold text-ink block mt-0.5">{lead.college_name}</span>
                                          </div>
                                        )}
                                        {lead.current_education && (
                                          <div>
                                            <span className="text-slate-400 font-medium">Current Education:</span>
                                            <span className="font-bold text-ink block mt-0.5">{lead.current_education}</span>
                                          </div>
                                        )}
                                        {lead.organization && (
                                          <div>
                                            <span className="text-slate-400 font-medium">Company Name:</span>
                                            <span className="font-bold text-ink block mt-0.5">{lead.organization}</span>
                                          </div>
                                        )}
                                        {lead.preferred_start_date && (
                                          <div>
                                            <span className="text-slate-400 font-medium">Preferred Start Date:</span>
                                            <span className="font-bold text-brand block mt-0.5">
                                              {new Date(lead.preferred_start_date).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                              })}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Right Column: Marketing Attribution, notes, rating */}
                                <div className="space-y-4">
                                  {/* Administrative notes */}
                                  <div className="bg-white p-5 rounded-card border border-line shadow-sm space-y-3">
                                    <div className="flex items-center space-x-2 border-b border-line pb-2 text-xs font-bold uppercase tracking-wider text-slate">
                                      <FileText className="w-4 h-4 text-brand" />
                                      <span>Administrative CRM Notes</span>
                                    </div>
                                    <textarea
                                      defaultValue={lead.notes || ""}
                                      onBlur={(e) => handleNoteBlur(lead.id, e.target.value)}
                                      placeholder="Write notes (e.g. called student, wants start date in Nov) - autosaves when clicking outside..."
                                      className="w-full p-3 border border-line rounded-lg text-xs bg-surface/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand focus:border-transparent transition-all resize-none font-body text-ink"
                                      rows={4}
                                    />
                                  </div>

                                  {/* Marketing Attribution details */}
                                  <div className="bg-white p-5 rounded-card border border-line shadow-sm space-y-2">
                                    <div className="flex items-center space-x-2 border-b border-line pb-2 text-xs font-bold uppercase tracking-wider text-slate">
                                      <Globe className="w-4 h-4 text-brand" />
                                      <span>Marketing Attribution</span>
                                    </div>
                                    <div className="space-y-2 text-[11px] pt-1.5">
                                      <div>
                                        <span className="text-slate-400 font-medium">Source / Medium:</span>
                                        <span className="font-bold text-ink block">
                                          {lead.utm_source || "direct"} / {lead.utm_medium || "none"}
                                        </span>
                                      </div>
                                      {lead.utm_campaign && (
                                        <div>
                                          <span className="text-slate-400 font-medium">Campaign Name:</span>
                                          <span className="font-bold text-ink block">{lead.utm_campaign}</span>
                                        </div>
                                      )}
                                      {(lead.utm_term || lead.utm_content) && (
                                        <div>
                                          <span className="text-slate-400 font-medium">Term / Content:</span>
                                          <span className="font-bold text-ink block">
                                            {lead.utm_term || "-"} / {lead.utm_content || "-"}
                                          </span>
                                        </div>
                                      )}
                                      {lead.landing_page && (
                                        <div>
                                          <span className="text-slate-400 font-medium">Landing Page Path:</span>
                                          <span className="font-bold text-ink block truncate max-w-[220px]" title={lead.landing_page}>
                                            {lead.landing_page}
                                          </span>
                                        </div>
                                      )}
                                      {lead.referrer && (
                                        <div>
                                          <span className="text-slate-400 font-medium">Origin Referrer:</span>
                                          <span className="font-bold text-ink block truncate max-w-[220px]" title={lead.referrer}>
                                            {lead.referrer}
                                          </span>
                                        </div>
                                      )}
                                      <div>
                                        <span className="text-slate-400 font-medium">Lead ID:</span>
                                        <code className="text-[10px] text-slate-500 block break-all">{lead.id}</code>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
