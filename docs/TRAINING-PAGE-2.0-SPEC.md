# Training Page 2.0 — Navigation & UI Specification

**Status**: Planned / Documented for Discussion  
**Version**: 2.0  
**Scope**: Training Hub (`/training`) and Subpages (`/training/*`)

---

## 1. Core Strategic Direction
* **Showcase & Lead Generation Model**: Present the comprehensive list of courses and programs available at KVJ Analytics. Direct self-serve e-commerce checkout (Razorpay) is deferred for now, but the underlying architecture remains modular for future enablement.
* **Pricing Visibility**: "Contact for Fee & Schedule" (no hardcoded pricing or offer countdown timers).
* **Delivery Mode**: No delivery mode badges or selectors shown on public cards.
* **Inquiry Actions**: Dual-channel contact flow offering **both** a Quick Inquiry Form Modal and a Direct WhatsApp link (plus telephone support).

---

## 2. Navigation Architecture

### A. Global Header Navigation (`Header.tsx`)
Desktop dropdown & mobile drawer under **Training**:
1. **All Courses & Programs** (`/training/courses` or `/training/online-courses`)
2. **Corporate Training** (`/training/corporate`)
3. **College Programs** (`/training/colleges`)
4. **1-on-1 Mentoring** (`/training/one-to-one`)
5. **Internships** (`/training/internships`)

### B. In-Page Sticky Sub-Navigation Bar
A sticky pill/tab bar persistent across `/training` and all subpages:
`[ Overview | All Courses | Corporate Training | College Programs | 1-on-1 Mentoring | Internships ]`

---

## 3. Page Layout & Content Specifications

### A. Training Hub (`/training`)

#### 1. Hero Section
* **Badge / Eyebrow**: `PRACTICAL LEARNING WITH INDUSTRY RELEVANCE`
* **Main Headline**: `Master In-Demand Analytics & Automation Skills`
*(Subheading removed as requested)*
* **Key Highlights / Trust Badges**:
  * 16+ Years Industry Experience
  * 100% Hands-On Practical Projects
  * Industry-Recognized Certification
*(Dedicated Mentorship & Support removed as requested)*
* **Call to Actions**:
  * **[ Browse Available Courses ]**
  * **[ Talk to a Course Advisor ]** (Opens Quick Inquiry Modal)
  * **[ WhatsApp Us ]** (Direct WhatsApp connect)

#### 2. Training Pathways (5 Category Tracks)
* **Available Courses**: Professional curriculum in Power BI, Advanced Excel, MIS Automation, and Data Analytics.
* **Corporate Training**: Custom team workshops, report automation, and workflow optimization.
* **Colleges & Academies**: Value-added certification courses and curriculum integration.
* **1-on-1 Mentoring**: Focused individual sessions tailored for specific career transitions.
* **Internships**: Hands-on project exposure working on simulated corporate datasets.

#### 3. Available Courses Showcase
Each card displays:
* Course Title & Tool Badges (Excel, Power BI, SQL, Python)
* Duration (e.g., 6 Weeks / 8 Weeks / 12 Weeks)
* Pricing Tag: **Contact for Fee & Schedule**
* Summary of learning outcomes
* Primary Actions: **[ Inquire to Enroll ]** (Modal) and **[ View Syllabus ]** (Detail Page)

#### 4. The 7-Stage Learning Methodology
1. **01. Business Challenge**: Formulating real corporate questions.
2. **02. Data Gathering**: Ingesting raw transactional and ERP feeds.
3. **03. Data Engineering**: Cleaning anomalies and query structuring.
4. **04. Advanced Analytics**: Modeling and DAX/formula logic.
5. **05. Interactive Dashboards**: High-density executive KPI reporting.
6. **06. Process Automation**: Scheduled reports eliminating manual loops.
7. **07. Career & Business Readiness**: Verified certification and portfolio.

#### 5. Integrated Learning Ecosystem
* Applied Real-World Business Datasets
* Structured Module Assignments
* Mock Evaluation Assessments
* Verifiable Certificate of Completion

#### 6. Bottom Inquiry CTA
* **Heading**: `Looking for the Right Program for Your Career or Team?`
* **Actions**: **[ Submit an Inquiry ]** | **[ WhatsApp Us: 9961813730 ]** | **[ Call: 0484-4059310 ]**

---

### B. Course Detail Page (`/training/[slug]`)
* **Main Column**:
  * In-depth course overview and career relevance
  * Practical skills breakdown
  * Curriculum accordion (Modules, topics, practice files)
  * Capstone project details
  * FAQ section
* **Sticky Action Sidebar**:
  * **Fee Note**: `Contact for Fee & Upcoming Batch Schedule`
  * **Duration**: e.g., 6 Weeks / 8 Weeks
  * **Action 1**: **"Inquire to Enroll"** (Opens modal with course pre-selected)
  * **Action 2**: **"Chat on WhatsApp"** (Prefilled message with course title)
  * **Action 3**: Direct telephone inquiry link

---

### C. Quick Inquiry Modal Flow
* **Fields**:
  * Full Name
  * Phone Number / WhatsApp
  * Email Address
  * Selected Course / Area of Interest
  * Optional Message / Query
* **Submission Behavior**:
  * Records entry in Supabase `inquiries` table
  * Instant confirmation screen
  * 1-Click WhatsApp handoff button for immediate advisor chat
