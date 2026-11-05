// Founding year — change this ONE number if the company's start year differs.
// Everything that shows "N+ years of experience" derives from it, so it
// auto-increments every January without any manual edits.
export const FOUNDING_YEAR = 2010;
export const CURRENT_EXP_YEARS = new Date().getFullYear() - FOUNDING_YEAR;

export const FALLBACK_SITE_SETTINGS = {
  companyName: "KVJ Analytics",
  tagline: "Analytics • Automation • Training • Educational Technology",
  regionsServed: ["Kerala", "India", "UAE", "Oman", "USA", "Europe"],
  contactInfo: {
    email: "info@kvjanalytics.in",
    phones: ["+91 99618 13730", "+91 (0484) 4059310", "+91 79026 61012"],
    address:
      "3rd Floor, Lalan Towers, Banerji Road, High Court Jn., Cochin-682 031, Ernakulam, Kerala, India",
    gstNumber: "32BIDPK3118B1Z2",
  },
  navItems: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Corporate Solutions", href: "/corporate" },
    { label: "Educational Solutions", href: "/education" },
    { label: "Products", href: "/products" },
    { label: "Training", href: "/training" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  // Per-page ON/OFF. Set a value to false in the admin to hide that page from the
  // nav + footer AND block its route (middleware redirects it home). Home is always on.
  pageVisibility: {
    "/about": true,
    "/corporate": true,
    "/education": true,
    "/products": true,
    "/training": true,
    "/blog": true,
    "/contact": true,
  } as Record<string, boolean>,
  footerDescription:
    `KVJ Analytics is a leading analytics, automation, and training organization with ${CURRENT_EXP_YEARS}+ years of experience in delivering business-focused technology solutions and industry-oriented learning systems.`,
  footerTagline:
    "Empowering Businesses and Institutions Through Analytics, Automation & Practical Learning.",
  footerColumns: [
    {
      heading: "Corporate Solutions",
      links: [
        { label: "Report Automation", href: "/corporate/report-automation" },
        { label: "Dashboard Development", href: "/corporate/dashboard-development" },
        { label: "Data Visualization", href: "/corporate/data-visualization" },
        { label: "Process Automation", href: "/corporate/process-automation" },
        { label: "Corporate Training", href: "/corporate/corporate-training" },
      ],
    },
    {
      heading: "Educational Solutions",
      links: [
        { label: "Certification Programs", href: "/education/certification-programs" },
        { label: "Curriculum Development", href: "/education/curriculum-development" },
        { label: "GradeScope", href: "/products/grade-scope" },
        { label: "Protrix", href: "/products/protrix" },
        { label: "Skill Development Programs", href: "/training" },
      ],
    },
  ],
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Corporate Solutions", href: "/corporate" },
    { label: "Educational Solutions", href: "/education" },
    { label: "Products", href: "/products" },
    { label: "Training", href: "/training" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  // Social links: unverified platform homepages removed per Task 3.
  // Official company profile URLs pending stakeholder confirmation.
  socialLinks: [] as { platform: string; url: string }[],
};

// V3 HOME — Positioning: Analytics / AI / BI / Digital Transformation (NOT a training institute).
// Exact approved copy per docs/CONTENT-SPECS-V3.md §1. Card/step one-line bodies are intentionally
// left blank (not fabricated) — fill via /admin/content. Never add fake stats/clients/testimonials.
export const FALLBACK_HOME_PAGE = {
  hero: {
    badge: "Business Intelligence • Data Analytics • Artificial Intelligence • Digital Transformation",
    headline: "Transform Data Into Business Growth",
    supporting:
      "Helping organizations make smarter decisions through Business Intelligence, Artificial Intelligence, Automation and Digital Transformation.",
    description:
      `For over ${CURRENT_EXP_YEARS} years, KVJ Analytics has partnered with businesses, enterprises and educational institutions to build intelligent analytics platforms, automate reporting processes, modernize operations and enable data-driven decision making. We combine technology, strategy and innovation to create measurable business outcomes.`,
    primaryCta: { label: "Schedule a Consultation", href: "/contact?interest=Corporate+Consulting" },
    secondaryCta: { label: "Explore Corporate Solutions", href: "/corporate" },
  },
  trustedBy: {
    heading: "Trusted by Forward-Thinking Organizations",
    logos: ["MIM Kuttikkanam", "Christ College Autonomous", "SIMS"],
  },
  solutions: {
    heading: "Enterprise Solutions That Drive Business Growth",
    description:
      "We help organizations transform data into strategic assets through intelligent analytics, automation and enterprise technology solutions.",
    cards: [
      {
        title: "MIS & Report Automation",
        points: [
          "Multi-Source Data Pipelines",
          "ERP & Financial File Consolidation",
          "Human Error & Copy-Paste Elimination",
          "Custom Management Reporting"
        ],
        href: "/corporate/report-automation",
        ctaLabel: "Explore Report Automation"
      },
      {
        title: "Power BI & Executive Dashboards",
        points: [
          "Real-Time Operational Visibility",
          "Multi-Department KPI Monitoring",
          "Executive Drill-Down Analysis",
          "Lightweight, Maintainable Data Models"
        ],
        href: "/corporate/dashboard-development",
        ctaLabel: "Explore Dashboards"
      },
      {
        title: "Spreadsheet Consulting & Optimization",
        points: [
          "Complex Financial & MIS Modeling",
          "Formula Audit & Lag Recovery",
          "Data Validation & Integrity Protection",
          "Cost-Effective In-House Handoffs"
        ],
        href: "/corporate/spreadsheet-consulting",
        ctaLabel: "Explore Spreadsheet Consulting"
      },
      {
        title: "Institutional Analytics & Academic Platforms",
        points: [
          "GradeScope Academic Analytics",
          "Protrix Assessment Automation",
          "Accreditation & NAAC Data Readiness",
          "Practical Campus Analytics Labs"
        ],
        href: "/education",
        ctaLabel: "Explore Educational Solutions"
      }
    ],
    cta: { label: "Explore All Corporate Solutions", href: "/corporate" },
  },
  whyUs: {
    heading: "Turning Complex Data into Clear Decisions",
    cards: [
      {
        title: "Business Intelligence",
        body: "Transform disparate operational records into interactive executive dashboards and KPI telemetry that drive data-informed decisions.",
      },
      {
        title: "Automation",
        body: "Eliminate repetitive manual spreadsheet processing and reporting routines through resilient scheduled data pipelines and scripts.",
      },
      {
        title: "Artificial Intelligence",
        body: "Apply intelligent analytics models, anomaly detection, and predictive forecasting to uncover actionable operational patterns.",
      },
      {
        title: "Enterprise Platforms",
        body: "Deploy scalable, secure analytics architectures and centralized reporting portals integrated directly with your business systems.",
      },
      {
        title: "Custom Solutions",
        body: "Develop purpose-built spreadsheet models, reporting tools, and database connectors tailored to your exact operational workflows.",
      },
      {
        title: "Innovation",
        body: "Continuously modernize business reporting frameworks with emerging analytical standards and automated evaluation methodologies.",
      },
    ],
  },
  industries: {
    heading: "Solutions Built For Every Industry",
    items: ["Education", "Healthcare", "Manufacturing", "Retail", "Financial Services", "Startups", "SMEs", "Large Enterprises"],
  },
  approach: {
    heading: "A Proven Framework For Digital Transformation",
    // These 7 stages are what the animated pipeline on the Home page actually renders.
    // Titles are editable in the admin CMS; the live pipeline reads them by position.
    steps: [
      { no: "01", title: "Business Challenge", body: "" },
      { no: "02", title: "Data Collection", body: "" },
      { no: "03", title: "Data Engineering", body: "" },
      { no: "04", title: "Analytics", body: "" },
      { no: "05", title: "Visualization", body: "" },
      { no: "06", title: "Report Automation", body: "" },
      { no: "07", title: "Business Decisions", body: "" },
    ],
  },
  successStories: {
    heading: "Delivering Measurable Business Outcomes",
    // Outcome statements come from CMS/case studies — none hardcoded (no fabrication).
    items: [] as string[],
    cta: { label: "Explore Case Studies", href: "/impact" },
  },
  insights: {
    heading: "Insights That Drive Better Decisions",
    cta: { label: "Read All Insights", href: "/blog" },
  },
  finalCta: {
    title: "Ready to Transform Your Business?",
    // Draft description assembled from approved Home phrasing — editable in CMS.
    description:
      "Partner with KVJ Analytics to build intelligent analytics platforms, automate operations and enable data-driven decisions that create measurable business outcomes.",
    primaryCta: { label: "Request a Consultation", href: "/contact?interest=Corporate+Consulting" },
    secondaryCta: { label: "Explore Educational Solutions", href: "/education" },
  },
};

export const FALLBACK_TRAINING = {
  eyebrow: "Training & Academy",
  heading: "Training & Skill Development",
  strapline: "Practical Learning With Industry Relevance",
  intro:
    "Our programs are designed to build real-world skills through hands-on learning, live datasets, and practical assignments.",
  exploreLabel: "Explore Our Courses",
  trainingAreasTitle: "Training Areas",
  trainingAreas: [
    "Advanced Excel",
    "Power BI",
    "Data Analytics",
    "Dashboard Development",
    "Financial Analytics",
    "Automation Tools",
    "Business Intelligence",
  ],
  approachTitle: "Our Approach",
  approach: [
    "Hands-On Learning",
    "Real Business Scenarios",
    "Industry-Oriented Curriculum",
    "Assignment-Based Practice",
    "Placement-Focused Skill Development",
  ],
  coursesEyebrow: "Active Programs",
  coursesHeading: "Explore Our Courses",
};

export const FALLBACK_TRAINING_HUB = {
  eyebrow: "Training Hub",
  headingLead: "Training",
  headingAccent: "Programs",
  intro:
    "Select a learning pathway tailored for personal excellence, academic growth, or corporate optimization.",
  cta: {
    title: "Start Your Learning Journey",
    description:
      "Practical, placement-focused training in Advanced Excel, Power BI, Data Analytics, dashboards and automation. Explore a program and begin building career-ready skills with KVJ Analytics.",
    primaryCtaText: "Explore Courses",
    primaryCtaHref: "/training/online-courses",
    secondaryCtaText: "Contact a Training Advisor",
    secondaryCtaHref: "/contact",
  },
  // "The Learning Journey" curriculum-flow timeline (icons = lucide names).
  journey: {
    eyebrow: "Curriculum Flow",
    heading: "The Learning Journey",
    subtext: "Our structured approach translates absolute beginners into industry-ready data specialists.",
    stages: [
      { step: "01", name: "Business Challenge", desc: "Translate complex corporate problems into structured analytical frameworks.", icon: "AlertCircle" },
      { step: "02", name: "Data Collection", desc: "Aggregate ERP database outputs, CRM tables, and live transactional streams.", icon: "Database" },
      { step: "03", name: "Data Engineering", desc: "Build query views, clean null anomalies, and consolidate reporting directories.", icon: "Settings" },
      { step: "04", name: "Analytics", desc: "Apply nesting, calculation tables, and advanced DAX loops.", icon: "BarChart3" },
      { step: "05", name: "Visualization", desc: "Design high-density interactive dashboards with real-time KPI thresholds.", icon: "Gauge" },
      { step: "06", name: "Report Automation", desc: "Eliminate copy-paste loops via robust macro schedules.", icon: "FileSpreadsheet" },
      { step: "07", name: "Business Decisions", desc: "Empower decision-makers with confident, automated data intelligence.", icon: "TrendingUp" },
    ],
  },
  // "Integrated Learning Tools" ecosystem cards (icons = lucide names).
  tools: {
    eyebrow: "Ecosystem",
    heading: "Integrated Learning Tools",
    subtext: "Every course is backed by a robust suite of digital learning tools.",
    items: [
      { label: "Assignments", desc: "Project-focused work solving real corporate models.", icon: "CheckSquare" },
      { label: "Mock Tests", desc: "Time-bound simulation of actual placement tests.", icon: "Clock" },
      { label: "Assessments", desc: "Automatic test checking and granular output evaluation.", icon: "Target" },
      { label: "Certificates", desc: "Verified downloadable credentials with unique IDs.", icon: "GraduationCap" },
      { label: "Video Lessons", desc: "Step-by-step video instructions mapping analytical loops.", icon: "Play" },
      { label: "Progress Tracking", desc: "Interactive visual scoring of your modular checklist.", icon: "Sparkles" },
    ],
  },
};

export const FALLBACK_ONLINE_COURSES = {
  headingLead: "Online",
  headingAccent: "Courses",
  intro: "Self-paced video curricula. Code spreadsheets, build telemetry dashboards, and consolidate financial pipelines.",
};

export const FALLBACK_INTERNSHIPS_PAGE = {
  headingLead: "Internship",
  headingAccent: "Opportunities",
  intro: "Gain placement-focused corporate analytical capabilities by working on real client projects.",
};

export const FALLBACK_CAT_CORPORATE = {
  name: "Corporate",
  description: "Custom automated dashboards, financial telemetry modules, and MIS reporting pipelines for enterprise teams.",
};

export const FALLBACK_CAT_COLLEGES = {
  name: "Colleges",
  description: "Academic partnerships, college batch cohorts, and automated skill evaluation tests for campuses.",
};

export const FALLBACK_CAT_ONE_TO_ONE = {
  name: "One-to-One",
  description: "Personalized 1-on-1 analytical mentoring sessions tailored for custom professional career growth.",
};

export const FALLBACK_CAREERS = {
  eyebrow: "Careers Board",
  headingLead: "Join Our",
  headingAccent: "Team",
  intro: "Build enterprise dashboards, configure automation engines, and consult with leading corporate teams.",
};

export const FALLBACK_BLOG = {
  eyebrow: "Insights & Articles",
  headingLead: "KVJ Analytics Blog",
  headingAccent: "",
  intro: "Discover advanced Excel techniques, dashboard design rules, process automation case studies, and edtech updates.",
};

export const FALLBACK_IMPACT = {
  eyebrow: "Clients & Milestones",
  heading: "Our Impact",
  intro:
    `For over ${CURRENT_EXP_YEARS} years, KVJ Analytics has delivered analytics, automation, and training solutions to corporates and educational institutions.`,
  highlights: [
    "50,000+ Young Professionals Trained",
    "5,000+ Senior Professionals Trained",
    "Clients Across India & International Markets",
    "Services Delivered in UAE, Oman, USA & Europe",
  ],
  industriesServed: [
    "Education",
    "Finance",
    "Retail",
    "HR",
    "Logistics",
    "Operations",
    "Consulting",
  ],
};

export const FALLBACK_PRIVACY = {
  eyebrow: "Legal Information",
  heading: "Privacy Policy",
  lastUpdated: "Last Updated: June 18, 2026",
  bodyHtml: "",
};

export const FALLBACK_TERMS = {
  eyebrow: "Legal Information",
  heading: "Terms & Conditions",
  lastUpdated: "Last Updated: June 18, 2026",
  bodyHtml: "",
};

export const FALLBACK_ABOUT = {
  title: "About KVJ Analytics",
  intro:
    `KVJ Analytics is an analytics, automation, and training company with ${CURRENT_EXP_YEARS}+ years of experience supporting corporates and educational institutions.`,
  specializations: [
    "Report Automation",
    "Dashboard Development",
    "Data Visualization",
    "Spreadsheet Consulting",
    "Process Automation",
    "Corporate Training",
    "Educational Technology Solutions",
  ],
  reachLine:
    "Our services and training programs have reached clients across Kerala, India, UAE, Oman, USA, and Europe.",
  impact: [
    "5+ Regions",
    "20+ Clients",
    "Enterprise Solutions",
    "Technology & Learning Ecosystem",
  ],
  vision: {
    heading: "Our Vision",
    body: "To build smarter organizations and industry-ready professionals through analytics, automation, and practical learning.",
  },
  cta: {
    title: "Let's Build Smarter Systems Together",
    description:
      "Whether you are a corporate organization seeking automation and analytics, or an institution wanting industry-ready outcomes, KVJ Analytics is ready to support your transformation journey.",
    primaryText: "Contact Our Team",
    primaryHref: "/contact",
    secondaryText: "View Solutions",
    secondaryHref: "/corporate",
  },
};

export const FALLBACK_CORPORATE = {
  heading: "Corporate Solutions",
  strapline: "Smarter Reporting. Faster Decisions.",
  intro:
    "We help organizations eliminate repetitive manual reporting, streamline spreadsheet workflows, and gain clear visibility into operational performance through cost-conscious, maintainable analytics solutions.",
  cta: {
    title: "Looking for custom automation, reports or dashboards?",
    description:
      "We audit existing reporting workflows, eliminate repetitive spreadsheet bottlenecks, and deliver maintainable automation solutions tailored to your operational budget.",
    primaryText: "Schedule a Free Discovery Session",
    primaryHref: "/contact",
    secondaryText: "",
    secondaryHref: "",
  },
  services: [
    {
      title: "Report Automation",
      slug: "report-automation",
      shortDescription:
        "Automate MIS, financial, operational, and management reports with speed, consistency, and reduced manual effort.",
      problemSolved:
        "Finance and operations teams losing hours every week manually consolidating disparate spreadsheets, risking formula breakage and delayed management decisions.",
      targetAudience: [
        "CFOs & Finance Controllers",
        "MIS & Operations Heads",
        "Department Reporting Leads"
      ],
      details: [
        "Significantly reduce time spent copying, pasting, and consolidating manual spreadsheets.",
        "Unify ERP exports, transactional files, and departmental reports into single-click workflows.",
        "Minimize recurring data discrepancies with standardized validation rules.",
        "Deploy reusable macros and automated scripts engineered for long-term operational reliability."
      ]
    },
    {
      title: "Data Visualization",
      slug: "data-visualization",
      shortDescription:
        "Convert complex multi-source data into clear visual insights, executive dashboards, and interactive reports.",
      problemSolved:
        "Dense, table-heavy reports obscuring critical business trends, regional variances, and performance bottlenecks from leadership.",
      targetAudience: [
        "Executive Leadership & Boards",
        "Commercial Directors",
        "Business Unit Managers"
      ],
      details: [
        "Design intuitive visual hierarchies that highlight operational insights and performance bottlenecks.",
        "Map out comparative trends, monthly variances, and regional breakdowns with clear context.",
        "Structure charts and KPIs to align with corporate audit and reporting standards.",
        "Incorporate company branding standards for consistent executive and board presentations."
      ]
    },
    {
      title: "Spreadsheet Consulting",
      slug: "spreadsheet-consulting",
      shortDescription:
        "Advanced Excel systems, automated modeling, data validation, and performance optimization.",
      problemSolved:
        "Slow, fragile, bloated workbooks with undocumented formulas that crash frequently and create single-point employee dependencies.",
      targetAudience: [
        "Financial Analysts",
        "Operations Controllers",
        "Spreadsheet-Heavy Teams"
      ],
      details: [
        "Audit complex spreadsheets to eliminate calculation lag, formula corruption, and performance bottlenecks.",
        "Develop structured financial and operational models that internal teams can maintain without ongoing consultant reliance.",
        "Implement data validation and change-protection rules to prevent accidental overwrites and formula breakage.",
        "Deliver cost-effective spreadsheet solutions that maximize existing software investments without expensive licensing additions."
      ]
    },
    {
      title: "Dashboard Development",
      slug: "dashboard-development",
      shortDescription:
        "Real-time dashboards for KPI tracking, operational performance monitoring, and business intelligence.",
      problemSolved:
        "Scattered departmental data sources requiring recurring manual compilation instead of a unified, real-time source of truth.",
      targetAudience: [
        "Business Intelligence Leads",
        "Operations Directors",
        "Enterprise Unit Heads"
      ],
      details: [
        "Consolidate scattered business metrics into clear, executive-ready Power BI and Excel dashboards.",
        "Gain real-time visibility into operational trends, department KPIs, and regional outputs.",
        "Enable intuitive drill-down capability from high-level executive summaries to underlying transactions.",
        "Build lightweight, maintainable dashboards that update efficiently and adapt as your organization grows."
      ]
    },
    {
      title: "App Development",
      slug: "app-development",
      shortDescription:
        "Custom business applications for reporting, workflow coordination, and operational management.",
      problemSolved:
        "Rigid commercial off-the-shelf software failing to match custom internal approval chains and operational reporting routines.",
      targetAudience: [
        "Operations Leads",
        "IT & Systems Managers",
        "Administrative Heads"
      ],
      details: [
        "Build customized operational applications matching your exact departmental workflow.",
        "Configure secure data sharing and role-based access control for team members.",
        "Integrate custom database connectors and scheduled background jobs.",
        "Deliver responsive interface layers accessible on desktop and mobile browsers."
      ]
    },
    {
      title: "Process Automation",
      slug: "process-automation",
      shortDescription:
        "Reduce manual bottlenecks through practical, cost-conscious workflow and process automation.",
      problemSolved:
        "Recurring multi-step administrative data transfers consuming valuable analyst hours during month-end and quarterly closing.",
      targetAudience: [
        "Operations Managers",
        "Shared Services Teams",
        "Workflow Coordinators"
      ],
      details: [
        "Identify and streamline repetitive manual steps across weekly and monthly reporting cycles.",
        "Automate data consolidation across folders, spreadsheets, and departmental databases.",
        "Configure reliable background data refresh schedules that free staff for higher-value analytical work.",
        "Establish practical automated alerts for key operational thresholds and submission milestones."
      ]
    },
    {
      title: "Corporate Training",
      slug: "corporate-training",
      shortDescription:
        "Hands-on training in Excel, Power BI, analytics, dashboards, and automated reporting tools.",
      problemSolved:
        "Spreadsheet and Power BI skill deficiencies across departments resulting in slow reporting turnarounds and unnecessary external dependency.",
      targetAudience: [
        "Corporate HR & L&D Heads",
        "Finance & Analytics Teams",
        "Departmental Staff"
      ],
      details: [
        "Deliver customized corporate workshops tailored to your team's specific spreadsheet and analytical skill gaps.",
        "Provide practical datasets and exercises modeled after actual business MIS and reporting scenarios.",
        "Increase departmental productivity by upskilling staff in advanced data modeling, DAX, and automated formatting.",
        "Review post-training skill assessments to verify measurable workplace application."
      ]
    }
  ]
};

export const FALLBACK_EDUCATION = {
  heading: "Educational Solutions",
  strapline: "Building Industry-Ready Learning Systems",
  intro:
    "KVJ Analytics helps institutions bridge the gap between academics and industry through practical training, automation, and analytics platforms.",
  cta: {
    title: "Looking to run a certificate program or skill lab?",
    description:
      "We partner with academic institutions to provide practical workshops, syllabus updates, and assessment platforms.",
    primaryText: "Request an Institutional Partnership Proposal",
    primaryHref: "/contact",
    secondaryText: "",
    secondaryHref: "",
  },
  // Side "partner with us" card shown on each education detail page (editable in admin).
  partnerCard: {
    title: "Partner With KVJ Analytics",
    description:
      "Collaborate with our team to bring industry-grade analytics labs, certification programs, and curriculum updates to your campus.",
    bullets: [
      "Practical, industry-aligned analytics labs",
      "College credit course integrations available",
      "Continuous practical evaluation support",
    ],
    buttonText: "Partner With Us",
  },
  services: [
    {
      title: "Training Programs",
      slug: "training-programs",
      shortDescription:
        "Practical programs in Excel, Power BI, Data Analytics, Financial Analytics, and Business Intelligence.",
      details: [
        "Practical labs where students solve cases using actual business data.",
        "Comprehensive assignments on dashboard layout and data filtering.",
        `Live instruction by training specialists with ${CURRENT_EXP_YEARS}+ years of exposure.`,
        "Job-readiness programs focused on immediate workplace capability."
      ]
    },
    {
      title: "Certification Programs",
      slug: "certification-programs",
      shortDescription:
        "Industry-oriented certifications focused on employability and practical skills.",
      details: [
        "Earn recognized credentials validating Advanced Excel and Power BI skills.",
        "Improve student placement ratios by demonstrating practical analytics capabilities.",
        "Structured curriculum pathways with graded projects and capstones.",
        "Direct industry validation via practical testing engines."
      ]
    },
    {
      title: "Curriculum Development",
      slug: "curriculum-development",
      shortDescription:
        "Modern, analytics-driven curriculum aligned with industry expectations.",
      details: [
        "Collaborate with board-of-studies to introduce credit-based data courses.",
        "Align lesson plans with tools commonly used by hiring organizations.",
        "Provide course materials, syllabus manuals, and grading rubrics.",
        "Ongoing syllabus auditing to stay ahead of software and AI upgrades."
      ]
    },
    {
      title: "Academic Analytics Solutions",
      slug: "academic-analytics-solutions",
      shortDescription:
        "Technology platforms for reporting, evaluation, analytics, and performance tracking.",
      details: [
        "Integrate reporting tools to consolidate progress cards and metrics.",
        "Monitor course enrollment, attendance logs, and test score distributions.",
        "Streamline board audits and accreditation cycles with automated exports.",
        "Track alumni placement records and performance progress curves."
      ]
    }
  ]
};

export const FALLBACK_PRODUCTS = [
  {
    name: "GradeScope",
    slug: "grade-scope",
    tagline: "Educational Reporting & Analytics Platform",
    description:
      "Grade Scope automates student progress reports, placement reports, training reports, and institutional analytics.",
    keyFeatures: [
      "Automated Reporting",
      "Student Progress Tracking",
      "Placement Analytics",
      "Performance Monitoring",
      "Centralized Data Management"
    ],
  },
  {
    name: "Protrix",
    slug: "protrix",
    tagline: "Assignment & Assessment Automation Platform",
    description:
      "Protrix helps teachers generate, manage, and evaluate practical assignments while helping students practice and improve skills.",
    keyFeatures: [
      "Assignment Automation",
      "Automated Evaluation",
      "Excel-Based Learning",
      "Practical Skill Assessment",
      "Time-Saving Evaluation System"
    ],
  },
];

export const FALLBACK_PRODUCTS_PAGE = {
  heading: "Our Products",
  intro: "Automate Reporting. Elevate Institutions.",
  products: FALLBACK_PRODUCTS,
  // Side "request a demo" card shown on each product detail page (editable in admin).
  demoCard: {
    title: "Request a Product Demonstration",
    description:
      "Connect with our product specialists to schedule an interactive video walkthrough of the software and see how it fits your institution.",
    bullets: [
      "Custom setup configured for your course structure",
      "Integration audits and student sandbox environment",
      "Free consultation for college administrators",
    ],
    buttonText: "Schedule Demo",
  },
};

export const FALLBACK_CONTACT = {
  heading: "Contact KVJ Analytics",
  strapline: "Let's Build Smarter Systems Together",
  intro:
    "Whether you are seeking to reduce manual reporting overhead, modernize spreadsheet workflows, or build practical analytics capabilities for your team, KVJ Analytics provides cost-conscious, reliable guidance tailored to your operational goals.",
  inquiryAreas: [
    "Corporate Consulting",
    "Dashboard Development",
    "Process Automation",
    "Corporate Training",
    "Educational Partnerships",
    "Curriculum Development",
    "Product Demonstrations",
    "Institutional Collaborations",
  ],
};
