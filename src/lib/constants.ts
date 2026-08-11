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
    phones: ["9961813730", "0484-4059310", "7902661012"],
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
        { label: "Grade Scope", href: "/products/grade-scope" },
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
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "Twitter", url: "https://twitter.com" },
    { platform: "Facebook", url: "https://facebook.com" },
  ],
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
      "KVJ Analytics partners with businesses, enterprises and educational institutions to build intelligent analytics platforms, automate business processes, modernize operations and enable data-driven decision making. We combine technology, strategy and innovation to create measurable business outcomes.",
    primaryCta: { label: "Schedule a Consultation", href: "/contact" },
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
      { title: "Corporate Analytics", points: ["Business Intelligence", "Executive Dashboards", "Data Visualization", "Performance Analytics", "Decision Support"] },
      { title: "Digital Transformation", points: ["Business Process Automation", "Workflow Optimization", "Cloud Transformation", "Digital Strategy", "Technology Modernization"] },
      { title: "Enterprise Technology", points: ["Custom Business Applications", "Enterprise Portals", "Analytics Platforms", "Data Platforms", "System Integration"] },
      { title: "Consulting Services", points: ["Analytics Consulting", "Technology Advisory", "Digital Strategy", "Business Process Analysis", "Implementation Roadmaps"] },
    ],
    cta: { label: "Explore Corporate Solutions", href: "/corporate" },
  },
  whyUs: {
    heading: "Turning Complex Data into Clear Decisions",
    // Titles are approved; one-line bodies to be added via CMS (not fabricated).
    cards: [
      { title: "Business Intelligence", body: "" },
      { title: "Automation", body: "" },
      { title: "Artificial Intelligence", body: "" },
      { title: "Enterprise Platforms", body: "" },
      { title: "Custom Solutions", body: "" },
      { title: "Innovation", body: "" },
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
    primaryCta: { label: "Schedule a Consultation", href: "/contact" },
    secondaryCta: { label: "Contact Us", href: "/contact" },
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
    "We help organizations automate reporting, improve visibility, optimize workflows, and make faster business decisions.",
  cta: {
    title: "Looking for custom automation, reports or dashboards?",
    description:
      "We provide full-spectrum consultation, audit, development, and training integration tailored to your company.",
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
        "Automate MIS, financial, operational, and management reports with speed and accuracy.",
      details: [
        "Say goodbye to hours of copying and pasting cells manually.",
        "Consolidate multiple files and ERP data pipelines with single-click routines.",
        "Reduce calculation errors and data mismatch issues.",
        "Create scalable macros, scripts, and scheduled data loaders."
      ]
    },
    {
      title: "Data Visualization",
      slug: "data-visualization",
      shortDescription:
        "Convert complex data into meaningful visual insights and interactive reports.",
      details: [
        "Design clear visual hierarchies that highlight operational insights.",
        "Map out comparative trends and monthly performance breakdowns.",
        "Structure charts and KPIs to align with corporate audit standards.",
        "Incorporate company color styles for unified board presentations."
      ]
    },
    {
      title: "Spreadsheet Consulting",
      slug: "spreadsheet-consulting",
      shortDescription:
        "Advanced Excel systems, automation, validation, and optimization solutions.",
      details: [
        "Audit existing formulas for performance bottle-necks and calculation lag.",
        "Build robust financial models with dynamic inputs and forecasting.",
        "Structure spreadsheet rules to validate inputs and prevent accidental data loss.",
        "Implement custom VBA scripts to extend spreadsheet capabilities."
      ]
    },
    {
      title: "Dashboard Development",
      slug: "dashboard-development",
      shortDescription:
        "Real-time dashboards for KPI tracking, performance monitoring, and business intelligence.",
      details: [
        "Connect live data sources directly to unified dashboard portals.",
        "Track daily operations metrics, sales volumes, and regional outputs.",
        "Build drill-down layers to view details from global maps to specific transactions.",
        "Share interactive reports securely with team leaders and managers."
      ]
    },
    {
      title: "App Development",
      slug: "app-development",
      shortDescription:
        "Custom business applications for reporting, workflow, and operational management.",
      details: [
        "Build customized operational applications matching your exact workflow.",
        "Secure data sharing and roles-based access control.",
        "Integrate custom database connectors and scheduled background jobs.",
        "Responsive dashboard layers accessible on desktop and mobile."
      ]
    },
    {
      title: "Process Automation",
      slug: "process-automation",
      shortDescription:
        "Reduce manual work through intelligent workflow and process automation.",
      details: [
        "Analyze business processes to isolate repetitive manual steps.",
        "Integrate tools to sync data across folders, spreadsheets, and databases.",
        "Deploy background automation jobs that run 24/7 without intervention.",
        "Configure automated email alerts and task assignments on critical events."
      ]
    },
    {
      title: "Corporate Training",
      slug: "corporate-training",
      shortDescription:
        "Hands-on training in Excel, Power BI, analytics, dashboards, and automation tools.",
      details: [
        "Deliver customized training programs matching your team's skill gap.",
        "Provide practical datasets and assignments modeled after actual business MIS.",
        "Increase worker efficiency in using advanced formatting and modeling.",
        "Review post-training skill assessments and performance scorecards."
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
    name: "Grade Scope",
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
    "Whether you are a corporate organization looking for automation and analytics solutions or an educational institution seeking industry-oriented learning platforms, KVJ Analytics is ready to support your transformation journey.",
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
