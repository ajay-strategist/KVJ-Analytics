"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  Plus,
  Loader2,
  AlertCircle,
  Upload,
  Check,
  X,
  Eye,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  FileCode2,
  Copy,
  Clock,
  Phone,
  Mail,
  MapPin,
  Send,
  ExternalLink,
  Shield,
  Layers,
  Smartphone,
  Tablet,
  Monitor,
  Calendar,
  Tag,
  MessageSquare,
  Globe,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Info,
  Lock,
  Code,
  FileText,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Course {
  id: string;
  slug: string;
  title: string;
  registration_form_html?: string | null;
}

interface Campaign {
  id: string;
  campaign_id: string;
  campaign_name: string;
  course_id: string;
  training_mode: string;
  registration_form_id?: string | null;
  registration_form_html?: string | null;
  status: "active" | "paused" | "completed";
  telegram_enabled: boolean;
  teams_enabled: boolean;
  created_at: string;
  updated_at: string;
  lead_count?: number;
  new_leads_count?: number;
  contacted_count?: number;
  converted_count?: number;
  course?: Course;
}

interface SavedForm {
  id: string;
  name: string;
  course_id: string;
  html_content: string;
  created_at: string;
}

interface Lead {
  id: string;
  campaign_id?: string;
  course_id?: string;
  name: string;
  email: string;
  phone: string;
  current_profession?: string;
  college_name?: string;
  organization?: string;
  location?: string;
  message?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  landing_page?: string;
  referrer?: string;
  status: "draft" | "new" | "contacted" | "interested" | "follow_up" | "qualified" | "converted" | "rejected";
  created_at: string;
}

export default function AdminCampaignsPage() {
  const router = useRouter();

  // Primary State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtering & View State
  const [activeTab, setActiveTab] = useState<"list" | "detail">("list");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCourse, setFilterCourse] = useState<string>("all");

  // Create Campaign Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [formChoice, setFormChoice] = useState<"new" | "existing">("new");

  // Create Form Fields
  const [newCampName, setNewCampName] = useState("");
  const [newCourseId, setNewCourseId] = useState("");
  const [newTrainingMode, setNewTrainingMode] = useState("online");
  const [newStatus, setNewStatus] = useState<"active" | "paused" | "completed">("active");
  const [selectedFormId, setSelectedFormId] = useState("");
  const [customFormHtml, setCustomFormHtml] = useState("");
  const [savingCampaign, setSavingCampaign] = useState(false);

  // Accordion & Guide States for Step 2
  const [showStructureAccordion, setShowStructureAccordion] = useState(false);
  const [showFieldsAccordion, setShowFieldsAccordion] = useState(false);
  const [showAiRulesAccordion, setShowAiRulesAccordion] = useState(false);
  const [copiedReqs, setCopiedReqs] = useState(false);

  // Campaign Detail Dashboard State
  const [activeCampaignDetail, setActiveCampaignDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [leadFilterStatus, setLeadFilterStatus] = useState<string>("all");

  // Live Preview Settings
  const [previewTab, setPreviewTab] = useState<"editor" | "preview">("preview");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedFormHtml, setCopiedFormHtml] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(750);

  // Generate a full starter HTML registration form for the active campaign
  const generateStarterTemplate = () => {
    if (!activeCampaignDetail) return;
    const courseTitle = activeCampaignDetail.course?.title || "Our Course";
    const cmpId = activeCampaignDetail.campaign_id || activeCampaignDetail.id;
    const courseId = activeCampaignDetail.course_id || "";
    const trainingMode = activeCampaignDetail.training_mode || "online";
    const tpl = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${courseTitle} — Registration</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Poppins',sans-serif;background:linear-gradient(135deg,#0a0f23 0%,#111827 50%,#0d1b2a 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.card{background:#fff;border-radius:24px;padding:40px 36px;max-width:580px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,.35)}
.badge{display:inline-block;background:linear-gradient(90deg,#10b981,#0d9488);color:#fff;font-size:11px;font-weight:700;letter-spacing:.06em;padding:5px 14px;border-radius:999px;margin-bottom:18px;text-transform:uppercase}
h2{font-size:22px;font-weight:700;color:#0f172a;margin-bottom:6px;line-height:1.25}
.subtitle{font-size:13px;color:#64748b;margin-bottom:28px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.field{margin-bottom:16px}
label{display:block;font-size:11px;font-weight:600;color:#374151;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em}
input,select,textarea{width:100%;padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;font-family:inherit;color:#0f172a;outline:none;transition:border .2s,box-shadow .2s;background:#f8fafc}
input:focus,select:focus,textarea:focus{border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.12);background:#fff}
textarea{resize:vertical;min-height:90px}
.submit{width:100%;margin-top:8px;padding:14px;background:linear-gradient(90deg,#10b981,#0d9488);color:#fff;font-size:14px;font-weight:700;border:none;border-radius:12px;cursor:pointer;letter-spacing:.03em;transition:opacity .2s,transform .1s}
.submit:hover{opacity:.92;transform:translateY(-1px)}
.submit:disabled{opacity:.6;cursor:not-allowed}
.footer{margin-top:16px;text-align:center;font-size:10px;color:#94a3b8;line-height:1.6}
@media(max-width:500px){.row{grid-template-columns:1fr}.card{padding:28px 20px}}
</style>
</head>
<body>
<div class="card">
  <span class="badge">KVJ Analytics</span>
  <h2>Register for ${courseTitle}</h2>
  <p class="subtitle">Fill in your details and our team will reach out to you shortly.</p>
  <form data-kvj-form="registration" data-kvj-endpoint="/api/register" data-kvj-course="${courseId}">
    <input type="hidden" name="campaign_id" value="${cmpId}">
    <input type="hidden" name="course_id" value="${courseId}">
    <input type="hidden" name="training_mode" value="${trainingMode}">
    <input type="hidden" name="status" value="new">
    <input type="text" name="kvj_honeypot" style="display:none" tabindex="-1" autocomplete="off">
    <div class="row">
      <div class="field"><label for="name">Full Name *</label><input type="text" id="name" name="name" placeholder="Your full name" required></div>
      <div class="field"><label for="phone">Phone Number *</label><input type="tel" id="phone" name="phone" placeholder="+91 98765 43210" required></div>
    </div>
    <div class="field"><label for="email">Email Address *</label><input type="email" id="email" name="email" placeholder="you@example.com" required></div>
    <div class="row">
      <div class="field"><label for="age">Age</label><input type="number" id="age" name="age" placeholder="e.g. 22" min="16" max="60"></div>
      <div class="field"><label for="current_profession">Current Status</label><select id="current_profession" name="current_profession"><option value="">Select...</option><option>Student</option><option>Working Professional</option><option>Business Owner</option><option>Fresher</option><option>Other</option></select></div>
    </div>
    <div class="row">
      <div class="field"><label for="location">City / District</label><input type="text" id="location" name="location" placeholder="e.g. Kochi"></div>
      <div class="field"><label for="current_education">Qualification</label><input type="text" id="current_education" name="current_education" placeholder="e.g. B.Tech"></div>
    </div>
    <div class="field"><label for="message">Questions / Notes</label><textarea id="message" name="message" placeholder="Anything you'd like us to know..."></textarea></div>
    <button type="submit" class="submit">Submit Registration \u2192</button>
  </form>
  <p class="footer">By submitting this form you agree to be contacted by KVJ Analytics regarding this program.</p>
</div>
<script>
(function(){
  var form=document.querySelector('[data-kvj-form="registration"]');
  if(!form)return;
  form.addEventListener('submit',async function(e){
    e.preventDefault();
    var btn=form.querySelector('.submit');btn.textContent='Submitting...';btn.disabled=true;
    var data=Object.fromEntries(new FormData(form));
    var gc=function(n){return(document.cookie.match('(^| )'+n+'=([^;]+)')||[])[2]||''};
    data.utm_source=gc('utm_source');data.utm_medium=gc('utm_medium');data.utm_campaign=gc('utm_campaign');
    data.landing_page=window.location.href;data.referrer=document.referrer;
    try{
      var res=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      var json=await res.json();
      if(res.ok){form.innerHTML='<div style="text-align:center;padding:48px 0"><div style="font-size:48px;margin-bottom:12px">\u2705</div><h3 style="color:#10b981;font-size:20px;font-weight:700;margin-bottom:8px">Registration Received!</h3><p style="color:#64748b;font-size:13px">Our team will contact you within 24 hours.</p></div>';}
      else{alert('Error: '+(json.error||'Submission failed'));btn.textContent='Submit Registration \u2192';btn.disabled=false;}
    }catch(err){alert('Network error. Try again.');btn.textContent='Submit Registration \u2192';btn.disabled=false;}
  });
})();
</script>
</body>
</html>`;
    setCustomFormHtml(tpl);
    setPreviewTab("editor");
  };

  // Helper for generating public shareable form URL
  const getShareableFormUrl = (campaign: any) => {
    if (!campaign) return "";
    const slug = campaign.course?.slug || "ai";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.kvjanalytics.in";
    return `${origin}/training/register?course=${slug}&campaign=${campaign.campaign_id}`;
  };

  const getFormEmbedCode = (campaign: any) => {
    const url = getShareableFormUrl(campaign);
    return `<iframe src="${url}" width="100%" height="800" frameborder="0" style="border:0; width:100%; min-height:800px;"></iframe>`;
  };

  // Notification Settings State
  const [telegramOn, setTelegramOn] = useState(true);
  const [teamsOn, setTeamsOn] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError("");
    try {
      const [campRes, courseRes, formRes] = await Promise.all([
        fetch("/api/admin/campaigns"),
        fetch("/api/admin/courses"),
        fetch("/api/admin/registration-forms"),
      ]);

      if (campRes.status === 401) {
        router.push("/admin");
        return;
      }

      const campData = await campRes.json();
      const courseData = await courseRes.json();
      const formData = await formRes.json();

      setCampaigns(campData.campaigns || []);
      const courseList = courseData.courses || [];
      setCourses(courseList);
      setSavedForms(formData.forms || []);

      if (courseList.length > 0 && !newCourseId) {
        setNewCourseId(courseList[0].id);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  // Open Detailed Dashboard for a Campaign
  const handleViewCampaign = async (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setActiveTab("detail");
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load campaign details");
      setActiveCampaignDetail(data.campaign);
      setCustomFormHtml(data.campaign.registration_form_html || "");
      setTelegramOn(data.campaign.telegram_enabled !== false);
      setTeamsOn(data.campaign.teams_enabled !== false);
    } catch (err: any) {
      alert("Error loading campaign dashboard: " + err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Auto-generate Campaign ID Preview for Modal
  const getAutoGeneratedIdPreview = () => {
    const selectedCourseObj = courses.find((c) => c.id === newCourseId);
    const slug = selectedCourseObj?.slug || "ai";
    const prefix = slug.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4) || "CMP";
    const year = new Date().getFullYear();
    return `CMP-${prefix}-${year}-001`;
  };

  // Real-time HTML Form Integration Validator
  const getFormValidationStatus = (html: string) => {
    if (!html || !html.trim()) {
      return {
        isValid: false,
        hasIdentifier: false,
        hasEndpoint: false,
        hasNameField: false,
        hasEmailField: false,
        hasPhoneField: false,
        missingItems: ["No HTML form code provided yet."],
      };
    }

    const hasIdentifier = /data-kvj-form|id=["']registration-form["']|class=["'].*registration-form.*["']|<form/i.test(html);
    const hasEndpoint = /\/api\/register|data-kvj-endpoint|action=["'][^"']*register/i.test(html);
    const hasNameField = /name=["'](name|fullName|user_name|student_name)["']/i.test(html);
    const hasEmailField = /name=["'](email|user_email|student_email)["']/i.test(html);
    const hasPhoneField = /name=["'](phone|mobile|contact|telephone|user_phone)["']/i.test(html);

    const missingItems: string[] = [];
    if (!hasIdentifier) missingItems.push("Form identifier / <form> tag missing");
    if (!hasEndpoint) missingItems.push("Registration endpoint (/api/register) missing");
    if (!hasNameField) missingItems.push("Required Full Name field (name=\"name\") missing");
    if (!hasEmailField) missingItems.push("Required Email field (name=\"email\") missing");
    if (!hasPhoneField) missingItems.push("Required Phone field (name=\"phone\") missing");

    const isValid = hasIdentifier && hasEndpoint && hasNameField && hasEmailField && hasPhoneField;

    return {
      isValid,
      hasIdentifier,
      hasEndpoint,
      hasNameField,
      hasEmailField,
      hasPhoneField,
      missingItems,
    };
  };

  // Copy Integration Requirements to Clipboard
  const handleCopyIntegrationReqs = () => {
    const selectedCourseObj = courses.find((c) => c.id === newCourseId);
    const text = `
KVJ ANALYTICS REGISTRATION FORM INTEGRATION CONTRACT
===================================================
Campaign Name: ${newCampName || "New Campaign"}
Campaign ID: ${getAutoGeneratedIdPreview()}
Course: ${selectedCourseObj?.title || "Artificial Intelligence"}
Course ID: ${selectedCourseObj?.id || "SELECTED_COURSE_ID"}
Training Mode: ${newTrainingMode || "online"}
Registration Endpoint: /api/register

MANDATORY INTEGRATION CONTRACT:
1. <form data-kvj-form="registration" data-kvj-endpoint="/api/register" data-kvj-course="${selectedCourseObj?.id || "COURSE_ID"}">
2. Hidden Campaign Context Fields:
   - <input type="hidden" name="campaign_id" value="${getAutoGeneratedIdPreview()}">
   - <input type="hidden" name="course_id" value="${selectedCourseObj?.id || "COURSE_ID"}">
   - <input type="hidden" name="training_mode" value="${newTrainingMode || "online"}">
3. Mandatory Lead Fields:
   - name="name" (Full Name)
   - name="email" (Email Address)
   - name="phone" (Phone Number)
4. Optional Fields:
   - name="location" (District / City)
   - name="status" (Current Status)
   - name="country" (Country)
   - name="message" (Questions / Notes)
5. SECURITY RULE: Never place database credentials, API keys, bot tokens, or webhook secrets inside the HTML.
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedReqs(true);
    setTimeout(() => setCopiedReqs(false), 3000);
  };

  // Copy AI Prompt Template with Dynamic Campaign Context
  const handleCopyAiPromptTemplate = () => {
    const courseId = activeCampaignDetail?.course_id || newCourseId;
    const selectedCourseObj = courses.find((c) => c.id === courseId);
    const courseIdVal = selectedCourseObj?.id || activeCampaignDetail?.course_id || "COURSE_ID";
    const courseTitleVal = selectedCourseObj?.title || activeCampaignDetail?.course?.title || "Artificial Intelligence";
    const campaignIdVal = activeCampaignDetail?.campaign_id || getAutoGeneratedIdPreview();
    const campaignNameVal = activeCampaignDetail?.campaign_name || newCampName || "New Campaign";
    const trainingModeVal = activeCampaignDetail?.training_mode || newTrainingMode || "online";

    const promptText = `You are an expert frontend developer generating a premium, modern, and highly responsive registration form for KVJ Analytics.

This HTML form will be embedded inside the KVJ Analytics campaign registration system. The HTML must strictly adhere to the KVJ Analytics API integration contract. Do not change the name/id attributes, hidden fields, course/campaign contexts, or the submission endpoint.

Please write the HTML, CSS (embedded in <style> tags), and JavaScript submit handler inside a single, self-contained HTML file.

---
TECHNICAL INTEGRATION CONTRACT:

1. FORM ATTRIBUTES & ENDPOINT
The <form> element MUST have the following attributes:
• data-kvj-form="registration"
• data-kvj-endpoint="/api/register"
• data-kvj-course="${courseIdVal}"

2. MANDATORY HIDDEN SYSTEM FIELDS:
These fields store campaign tracking info and prevent spam.
• <input type="hidden" name="campaign_id" value="${campaignIdVal}">
• <input type="hidden" name="course_id" value="${courseIdVal}">
• <input type="hidden" name="training_mode" value="${trainingModeVal}">

3. SPAM PROTECTION (Honeypot):
Include this input field to catch bots. Style it with display:none so humans cannot see it.
• <input type="text" name="kvj_honeypot" style="display:none" tabindex="-1" autocomplete="off">

4. USER INPUT FIELD ATTRIBUTES:
Use these exact name and id attributes for the input fields:
• Full Name             → name="name" id="name" (Required)
• Email Address         → name="email" id="email" (Required)
• Phone Number          → name="phone" id="phone" (Required, minimum 10 digits)
• WhatsApp Number       → name="whatsapp_number" id="whatsapp_number" (Optional)
• Current Status/Role   → name="current_profession" id="current_profession" (Optional)
• Location (District)   → name="location" id="location" (Optional)
• College Name          → name="college_name" id="college_name" (Optional)
• Highest Education     → name="current_education" id="current_education" (Optional)
• Preferred Start Date  → name="preferred_start_date" id="preferred_start_date" (Optional)
• Message / Notes       → name="message" id="message" (Optional)

5. JAVASCRIPT SUBMISSION HANDLER:
Add the following submission script before the closing </body> tag:

<script>
  document.querySelector('[data-kvj-form="registration"]').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    
    // Check honeypot
    const honeypot = form.querySelector('[name="kvj_honeypot"]').value;
    if (honeypot) {
      console.warn("Spam filter triggered.");
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Helper to read cookies for UTM parameter capture
    const getCookie = (name) => {
      const match = document.cookie.match('(^| )' + name + '=([^;]+)');
      return match ? match[2] : '';
    };

    // Populate marketing analytics data
    data.utmSource = getCookie('utm_source') || '';
    data.utmMedium = getCookie('utm_medium') || '';
    data.utmCampaign = getCookie('utm_campaign') || '';
    data.utmTerm = getCookie('utm_term') || '';
    data.utmContent = getCookie('utm_content') || '';
    data.landing_page = window.location.href;
    data.referrer = document.referrer;
    data.status = 'new'; // Marks lead status in Supabase

    // Capture submit button to show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Show success state
        form.innerHTML = \`
          <div class="success-message" style="text-align:center; color:#08A88A; padding:40px; font-size:18px; font-weight:600;">
            ✅ Registration Successful!<br>
            <span style="font-weight:400; font-size:14px; color:#64748B; display:block; margin-top:8px;">
              Thank you for registering. Our team will contact you shortly.
            </span>
          </div>
        \`;
      } else {
        alert('Registration Error: ' + (result.error || 'Please try again.'));
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please check your internet connection and try again.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
</script>

---
CAMPAIGN CONTEXT DETAILS:
• Campaign Name: ${campaignNameVal}
• Campaign ID: ${campaignIdVal}
• Course Title: ${courseTitleVal}
• Course ID: ${courseIdVal}
• Training Mode: ${trainingModeVal}

---
DESIGN SYSTEM REQUIREMENTS:
• Use a premium dark-glassmorphism or clean light design.
• Font: Use 'Poppins' (load it from Google Fonts).
• Brand Colors: Primary brand color is Teal (#08A88A or #0E7490). Backgrounds should match professional dark aesthetics (#0F172A).
• Add smooth micro-animations on input focuses and hover states.
• Ensure the form is completely responsive and mobile-friendly.

Generate a premium, modern, responsive registration form while preserving all integration requirements above.`;

    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  // Handle Save New Campaign
  const handleCreateCampaignSubmit = async () => {
    if (!newCampName.trim() || !newCourseId) {
      alert("Please enter a Campaign Name and select a Course.");
      return;
    }

    let finalFormHtml = customFormHtml;
    if (formChoice === "existing" && selectedFormId) {
      const formObj = savedForms.find((f) => f.id === selectedFormId);
      if (formObj) {
        finalFormHtml = formObj.html_content;
      }
    }

    setSavingCampaign(true);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_name: newCampName,
          course_id: newCourseId,
          training_mode: newTrainingMode,
          status: newStatus,
          registration_form_id: formChoice === "existing" ? selectedFormId : null,
          registration_form_html: finalFormHtml,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Campaign creation failed");

      // Save form to reusable library if new
      if (formChoice === "new" && finalFormHtml.trim()) {
        await fetch("/api/admin/registration-forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${newCampName} Form`,
            course_id: newCourseId,
            html_content: finalFormHtml,
          }),
        });
      }

      setShowCreateModal(false);
      setNewCampName("");
      setCustomFormHtml("");
      fetchInitialData();
      alert("Campaign created successfully!");
    } catch (err: any) {
      alert("Failed to create campaign: " + err.message);
    } finally {
      setSavingCampaign(false);
    }
  };

  // Handle Update Campaign Details / Notifications
  const handleUpdateCampaign = async (updates: Record<string, any>) => {
    if (!activeCampaignDetail) return;
    try {
      const res = await fetch(`/api/admin/campaigns/${activeCampaignDetail.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setActiveCampaignDetail((prev: any) => ({ ...prev, ...data.campaign }));
      fetchInitialData();
    } catch (err: any) {
      alert("Error updating campaign: " + err.message);
    }
  };

  // Lead Status Updater inside Campaign Dashboard
  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update lead status");

      if (activeCampaignDetail) {
        setActiveCampaignDetail((prev: any) => ({
          ...prev,
          leads: prev.leads.map((l: Lead) => (l.id === leadId ? { ...l, status: newStatus } : l)),
        }));
      }
    } catch (err: any) {
      alert("Failed to update lead status: " + err.message);
    }
  };

  // Computed Top Metrics
  const totalCampaignsCount = campaigns.length;
  const activeCampaignsCount = campaigns.filter((c) => c.status === "active").length;
  const totalLeadsCount = campaigns.reduce((acc, c) => acc + (c.lead_count || 0), 0);
  const newLeadsCount = campaigns.reduce((acc, c) => acc + (c.new_leads_count || 0), 0);
  const convertedLeadsCount = campaigns.reduce((acc, c) => acc + (c.converted_count || 0), 0);
  const overallConversionRate = totalLeadsCount > 0 ? ((convertedLeadsCount / totalLeadsCount) * 100).toFixed(1) : "0.0";

  // Computed Real-time Form Validation
  const validationStatus = getFormValidationStatus(customFormHtml);

  // Filtered Campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.campaign_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.course?.title || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesCourse = filterCourse === "all" || c.course_id === filterCourse;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand mx-auto" />
          <p className="text-xs font-semibold text-slate">Loading Marketing Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 font-body">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-brand" />
              <h1 className="text-xl font-bold font-display text-ink">Marketing Campaigns</h1>
            </div>
            <p className="text-xs text-slate mt-1">
              Create campaigns, capture leads, track performance, and manage registrations from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "detail" && (
              <Button
                onClick={() => setActiveTab("list")}
                className="py-2 px-3.5 bg-white border border-line text-ink hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All Campaigns
              </Button>
            )}

            <Button
              onClick={() => {
                setCreateStep(1);
                setFormChoice("new");
                setNewCampName("");
                setShowCreateModal(true);
              }}
              className="py-2.5 px-4 bg-brand text-white hover:bg-brand/90 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Campaign
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-xl flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* VIEW 1: CAMPAIGNS LIST & DASHBOARD */}
        {activeTab === "list" && (
          <div className="space-y-6">

            {/* Real Data KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-card border border-line rounded-2xl p-4 space-y-1 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Total Campaigns</p>
                <p className="text-2xl font-black text-ink">{totalCampaignsCount}</p>
                <p className="text-[10px] text-slate font-medium">All time campaigns</p>
              </div>

              <div className="bg-card border border-line rounded-2xl p-4 space-y-1 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Active Campaigns</p>
                <p className="text-2xl font-black text-emerald-600">{activeCampaignsCount}</p>
                <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 inline" /> Currently capturing
                </p>
              </div>

              {/* PROMINENT REAL LEAD COUNT CARD */}
              <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl p-4 space-y-1 shadow-soft col-span-2 sm:col-span-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Total Leads Captured</p>
                <p className="text-3xl font-black text-emerald-800 tracking-tight">{totalLeadsCount}</p>
                <p className="text-[10px] text-emerald-700 font-bold">Real database count</p>
              </div>

              <div className="bg-card border border-line rounded-2xl p-4 space-y-1 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate">New / Unread Leads</p>
                <p className="text-2xl font-black text-amber-600">{newLeadsCount}</p>
                <p className="text-[10px] text-amber-600 font-medium">Awaiting follow-up</p>
              </div>

              <div className="bg-card border border-line rounded-2xl p-4 space-y-1 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Avg Conversion Rate</p>
                <p className="text-2xl font-black text-brand">{overallConversionRate}%</p>
                <p className="text-[10px] text-slate font-medium">Converted / Total</p>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-card border border-line rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search campaign name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="font-bold">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-line rounded-lg text-xs bg-surface px-2.5 py-1.5 focus:outline-none font-semibold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate">
                  <span className="font-bold">Course:</span>
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="border border-line rounded-lg text-xs bg-surface px-2.5 py-1.5 focus:outline-none font-semibold max-w-[150px] truncate"
                  >
                    <option value="all">All Courses</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Campaign Cards Grid */}
            {filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((camp) => {
                  const leadCount = camp.lead_count || 0;
                  const modeLabel = (camp.training_mode || "online").toUpperCase();

                  return (
                    <div
                      key={camp.id}
                      className="bg-card border border-line rounded-3xl p-6 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 flex flex-col justify-between space-y-5"
                    >
                      {/* Top Header */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand bg-brand/10 px-2.5 py-1 rounded-lg border border-brand/20">
                            {camp.course?.title || "Program Campaign"}
                          </span>

                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            camp.status === "active"
                              ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                              : camp.status === "paused"
                              ? "bg-amber-100 border-amber-300 text-amber-800"
                              : "bg-slate-100 border-slate-300 text-slate-700"
                          }`}>
                            {camp.status}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-ink leading-snug">{camp.campaign_name}</h3>
                          <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-slate">
                            <Tag className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-bold">{camp.campaign_id}</span>
                            <span>•</span>
                            <span className="font-semibold text-brand">{modeLabel}</span>
                          </div>
                        </div>
                      </div>

                      {/* PROMINENT LEAD COUNT BOX */}
                      <div className="bg-surface border border-line rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Total Registrations</p>
                          <p className="text-3xl font-black text-ink">{leadCount}</p>
                        </div>

                        <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                          <Users className="w-6 h-6 text-brand" />
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-line flex items-center justify-between gap-3">
                        <span className="text-[10px] text-slate font-medium">
                          Created {new Date(camp.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>

                        <Button
                          onClick={() => handleViewCampaign(camp.campaign_id || camp.id)}
                          className="py-2 px-3.5 bg-brand text-white hover:bg-brand/90 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          View Campaign
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="bg-card border border-line rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-soft">
                <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto">
                  <Megaphone className="w-8 h-8 text-brand" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">No Campaigns Found</h3>
                  <p className="text-xs text-slate mt-1 leading-relaxed">
                    {searchQuery || filterStatus !== "all" || filterCourse !== "all"
                      ? "No campaigns matched your search filters. Try resetting your search."
                      : "Create your first marketing campaign to start capturing and tracking leads."}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setCreateStep(1);
                    setFormChoice("new");
                    setNewCampName("");
                    setShowCreateModal(true);
                  }}
                  className="py-2.5 px-5 bg-brand text-white hover:bg-brand/90 text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Create Campaign
                </Button>
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: CAMPAIGN DASHBOARD & DETAILS */}
        {activeTab === "detail" && (
          <div className="space-y-6">
            {loadingDetail || !activeCampaignDetail ? (
              <div className="bg-card border border-line rounded-3xl p-12 text-center space-y-3 shadow-soft">
                <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto" />
                <p className="text-xs text-slate font-semibold">Loading Campaign Dashboard...</p>
              </div>
            ) : (
              <>
                {/* Campaign Header */}
                <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand bg-brand/10 px-2.5 py-1 rounded-lg border border-brand/20">
                          {activeCampaignDetail.course?.title || "Program Campaign"}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          activeCampaignDetail.status === "active"
                            ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                            : "bg-amber-100 border-amber-300 text-amber-800"
                        }`}>
                          {activeCampaignDetail.status}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-ink mt-2">{activeCampaignDetail.campaign_name}</h2>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate font-mono">
                        <span className="font-bold text-ink">ID: {activeCampaignDetail.campaign_id}</span>
                        <span>•</span>
                        <span className="font-semibold text-brand">MODE: {(activeCampaignDetail.training_mode || "online").toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        onClick={() => {
                          const nextStatus = activeCampaignDetail.status === "active" ? "paused" : "active";
                          handleUpdateCampaign({ status: nextStatus });
                        }}
                        className={`py-2 px-3.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm ${
                          activeCampaignDetail.status === "active"
                            ? "bg-amber-100 border border-amber-300 text-amber-800 hover:bg-amber-200"
                            : "bg-emerald-100 border border-emerald-300 text-emerald-800 hover:bg-emerald-200"
                        }`}
                      >
                        {activeCampaignDetail.status === "active" ? (
                          <><PauseCircle className="w-4 h-4" /> Pause Campaign</>
                        ) : (
                          <><PlayCircle className="w-4 h-4" /> Activate Campaign</>
                        )}
                      </Button>

                      <a
                        href={getShareableFormUrl(activeCampaignDetail)}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3.5 bg-white border border-line text-ink hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 rounded-xl cursor-pointer shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-brand" />
                        Open Registration Page
                      </a>
                    </div>
                  </div>

                  {/* Shareable Link & Embed Tool Card */}
                  <div className="bg-gradient-to-br from-emerald-950/5 via-slate-50 to-brand/5 border border-brand/20 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-line pb-2">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-brand shrink-0" />
                        <h4 className="text-xs font-bold text-ink">Shareable Registration Form Link</h4>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        ✓ Connected to DB (Leads Auto-Saved)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={getShareableFormUrl(activeCampaignDetail)}
                        className="w-full px-3 py-2 border border-line rounded-xl text-xs font-mono bg-white text-slate-800 font-semibold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(getShareableFormUrl(activeCampaignDetail));
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 3000);
                        }}
                        className="px-3.5 py-2 bg-brand text-white hover:bg-brand/90 text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedLink ? "Copied Link!" : "Copy Link"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(getFormEmbedCode(activeCampaignDetail));
                          setCopiedEmbed(true);
                          setTimeout(() => setCopiedEmbed(false), 3000);
                        }}
                        className="px-3.5 py-2 bg-white border border-line text-ink hover:bg-slate-50 text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                      >
                        {copiedEmbed ? <Check className="w-3.5 h-3.5 text-brand" /> : <Code className="w-3.5 h-3.5" />}
                        {copiedEmbed ? "Copied Embed!" : "Copy Embed Code"}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate leading-relaxed">
                      Share this direct form link or embed code anywhere. Student registrations are saved to the database under Campaign ID <strong className="text-brand font-mono">{activeCampaignDetail.campaign_id}</strong> and trigger configured Telegram & Teams notifications.
                    </p>
                  </div>

                  {/* Campaign Real Analytics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
                    <div className="bg-surface p-3.5 rounded-2xl border border-line">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Total Leads</p>
                      <p className="text-2xl font-black text-ink">{activeCampaignDetail.analytics?.total_leads || 0}</p>
                    </div>

                    <div className="bg-surface p-3.5 rounded-2xl border border-line">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate">New Leads</p>
                      <p className="text-2xl font-black text-amber-600">{activeCampaignDetail.analytics?.new_leads || 0}</p>
                    </div>

                    <div className="bg-surface p-3.5 rounded-2xl border border-line">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Contacted</p>
                      <p className="text-2xl font-black text-sky-600">{activeCampaignDetail.analytics?.contacted_leads || 0}</p>
                    </div>

                    <div className="bg-surface p-3.5 rounded-2xl border border-line">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Converted</p>
                      <p className="text-2xl font-black text-emerald-600">{activeCampaignDetail.analytics?.converted_leads || 0}</p>
                    </div>

                    <div className="bg-surface p-3.5 rounded-2xl border border-line">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Conversion Rate</p>
                      <p className="text-2xl font-black text-brand">{activeCampaignDetail.analytics?.conversion_rate || 0}%</p>
                    </div>
                  </div>
                </div>

                {/* Campaign Analytics & Source Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Traffic Sources Card */}
                  <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate flex items-center gap-2">
                      <Globe className="w-4 h-4 text-brand" />
                      Lead Traffic Sources
                    </h3>

                    {activeCampaignDetail.analytics?.sources && activeCampaignDetail.analytics.sources.length > 0 ? (
                      <div className="space-y-3">
                        {activeCampaignDetail.analytics.sources.map((src: any, idx: number) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-ink">{src.name}</span>
                              <span className="text-slate">{src.count} ({src.percentage}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-surface overflow-hidden border border-line">
                              <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${src.percentage}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 border border-dashed border-line rounded-2xl text-center text-xs text-slate italic">
                        No UTM source data recorded yet.
                      </div>
                    )}
                  </div>

                  {/* Notification Channels Card */}
                  <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4 col-span-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate flex items-center gap-2">
                      <Send className="w-4 h-4 text-brand" />
                      Lead Notification Dispatch Channels
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Telegram Settings */}
                      <div className="p-4 rounded-2xl border border-line bg-surface space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">💬</div>
                            <div>
                              <p className="text-xs font-bold text-ink">Telegram Bot Alert</p>
                              <p className="text-[10px] text-slate">Instant channel broadcast</p>
                            </div>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={telegramOn}
                              onChange={(e) => {
                                setTelegramOn(e.target.checked);
                                handleUpdateCampaign({ telegram_enabled: e.target.checked });
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                          </label>
                        </div>
                        <p className="text-[11px] text-slate leading-relaxed">
                          Status: <span className="font-bold text-emerald-600">{telegramOn ? "ACTIVE" : "DISABLED"}</span> (Uses TELEGRAM_BOT_TOKEN)
                        </p>
                      </div>

                      {/* MS Teams Settings */}
                      <div className="p-4 rounded-2xl border border-line bg-surface space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">📢</div>
                            <div>
                              <p className="text-xs font-bold text-ink">Microsoft Teams Alert</p>
                              <p className="text-[10px] text-slate">Channel Webhook Card</p>
                            </div>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={teamsOn}
                              onChange={(e) => {
                                setTeamsOn(e.target.checked);
                                handleUpdateCampaign({ teams_enabled: e.target.checked });
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                          </label>
                        </div>
                        <p className="text-[11px] text-slate leading-relaxed">
                          Status: <span className="font-bold text-emerald-600">{teamsOn ? "ACTIVE" : "DISABLED"}</span> (Uses TEAMS_WEBHOOK_URL)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Leads Table */}
                <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                        <Users className="w-4 h-4 text-brand" />
                        Campaign Leads ({activeCampaignDetail.leads?.length || 0})
                      </h3>
                      <p className="text-[10px] text-slate mt-0.5">
                        Registrations captured specifically through this campaign.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search lead name/phone..."
                          value={leadSearchQuery}
                          onChange={(e) => setLeadSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                    </div>
                  </div>

                  {activeCampaignDetail.leads && activeCampaignDetail.leads.length > 0 ? (
                    <div className="overflow-x-auto border border-line rounded-2xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-surface border-b border-line text-slate uppercase text-[10px] font-bold tracking-wider">
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Contact Details</th>
                            <th className="p-3">Profession / College</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Lead Status</th>
                            <th className="p-3">Registered At</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeCampaignDetail.leads
                            .filter((l: Lead) =>
                              l.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
                              l.phone.includes(leadSearchQuery) ||
                              l.email.toLowerCase().includes(leadSearchQuery.toLowerCase())
                            )
                            .map((l: Lead) => (
                              <tr key={l.id} className="border-b border-line/60 hover:bg-surface/50 transition-colors">
                                <td className="p-3 font-bold text-ink">
                                  {l.name}
                                </td>
                                <td className="p-3">
                                  <div className="font-semibold text-ink">{l.phone}</div>
                                  <div className="text-[10px] text-slate">{l.email}</div>
                                </td>
                                <td className="p-3 font-medium text-slate">
                                  {l.current_profession || l.college_name || "N/A"}
                                </td>
                                <td className="p-3 font-medium text-slate">
                                  {l.location || "N/A"}
                                </td>
                                <td className="p-3">
                                  <select
                                    value={l.status}
                                    onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                                    className="border border-line rounded-lg text-[10px] font-bold px-2 py-1 bg-white focus:outline-none"
                                  >
                                    <option value="new">🆕 New</option>
                                    <option value="contacted">📞 Contacted</option>
                                    <option value="interested">⭐ Interested</option>
                                    <option value="follow_up">⏳ Follow-up</option>
                                    <option value="qualified">✅ Qualified</option>
                                    <option value="converted">🎓 Converted</option>
                                    <option value="rejected">❌ Not Interested</option>
                                  </select>
                                </td>
                                <td className="p-3 text-[10px] text-slate font-medium">
                                  {new Date(l.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => setSelectedLead(l)}
                                    className="px-2.5 py-1 border border-line rounded-lg text-[11px] font-bold text-brand hover:bg-brand/10 transition-colors cursor-pointer"
                                  >
                                    Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed border-line rounded-2xl text-center text-xs text-slate italic">
                      No registrations recorded for this campaign yet. Once someone submits the registration form, their lead will appear here.
                    </div>
                  )}
                </div>

                {/* Form Editor & Dynamic Preview Section (Fixes Nested Scrollbar!) */}
                <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                        <FileCode2 className="w-4 h-4 text-brand" />
                        Campaign Registration Form Config
                      </h3>
                      <p className="text-[10px] text-slate mt-0.5">
                        Customize or preview the registration HTML form for this campaign.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={generateStarterTemplate}
                      className="py-1.5 px-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/20 text-[11px] font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                      title="Generate a ready-to-use styled registration form for this campaign"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Template
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-surface p-0.5 rounded-xl border border-line">
                        <button
                          type="button"
                          onClick={() => setPreviewTab("editor")}
                          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                            previewTab === "editor" ? "bg-white text-ink shadow-sm" : "text-slate"
                          }`}
                        >
                          Code Editor
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTab("preview")}
                          className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                            previewTab === "preview" ? "bg-white text-ink shadow-sm" : "text-slate"
                          }`}
                        >
                          Live Preview
                        </button>
                      </div>

                      {previewTab === "preview" && (
                        <div className="flex items-center bg-surface p-0.5 rounded-xl border border-line">
                          <button
                            type="button"
                            onClick={() => setPreviewDevice("desktop")}
                            className={`p-1.5 rounded-lg transition-all ${previewDevice === "desktop" ? "bg-white text-brand shadow-sm" : "text-slate"}`}
                            title="Desktop View"
                          >
                            <Monitor className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewDevice("tablet")}
                            className={`p-1.5 rounded-lg transition-all ${previewDevice === "tablet" ? "bg-white text-brand shadow-sm" : "text-slate"}`}
                            title="Tablet View"
                          >
                            <Tablet className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewDevice("mobile")}
                            className={`p-1.5 rounded-lg transition-all ${previewDevice === "mobile" ? "bg-white text-brand shadow-sm" : "text-slate"}`}
                            title="Mobile View"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {previewTab === "editor" ? (
                    <div className="space-y-3">
                      <textarea
                        value={customFormHtml}
                        onChange={(e) => setCustomFormHtml(e.target.value)}
                        placeholder="Paste registration form HTML..."
                        rows={16}
                        className="w-full px-4 py-3 border border-line rounded-2xl text-xs font-mono bg-slate-950 text-green-300 resize-y focus:outline-none focus:ring-2 focus:ring-brand/20"
                        spellCheck={false}
                      />
                      <div className="flex items-center gap-3 flex-wrap">
                        <Button
                          onClick={() => handleUpdateCampaign({ registration_form_html: customFormHtml })}
                          className="py-2 px-4 bg-brand text-white hover:bg-brand/90 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Check className="w-4 h-4" /> Save Form HTML Changes
                        </Button>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(customFormHtml);
                            setCopiedFormHtml(true);
                            setTimeout(() => setCopiedFormHtml(false), 3000);
                          }}
                          className="py-2 px-4 bg-white border border-line text-ink hover:bg-slate-50 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                        >
                          {copiedFormHtml ? <Check className="w-3.5 h-3.5 text-brand" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedFormHtml ? "Copied Form HTML!" : "Copy Integrated Form HTML"}
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyAiPromptTemplate}
                          className="py-2 px-4 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                        >
                          {copiedPrompt ? <Check className="w-3.5 h-3.5 text-white" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />}
                          {copiedPrompt ? "Copied Instruction!" : "Copy Instruction to AI"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* DYNAMIC HEIGHT FORM PREVIEW (SAFE PREVIEW MODE) */
                    <div className="space-y-3">
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-900 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Preview Mode Active</span>
                        </span>
                        <span className="text-[10px] text-amber-700 font-medium">Test submissions in preview will not alter production lead counts</span>
                      </div>

                      <div className="flex justify-center bg-slate-950/5 p-4 rounded-3xl border border-line">
                        <div
                          className="transition-all duration-300 bg-white rounded-2xl shadow-medium border border-line overflow-hidden"
                          style={{
                            width: previewDevice === "mobile" ? "375px" : previewDevice === "tablet" ? "768px" : "100%",
                          }}
                        >
                          {customFormHtml ? (
                            <iframe
                              srcDoc={customFormHtml + `
                                <script>
                                  document.addEventListener('submit', function(e) {
                                    e.preventDefault();
                                    alert('Preview Mode: Form submission simulated successfully! No test lead was saved to database.');
                                    return false;
                                  }, true);
                                </script>
                              `}
                              sandbox="allow-scripts allow-forms allow-same-origin"
                              className="w-full border-0"
                              style={{ height: `${iframeHeight}px` }}
                              onLoad={(e) => {
                                try {
                                  const iframe = e.currentTarget;
                                  if (iframe.contentWindow?.document?.body) {
                                    const h = iframe.contentWindow.document.body.scrollHeight;
                                    setIframeHeight(Math.max(h + 60, 750));
                                  }
                                } catch (err) {
                                  setIframeHeight(850);
                                }
                              }}
                              title="Registration Form Full Height Preview"
                            />
                          ) : (
                            <div className="p-12 text-center text-xs text-slate italic">
                              No HTML form content available for this campaign.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* LEAD DETAIL MODAL / DRAWER */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-line rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand" />
                  Lead Full Profile & Attribution
                </h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 rounded-lg text-slate hover:text-ink hover:bg-surface cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-surface p-4 rounded-2xl border border-line">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate block">Student Name</span>
                    <span className="font-bold text-ink text-sm">{selectedLead.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate block">Current Status</span>
                    <span className="font-bold text-emerald-600 text-sm uppercase">{selectedLead.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate block">Phone</span>
                    <span className="font-semibold text-ink">{selectedLead.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate block">Email</span>
                    <span className="font-semibold text-ink">{selectedLead.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase text-slate tracking-wider">Academic & Professional Details</h4>
                  <div className="p-3 rounded-xl border border-line space-y-1 bg-white">
                    <p><span className="font-bold text-slate">Profession:</span> {selectedLead.current_profession || "N/A"}</p>
                    <p><span className="font-bold text-slate">Company / College:</span> {selectedLead.organization || selectedLead.college_name || "N/A"}</p>
                    <p><span className="font-bold text-slate">Location / District:</span> {selectedLead.location || "N/A"}</p>
                    {selectedLead.message && (
                      <div className="pt-2 border-t border-line mt-2">
                        <span className="font-bold text-slate block mb-0.5">Message:</span>
                        <p className="italic text-slate-700 bg-surface p-2 rounded-lg">{selectedLead.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase text-slate tracking-wider">Marketing Attribution (UTMs)</h4>
                  <div className="p-3 rounded-xl border border-line space-y-1 bg-surface font-mono text-[11px]">
                    <p><span className="font-bold text-slate">UTM Source:</span> {selectedLead.utm_source || "direct"}</p>
                    <p><span className="font-bold text-slate">UTM Medium:</span> {selectedLead.utm_medium || "none"}</p>
                    <p><span className="font-bold text-slate">UTM Campaign:</span> {selectedLead.utm_campaign || "none"}</p>
                    <p><span className="font-bold text-slate">Landing Page:</span> {selectedLead.landing_page || "N/A"}</p>
                    <p><span className="font-bold text-slate">Referrer:</span> {selectedLead.referrer || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-line text-right">
                <Button
                  onClick={() => setSelectedLead(null)}
                  className="py-2 px-4 bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE CAMPAIGN MODAL FLOW */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-line rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h3 className="text-base font-bold text-ink flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-brand" />
                    Create New Marketing Campaign
                  </h3>
                  <p className="text-[10px] text-slate mt-0.5">
                    Step {createStep} of 2 — {createStep === 1 ? "Campaign Details" : "Registration Form Setup"}
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate hover:text-ink hover:bg-surface cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {createStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Campaign Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Artificial Intelligence — August 2026"
                      value={newCampName}
                      onChange={(e) => setNewCampName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Course Program *</label>
                      <select
                        value={newCourseId}
                        onChange={(e) => setNewCourseId(e.target.value)}
                        className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface focus:outline-none font-semibold"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Campaign ID (Auto-Generated)</label>
                      <input
                        type="text"
                        readOnly
                        value={getAutoGeneratedIdPreview()}
                        className="w-full px-3.5 py-2 border border-line rounded-xl text-xs font-mono bg-slate-100 text-slate-600 font-bold select-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Training Mode * (Defaults to Online)</label>
                      <select
                        value={newTrainingMode}
                        onChange={(e) => setNewTrainingMode(e.target.value)}
                        className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface focus:outline-none font-semibold"
                      >
                        <option value="online">Online</option>
                        <option value="one_to_one">One-to-One</option>
                        <option value="college">College</option>
                        <option value="corporate">Corporate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Initial Status</label>
                      <select
                        value={newStatus}
                        onChange={(e: any) => setNewStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface focus:outline-none font-semibold"
                      >
                        <option value="active">Active (Capturing Leads)</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line flex justify-end">
                    <Button
                      onClick={() => {
                        if (!newCampName.trim()) {
                          alert("Please enter a Campaign Name.");
                          return;
                        }
                        setCreateStep(2);
                      }}
                      className="py-2.5 px-5 bg-brand text-white hover:bg-brand/90 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      Next: Registration Form →
                    </Button>
                  </div>
                </div>
              )}

              {createStep === 2 && (
                <div className="space-y-6">
                  {/* Option Selection: Option A (New) vs Option B (Existing) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setFormChoice("new")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formChoice === "new" ? "border-brand bg-brand/5 shadow-soft" : "border-line bg-surface hover:bg-slate-100/50"
                      }`}
                    >
                      <p className="text-xs font-bold text-ink mb-1">OPTION A: Create New Form</p>
                      <p className="text-[11px] text-slate leading-relaxed">
                        Design a custom registration form HTML using AI prompt template.
                      </p>
                    </div>

                    <div
                      onClick={() => setFormChoice("existing")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formChoice === "existing" ? "border-brand bg-brand/5 shadow-soft" : "border-line bg-surface hover:bg-slate-100/50"
                      }`}
                    >
                      <p className="text-xs font-bold text-ink mb-1">OPTION B: Use Previous Form</p>
                      <p className="text-[11px] text-slate leading-relaxed">
                        Select from your saved form library for this course.
                      </p>
                    </div>
                  </div>

                  {/* 1. PREMIUM FORM INTEGRATION GUIDE SECTION */}
                  <div className="bg-gradient-to-br from-emerald-950/5 via-slate-50 to-teal-900/5 border border-emerald-500/20 rounded-3xl p-5 md:p-6 space-y-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4 border-b border-emerald-500/15 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                          <h4 className="text-sm font-bold text-ink font-display">Registration Form Integration Guide</h4>
                        </div>
                        <p className="text-xs text-slate mt-1 leading-relaxed">
                          Your AI-generated form will be displayed on the campaign page. To automatically capture registrations, the form must follow the KVJ Analytics registration integration requirements below.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleCopyIntegrationReqs}
                          className="px-3 py-1.5 bg-white border border-emerald-500/30 text-emerald-700 hover:bg-emerald-50 text-[11px] font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                        >
                          {copiedReqs ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedReqs ? "Copied Requirements!" : "Copy Requirements"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyAiPromptTemplate}
                          className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                        >
                          {copiedPrompt ? <Check className="w-3.5 h-3.5 text-white" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                          {copiedPrompt ? "Copied AI Prompt!" : "Copy AI Prompt"}
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Campaign Context Card */}
                    <div className="bg-white border border-emerald-500/20 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shadow-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate block tracking-wider">Campaign</span>
                        <span className="font-bold text-ink truncate block">{newCampName || "New Campaign"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate block tracking-wider">Campaign ID</span>
                        <span className="font-mono text-emerald-700 font-bold block">{getAutoGeneratedIdPreview()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate block tracking-wider">Course Program</span>
                        <span className="font-bold text-ink truncate block">
                          {courses.find((c) => c.id === newCourseId)?.title || "Selected Course"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate block tracking-wider">Training Mode</span>
                        <span className="font-bold text-emerald-700 block uppercase">Online</span>
                      </div>
                    </div>

                    {/* 2. Checklist: Your HTML Form Must Include */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-ink flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        Your HTML form must include:
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-line">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>KVJ Analytics form identifier (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">data-kvj-form="registration"</code>)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-line">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Campaign identification (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">campaign_id</code>)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-line">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Course identification (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">course_id</code>)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-line">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Training mode (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">training_mode</code> = online)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-line">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Required lead fields (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">name</code>, <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">email</code>, <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">phone</code>)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-line">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Secure submission endpoint (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">/api/register</code>)</span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Visual Data Flow Diagram */}
                    <div className="p-4 bg-white rounded-2xl border border-emerald-500/20 space-y-3">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate">How Registration Data Flows</h5>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-700 py-1 px-2 bg-surface rounded-xl border border-line">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-brand" /> Student</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="flex items-center gap-1"><FileCode2 className="w-3.5 h-3.5 text-brand" /> Form</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="flex items-center gap-1"><Send className="w-3.5 h-3.5 text-brand" /> /api/register</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="flex items-center gap-1"><Megaphone className="w-3.5 h-3.5 text-brand" /> Campaign</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5 text-brand" /> Database Lead</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-brand" /> Telegram / Teams</span>
                      </div>
                      <p className="text-[11px] text-slate leading-relaxed">
                        When a student submits the form, the registration is sent to the KVJ Analytics registration endpoint. The system associates the lead with this campaign and course, stores the submission, updates the campaign lead count, and triggers configured notifications.
                      </p>
                    </div>

                    {/* Accordion 1: Required Integration Structure */}
                    <div className="border border-line rounded-2xl bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowStructureAccordion(!showStructureAccordion)}
                        className="w-full p-3.5 text-left font-bold text-xs text-ink flex items-center justify-between hover:bg-surface transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-emerald-600" />
                          Required Integration Structure
                        </span>
                        {showStructureAccordion ? <ChevronUp className="w-4 h-4 text-slate" /> : <ChevronDown className="w-4 h-4 text-slate" />}
                      </button>
                      {showStructureAccordion && (
                        <div className="p-4 border-t border-line bg-slate-950 text-emerald-300 font-mono text-[11px] space-y-3">
                          <pre className="overflow-x-auto whitespace-pre leading-relaxed">{`<form
  data-kvj-form="registration"
  data-kvj-endpoint="/api/register"
  data-kvj-course="${courses.find((c) => c.id === newCourseId)?.id || "COURSE_ID"}"
  action="/api/register"
  method="POST"
>
  <!-- Campaign Context (Dynamically Injected) -->
  <input type="hidden" name="campaign_id" value="${getAutoGeneratedIdPreview()}">
  <input type="hidden" name="course_id" value="${courses.find((c) => c.id === newCourseId)?.id || "COURSE_ID"}">
  <input type="hidden" name="training_mode" value="online">

  <!-- Required Lead Information -->
  <input type="text" name="name" placeholder="Full Name" required>
  <input type="email" name="email" placeholder="Email Address" required>
  <input type="tel" name="phone" placeholder="Phone Number" required>

  <!-- Optional Fields -->
  <input type="text" name="location" placeholder="District / City">

  <button type="submit">Submit Registration</button>
</form>`}</pre>
                          <p className="text-[10px] text-slate-400 font-body leading-relaxed pt-2 border-t border-slate-800">
                            Do not remove or rename the KVJ Analytics integration attributes or hidden campaign/course fields. These values allow the system to associate each registration with the correct campaign.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Accordion 2: Lead Information */}
                    <div className="border border-line rounded-2xl bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowFieldsAccordion(!showFieldsAccordion)}
                        className="w-full p-3.5 text-left font-bold text-xs text-ink flex items-center justify-between hover:bg-surface transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-600" />
                          Lead Information Fields
                        </span>
                        {showFieldsAccordion ? <ChevronUp className="w-4 h-4 text-slate" /> : <ChevronDown className="w-4 h-4 text-slate" />}
                      </button>
                      {showFieldsAccordion && (
                        <div className="p-4 border-t border-line text-xs space-y-3 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1 bg-emerald-50/50 p-3 rounded-xl border border-emerald-500/20">
                              <span className="font-bold text-emerald-800 block text-[11px] uppercase tracking-wider">Required Fields</span>
                              <ul className="space-y-1 text-slate-700 font-medium">
                                <li>• Full Name (<code className="text-[10px] bg-white px-1 py-0.5 rounded border border-line">name="name"</code>)</li>
                                <li>• Email Address (<code className="text-[10px] bg-white px-1 py-0.5 rounded border border-line">name="email"</code>)</li>
                                <li>• Phone Number (<code className="text-[10px] bg-white px-1 py-0.5 rounded border border-line">name="phone"</code>)</li>
                                <li>• Current Status / Profession (<code className="text-[10px] bg-white px-1 py-0.5 rounded border border-line">name="status"</code>)</li>
                                <li>• Country (<code className="text-[10px] bg-white px-1 py-0.5 rounded border border-line">name="country"</code>)</li>
                              </ul>
                            </div>

                            <div className="space-y-1 bg-surface p-3 rounded-xl border border-line">
                              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Optional Fields</span>
                              <ul className="space-y-1 text-slate-600 font-medium">
                                <li>• Age (<code className="text-[10px] bg-white px-1 py-0.5 rounded border border-line">name="age"</code>)</li>
                                <li>• District / City (<code className="text-[10px] bg-white px-1 py-0.5 rounded border border-line">name="location"</code>)</li>
                                <li>• Message / Questions (<code className="text-[10px] bg-white px-1 py-0.5 rounded border border-line">name="message"</code>)</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Accordion 3: AI Form Generation Rules */}
                    <div className="border border-line rounded-2xl bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowAiRulesAccordion(!showAiRulesAccordion)}
                        className="w-full p-3.5 text-left font-bold text-xs text-ink flex items-center justify-between hover:bg-surface transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          Important When Generating Your Form With AI
                        </span>
                        {showAiRulesAccordion ? <ChevronUp className="w-4 h-4 text-slate" /> : <ChevronDown className="w-4 h-4 text-slate" />}
                      </button>
                      {showAiRulesAccordion && (
                        <div className="p-4 border-t border-line text-xs space-y-2 bg-white">
                          <ol className="list-decimal list-inside space-y-1.5 text-slate font-medium leading-relaxed">
                            <li>Keep the KVJ Analytics form integration attributes (<code className="text-[10px] bg-surface px-1 py-0.5 rounded">data-kvj-form="registration"</code>).</li>
                            <li>Keep campaign and course identification fields (<code className="text-[10px] bg-surface px-1 py-0.5 rounded">campaign_id</code>, <code className="text-[10px] bg-surface px-1 py-0.5 rounded">course_id</code>).</li>
                            <li>Do not replace the registration endpoint (<code className="text-[10px] bg-surface px-1 py-0.5 rounded">/api/register</code>) with another URL.</li>
                            <li>Do not remove required field names (<code className="text-[10px] bg-surface px-1 py-0.5 rounded">name</code>, <code className="text-[10px] bg-surface px-1 py-0.5 rounded">email</code>, <code className="text-[10px] bg-surface px-1 py-0.5 rounded">phone</code>).</li>
                            <li>Keep form submission JavaScript functional.</li>
                            <li>Do not add external APIs or third-party submission services.</li>
                            <li>The final HTML must submit data to the KVJ Analytics registration system.</li>
                          </ol>
                        </div>
                      )}
                    </div>

                    {/* 11. Important Security Requirement Notice */}
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Security Notice: </span>
                        Never place database credentials, API keys, bot tokens, webhook secrets, or other private credentials inside your registration HTML. The browser-facing form should only communicate with the approved backend registration endpoint (<code className="text-[10px] font-mono bg-amber-100 px-1 py-0.5 rounded">/api/register</code>).
                      </div>
                    </div>
                  </div>

                  {/* Option Content: Option A (HTML Editor) vs Option B (Form Selection) */}
                  {formChoice === "existing" ? (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-ink">Select Existing Form From Library</label>
                      {savedForms.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {savedForms.map((f) => (
                            <div
                              key={f.id}
                              onClick={() => {
                                setSelectedFormId(f.id);
                                setCustomFormHtml(f.html_content);
                              }}
                              className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-center justify-between ${
                                selectedFormId === f.id ? "border-brand bg-brand/10 font-bold" : "border-line bg-white hover:bg-surface"
                              }`}
                            >
                              <span>{f.name}</span>
                              <span className="text-[10px] text-slate">
                                Created {new Date(f.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate italic p-3 border border-dashed border-line rounded-xl">
                          No previously saved forms available. Switch to Option A to paste HTML.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-ink">Registration Form HTML Code</label>
                        <span className="text-[10px] text-slate font-mono">Accepts full HTML/JS/CSS form structure</span>
                      </div>
                      <textarea
                        value={customFormHtml}
                        onChange={(e) => setCustomFormHtml(e.target.value)}
                        placeholder="Paste form HTML code here..."
                        rows={10}
                        className="w-full px-4 py-3 border border-line rounded-2xl text-xs font-mono bg-slate-950 text-green-300 resize-y focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-inner"
                        spellCheck={false}
                      />
                    </div>
                  )}

                  {/* 9. AUTOMATIC REAL-TIME HTML FORM INTEGRATION STATUS */}
                  {formChoice === "new" && (
                    <div className="p-4 rounded-2xl border bg-white space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-line pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Form Integration Status
                        </span>
                        {validationStatus.isValid ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            ✓ Ready to connect with campaign
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                            ⚠ Action Required Before Launch
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${validationStatus.hasIdentifier ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-line text-slate-500"}`}>
                          {validationStatus.hasIdentifier ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                          <span>Form Identifier</span>
                        </div>
                        <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${validationStatus.hasEndpoint ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-line text-slate-500"}`}>
                          {validationStatus.hasEndpoint ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                          <span>/api/register Endpoint</span>
                        </div>
                        <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${validationStatus.hasNameField ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-line text-slate-500"}`}>
                          {validationStatus.hasNameField ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                          <span>Full Name Field</span>
                        </div>
                        <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${validationStatus.hasEmailField ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-line text-slate-500"}`}>
                          {validationStatus.hasEmailField ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                          <span>Email Field</span>
                        </div>
                        <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${validationStatus.hasPhoneField ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-line text-slate-500"}`}>
                          {validationStatus.hasPhoneField ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                          <span>Phone Field</span>
                        </div>
                      </div>

                      {!validationStatus.isValid && validationStatus.missingItems.length > 0 && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
                          <span className="font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Please resolve missing elements before launching:
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 font-medium pl-1">
                            {validationStatus.missingItems.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Save & Back Buttons */}
                  <div className="pt-4 border-t border-line flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCreateStep(1)}
                      className="text-xs font-bold text-slate hover:text-ink cursor-pointer"
                    >
                      ← Back to Details
                    </button>

                    <div className="flex items-center gap-3">
                      {formChoice === "new" && !validationStatus.isValid && customFormHtml.trim() && (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                          Fix form errors to enable launch
                        </span>
                      )}

                      <Button
                        onClick={handleCreateCampaignSubmit}
                        disabled={savingCampaign || (formChoice === "new" && !validationStatus.isValid)}
                        className={`py-2.5 px-6 text-xs font-bold flex items-center gap-2 transition-all ${
                          formChoice === "new" && !validationStatus.isValid
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed border-0"
                            : "bg-brand text-white hover:bg-brand/90 cursor-pointer shadow-md"
                        }`}
                      >
                        {savingCampaign ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <><Check className="w-4 h-4" /> Save & Launch Campaign</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
