import { createClient } from "@supabase/supabase-js";

// Global mock database to persist across hot reloads in Next.js development
const globalForMockDb = globalThis as unknown as {
  mockDb: Record<string, any[]>;
  mockStorage: Record<string, string>;
  mockLoggedInUser: any;
};

if (!globalForMockDb.mockDb) {
  globalForMockDb.mockDb = {
    clients: [
      {
        id: "c1",
        name: "Innovate Kerala",
        logo_url: "https://picsum.photos/200/100?random=11",
        website_url: "https://example.com",
        is_active: true,
        sort_order: 1,
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: "c2",
        name: "Apex Solutions Dubai",
        logo_url: "https://picsum.photos/200/100?random=12",
        website_url: "https://example.com",
        is_active: true,
        sort_order: 2,
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: "c3",
        name: "Educorp UAE",
        logo_url: "https://picsum.photos/200/100?random=13",
        website_url: "https://example.com",
        is_active: true,
        sort_order: 3,
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    ],
    testimonials: [
      {
        id: "t1",
        name: "Rohan Sharma",
        role: "Director of Operations",
        company: "Innovate Kerala",
        text: "KVJ Analytics completely automated our monthly MIS reporting. Tasks that used to take 2 full days are now done in a single click!",
        avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        is_active: true,
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: "t2",
        name: "Dr. Lakshmi Nair",
        role: "Head of Placement",
        company: "Apex Technical College",
        text: "The student evaluation dashboards and automated grading platforms designed by KVJ have drastically reduced our administrative overhead and improved placement insights.",
        avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        is_active: true,
        created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
    ],
    case_studies: [
      {
        id: "cs1",
        title: "Automating 500+ Regional Reports",
        category: "Report Automation",
        client_name: "Apex Solutions",
        summary: "How we structured a single-click Excel macro pipeline to consolidate sales figures across 500+ retail stores daily.",
        metrics: "95% Reduction in Processing Time",
        challenge: "Managers spent 4 hours every morning copy-pasting CSV data into master reporting books, leading to manual formula breakages.",
        solution: "Structured a background Python/Excel parser that automatically validates, cleans, and builds unified sheets.",
        results: "MIS reporting is fully complete by 8:00 AM daily with 0 manual intervention required.",
        is_active: true,
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
    ],
    team: [
      {
        id: "tm1",
        name: "Ajay Thomas",
        role: "Lead Consultant & Trainer",
        bio: "Over 16 years of expertise in spreadsheet automation, custom macros, Power BI development, and academic analytics consulting.",
        photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
        linkedin_url: "https://linkedin.com/in/ajaythomas",
        is_active: true,
        sort_order: 1,
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
    ],
    leads: [
      {
        id: "l1",
        name: "Jane Smith",
        organization: "Tech Solutions Inc",
        email: "jane.smith@techsolutions.com",
        phone: "+91 99887 76655",
        service_interest: "Process Automation",
        message: "We need custom Power BI dashboards for our logistics operations. Looking for training + development consulting.",
        source_page: "/contact",
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "brand_search",
        status: "new",
        created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
      },
      {
        id: "l2",
        name: "Anil Kumar",
        organization: "National College of Engineering",
        email: "anil.kumar@nce.edu.in",
        phone: "+91 98450 12345",
        service_interest: "Educational Partnerships",
        message: "Interested in the Grade Scope product demonstration for our department performance reports.",
        source_page: "/products",
        utm_source: "direct",
        utm_medium: "",
        utm_campaign: "",
        status: "contacted",
        created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
    ],
    batches: [
      {
        id: "b1",
        college_name: "Cochin Institute of Technology",
        course_slug: "advanced-excel-analytics",
        totp_secret: "JBSWY3DPEHPK3PXP", // base32 demo secret
        valid_from: new Date(Date.now() - 3600000).toISOString(),
        valid_to: new Date(Date.now() + 365 * 86400000).toISOString(),
        active: true,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
    batch_students: [],
    enrollments: [
      {
        id: "e1",
        user_id: "user1",
        course_slug: "advanced-excel-analytics",
        enrollment_method: "college_code",
        status: "active",
        created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
    ],
    profiles: [
      {
        id: "user1",
        name: "Student Demo",
        organization: "Cochin Institute of Technology",
        phone: "+91 99999 88888",
        role: "student",
        profession: "student",
        full_name: "Student Demo",
        account_type: "individual",
        created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
    ],
    course_categories: [
      { id: "cat1", slug: "one-to-one", name: "One-to-One", description: "Personalized mentoring sessions tailored for custom growth plans.", type: "inquiry", display_order: 1, is_published: true },
      { id: "cat2", slug: "corporate", name: "Corporate", description: "Dedicated team automation, reports, and analytical solutions training.", type: "inquiry", display_order: 2, is_published: true },
      { id: "cat3", slug: "colleges", name: "Colleges", description: "Curriculum partnerships and evaluation systems for students and academies.", type: "inquiry", display_order: 3, is_published: true },
      { id: "cat4", slug: "online-courses", name: "Online Courses", description: "Self-paced video courses for professional spreadsheet modeling and analytics.", type: "self_serve", display_order: 4, is_published: true },
      { id: "cat5", slug: "internships", name: "Internships", description: "Hands-on project experience with placement-focused learning paths.", type: "self_serve", display_order: 5, is_published: true },
    ],
    courses: [
      {
        id: "c1",
        slug: "excel-mis-automation",
        title: "Advanced Excel & MIS Automation",
        summary: "Master formula consolidation, reporting loops, and dashboard designs using real corporate MIS datasets.",
        category_id: "cat4",
        banner_url: "https://picsum.photos/800/400?random=1",
        duration: "6 Weeks",
        fee_inr: 4999,
        offer_price_inr: 3499,
        offer_label: "Early Bird 30% Off",
        offer_expiry: new Date(Date.now() + 3 * 86400000).toISOString(),
        is_locked: false,
        is_published: true,
        created_at: new Date(Date.now() - 100 * 86400000).toISOString(),
      },
      {
        id: "c2",
        slug: "power-bi-business-analytics",
        title: "Power BI Business Analytics & BI",
        summary: "Connect live data sources, design KPI tiles, and deploy interactive boards for senior executives.",
        category_id: "cat4",
        banner_url: "https://picsum.photos/800/400?random=2",
        duration: "8 Weeks",
        fee_inr: 7999,
        offer_price_inr: 5999,
        offer_label: "Special Launch Pricing",
        offer_expiry: new Date(Date.now() + 5 * 86400000).toISOString(),
        is_locked: false,
        is_published: true,
        created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
      },
      {
        id: "c3",
        slug: "corporate-automation-bootcamp",
        title: "Corporate Automation Bootcamp",
        summary: "Enterprise workflow design and automated reporting pipeline construction.",
        category_id: "cat2",
        banner_url: "https://picsum.photos/800/400?random=3",
        duration: "4 Weeks",
        fee_inr: 12000,
        offer_price_inr: null,
        offer_label: null,
        offer_expiry: null,
        is_locked: true,
        is_published: true,
        created_at: new Date(Date.now() - 50 * 86400000).toISOString(),
      }
    ],
    colleges: [
      { id: "col1", name: "Cochin University of Science and Technology (CUSAT)", created_at: new Date().toISOString() },
      { id: "col2", name: "Rajagiri School of Engineering & Technology (RSET)", created_at: new Date().toISOString() },
      { id: "col3", name: "Government Model Engineering College (MEC)", created_at: new Date().toISOString() },
    ],
    unlock_codes: [
      {
        id: "uc1",
        code: "123456",
        course_id: "c3",
        batch_label: "Beta Cohort",
        max_uses: 10,
        used_count: 0,
        expires_at: new Date(Date.now() + 10 * 86400000).toISOString(),
        is_active: true,
        training_type: "COLLEGE",
        seats: 10,
        seats_used: 0,
        valid_from: new Date().toISOString(),
        valid_until: new Date(Date.now() + 10 * 86400000).toISOString(),
        status: "ACTIVE",
        college_id: "col1",
        coordinator_name: "Dr. Thomas Mathew",
        coordinator_email: "tmathew@cusat.ac.in",
        allowed_email_domain: "cusat.ac.in",
        notes: "Seed batch for CUSAT MCA department."
      },
      {
        id: "uc2",
        code: "O2O-XYZ890",
        course_id: "c1",
        batch_label: "One-to-One Mentor Program",
        max_uses: 1,
        used_count: 0,
        expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
        is_active: true,
        training_type: "ONE_TO_ONE",
        seats: 1,
        seats_used: 0,
        valid_from: new Date().toISOString(),
        valid_until: new Date(Date.now() + 30 * 86400000).toISOString(),
        status: "ACTIVE",
        allowed_email_domain: "gmail.com",
        notes: "Direct mentoring code."
      },
      {
        id: "uc3",
        code: "CORP-INV2026",
        course_id: "c2",
        batch_label: "Innovate Corporate Training",
        max_uses: 50,
        used_count: 0,
        expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
        is_active: true,
        training_type: "CORPORATE",
        seats: 50,
        seats_used: 0,
        valid_from: new Date().toISOString(),
        valid_until: new Date(Date.now() + 90 * 86400000).toISOString(),
        status: "ACTIVE",
        organization_id: "c1",
        coordinator_name: "Sarah Jenkins",
        coordinator_email: "sjenkins@innovate.com",
        allowed_email_domain: "innovate.com",
        notes: "Corporate cohort for Innovate Kerala."
      }
    ],
    code_redemptions: [],
    internships: [
      { id: "int1", slug: "data-analytics-intern", title: "Data Analytics Intern", description: "Learn database querying, dashboard layout building, and presentation skills under senior consultants.", banner_url: "https://picsum.photos/800/400?random=4", duration: "3 Months", stipend: "₹5,000 / Month (demo)", is_published: true, display_order: 1 }
    ],
    internship_applications: [],
    inquiries: [],
    jobs: [
      { id: "j1", slug: "power-bi-developer", title: "Power BI Developer", location: "Cochin / Remote", type: "full_time", department: "Consulting", description: "We are seeking a mid-level Power BI developer experienced with DAX, Power Query, and SQL.", is_published: true, display_order: 1 }
    ],
    job_applications: [],
    modules: [
      { id: "mod1", course_id: "c1", title: "Formula Consolidation", display_order: 1 },
      { id: "mod2", course_id: "c1", title: "Reporting Loops & Macros", display_order: 2 }
    ],
    lessons: [
      { id: "les1", module_id: "mod1", title: "Dynamic Lookup Chains", kind: "material", content_html: "<p>Learn nested XLOOKUP/INDEX-MATCH patterns.</p>", video_url: "https://www.w3schools.com/html/mov_bbb.mp4", display_order: 1 },
      { id: "les2", module_id: "mod1", title: "Consolidating 10 Sheets", kind: "material", content_html: "<p>Learn 3D formulas and Excel consolidate function.</p>", video_url: "https://www.w3schools.com/html/mov_bbb.mp4", display_order: 2 }
    ],
    questions: [],
    mock_tests: [],
    test_attempts: [],
    page_content: [],
    orders: [],
    activity_results: [],
    media_library: [],
    blog_posts: [
      {
        id: "post1",
        slug: "why-data-driven-organizations-consistently-outperform-their-competition",
        title: "Why Data-Driven Organizations Consistently Outperform Their Competition",
        description: "Leaders who make decisions backed by evidence rather than assumptions consistently outperform. Discover how Business Intelligence creates a single source of truth for competitive advantage.",
        body_html: `
          <p class="lead">In today's rapidly evolving business environment, every organisation generates vast amounts of data—from customer interactions and sales transactions to operational workflows and financial records. However, data alone does not create value. The real advantage lies in transforming that data into meaningful insights that support confident, strategic decision-making.</p>
          
          <div class="callout callout-tip">
            <strong>Key Strategy:</strong> Data-driven organisations consistently outperform their competitors because they rely on evidence rather than assumptions.
          </div>

          <h2>What is Business Intelligence?</h2>
          <p>Business Intelligence is the process of collecting, integrating, analysing, and visualising data to support better business decisions.</p>
          <p>Rather than manually reviewing spreadsheets and reports, organisations use interactive dashboards and automated analytics to monitor key performance indicators (KPIs), identify trends, and measure outcomes in real time.</p>

          <blockquote>
            <p>"Without data, you're just another person with an opinion." — W. Edwards Deming</p>
          </blockquote>

          <h2>Benefits of a Data-Driven Strategy</h2>
          <p>Organizations implementing Business Intelligence achieve measurable performance gains across all operations:</p>
          
          <ul>
            <li><strong>Better Decision Making:</strong> Access to reliable, real-time information enables leaders to make faster and more informed decisions.</li>
            <li><strong>Increased Operational Efficiency:</strong> Automated reporting reduces manual effort, eliminates repetitive tasks, and allows teams to focus on strategic initiatives.</li>
            <li><strong>Improved Customer Experience:</strong> Understanding customer behaviour helps organisations personalise services, improve engagement, and strengthen relationships.</li>
            <li><strong>Greater Financial Visibility:</strong> Interactive financial dashboards provide immediate visibility into revenue, expenses, and profitability.</li>
            <li><strong>Competitive Advantage:</strong> Businesses that leverage analytics respond more quickly to market changes and identify opportunities before competitors.</li>
          </ul>

          <h2>Performance Telemetry</h2>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Traditional Approach</th>
                <th>Data-Driven Strategy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Decision Timelines</td>
                <td>Days or weeks of spreadsheet prep</td>
                <td>Real-time dashboard updates</td>
              </tr>
              <tr>
                <td>Operational Efficiency</td>
                <td>High copy-paste manual overhead</td>
                <td>Automated reporting pipelines</td>
              </tr>
              <tr>
                <td>Anomaly Detection</td>
                <td>Discovered during end-of-month review</td>
                <td>Instant alerts on deviation</td>
              </tr>
            </tbody>
          </table>

          <h2>Common Challenges</h2>
          <p>Many organisations face challenges such as:</p>
          <ol>
            <li>Information spread across multiple systems.</li>
            <li>Time-consuming manual reporting.</li>
            <li>Inconsistent data.</li>
            <li>Limited visibility into business performance.</li>
            <li>Difficulty identifying trends.</li>
          </ol>
          <p>Business Intelligence addresses these challenges by creating a single source of truth that supports better collaboration and more confident decision-making.</p>

          <h2>The Future of Business Intelligence</h2>
          <p>Modern Business Intelligence is increasingly integrated with Artificial Intelligence and Machine Learning. These technologies enable organisations to predict future trends, detect anomalies automatically, forecast business performance, and recommend actions based on historical data.</p>
          
          <div class="callout callout-info">
            <strong>Looking Ahead:</strong> Instead of simply reporting what happened, businesses can prepare for what is likely to happen next.
          </div>

          <h2>Conclusion</h2>
          <p>Business Intelligence is no longer a luxury reserved for large enterprises. Organisations of every size can benefit from better visibility, smarter decision-making, and improved operational efficiency. The businesses that embrace data-driven strategies today will be the ones best positioned for long-term success tomorrow.</p>
        `,
        cover_url: "https://picsum.photos/800/400?random=31",
        author_name: "K. V. Jacob",
        author_slug: "k-v-jacob",
        author_bio: "Founder & Director of KVJ Analytics. Over 16 years of expertise in spreadsheet automation, custom macros, Power BI development, and academic analytics consulting.",
        category_title: "Business Intelligence",
        category_slug: "business-intelligence",
        published_at: "2026-07-20T08:00:00.000Z",
        featured: true,
        is_published: true,
        status: "published",
        display_order: 1,
        featured_flags: ["featured", "latest"],
        tags: ["business-intelligence", "data-driven", "decision-making"],
        seo_title: "Why Data-Driven Organizations Outperform Competitors",
        seo_description: "Discover why data-driven companies consistently beat their competition using Business Intelligence tools and dashboards.",
        seo_keywords: "business intelligence, data-driven, competitive advantage",
        authors_json: [
          {
            name: "K. V. Jacob",
            slug: "k-v-jacob",
            bio: "Founder & Director of KVJ Analytics. Leads corporate reporting automation consultancies and university practical analytics certifications.",
            avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            designation: "Director & Principal Consultant",
            company: "KVJ Analytics",
            is_featured: true,
            is_guest: false,
            social_links: { linkedin: "https://linkedin.com", twitter: "https://twitter.com" }
          }
        ],
        category_json: {
          title: "Business Intelligence",
          slug: "business-intelligence",
          icon: "Layout",
          color: "brand",
          description: "Insights on converting manual spreadsheet logic into automated, high-visibility business dashboards.",
          featured: true,
          order: 1,
          visibility: true,
          seo: { title: "Business Intelligence & Dashboard Insights", description: "Learn dashboard layouts and data aggregation frameworks." }
        },
        related_ids: ["post2", "post3"]
      },
      {
        id: "post2",
        slug: "digital-transformation-building-smarter-businesses-for-the-future",
        title: "Digital Transformation: Building Smarter Businesses for the Future",
        description: "Digital Transformation is about improving how organisations operate, collaborate, and create value using data, processes, and technology.",
        body_html: `
          <p class="lead">Digital Transformation is often associated with adopting new software or migrating to cloud platforms. While technology plays a significant role, successful transformation is ultimately about improving the way organisations operate, collaborate, and create value.</p>
          
          <div class="callout callout-success">
            <strong>Strategic Strategy:</strong> It is a strategic journey that combines people, processes, technology, and data to achieve measurable business outcomes.
          </div>

          <h2>Why Digital Transformation Matters</h2>
          <p>Customers expect faster service, employees require efficient tools, and business leaders need accurate insights to make informed decisions. Digital Transformation enables organisations to meet these expectations while improving productivity and reducing operational costs.</p>

          <blockquote>
            <p>"Smarter businesses are built by aligning human strategy with automated engineering workflows."</p>
          </blockquote>

          <h2>Key Components of Digital Transformation</h2>
          <p>Organizations should focus on five core technology pillars for successful business transformation:</p>

          <ul>
            <li><strong>Business Intelligence:</strong> Transform operational data into meaningful insights through dashboards and analytics.</li>
            <li><strong>Process Automation:</strong> Automate repetitive tasks to reduce errors and improve efficiency.</li>
            <li><strong>Artificial Intelligence:</strong> Use intelligent technologies to support forecasting, automation, and decision-making.</li>
            <li><strong>Data Analytics:</strong> Identify trends, measure performance, and uncover growth opportunities.</li>
            <li><strong>Cloud Technologies:</strong> Enable secure collaboration, scalability, and flexible business operations.</li>
          </ul>

          <h2>Transformation Business Benefits</h2>
          <table>
            <thead>
              <tr>
                <th>Benefit Area</th>
                <th>Impact Level</th>
                <th>Resulting Outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Operational Cost</td>
                <td>High Reduction</td>
                <td>Elimination of manual spreadsheets loops</td>
              </tr>
              <tr>
                <td>Decision Timelines</td>
                <td>Real-Time</td>
                <td>Access to live database insights dashboard</td>
              </tr>
              <tr>
                <td>Employee Focus</td>
                <td>High Value</td>
                <td>Staff spends time analyzing rather than formatting</td>
              </tr>
            </tbody>
          </table>

          <h2>Common Mistakes</h2>
          <p>Many transformation initiatives fail because organisations:</p>
          <ol>
            <li>Focus only on technology.</li>
            <li>Lack clear business objectives.</li>
            <li>Ignore employee adoption.</li>
            <li>Do not measure outcomes.</li>
            <li>Underestimate the importance of quality data.</li>
          </ol>
          <p>Successful transformation requires a balanced approach that combines technology with effective business processes and continuous improvement.</p>

          <h2>Looking Ahead</h2>
          <p>Digital Transformation is an ongoing journey rather than a one-time project. Organisations that continuously innovate, adopt emerging technologies, and make data-driven decisions will remain more resilient and competitive in an increasingly digital economy.</p>

          <h2>Conclusion</h2>
          <p>Technology alone does not transform businesses—people, strategy, and intelligent decision-making do. By combining Business Intelligence, Data Analytics, Artificial Intelligence, and automation, organisations can create sustainable growth and long-term business value.</p>
        `,
        cover_url: "https://picsum.photos/800/400?random=32",
        author_name: "K. V. Jacob",
        author_slug: "k-v-jacob",
        author_bio: "Founder & Director of KVJ Analytics. Leads corporate reporting automation consultancies and university practical analytics certifications.",
        category_title: "Digital Transformation",
        category_slug: "digital-transformation",
        published_at: "2026-07-15T09:00:00.000Z",
        featured: false,
        is_published: true,
        status: "published",
        display_order: 2,
        featured_flags: ["trending", "popular"],
        tags: ["digital-transformation", "cloud", "automation", "strategy"],
        seo_title: "Digital Transformation for Smarter Businesses",
        seo_description: "Learn how process automation, Cloud computing, and analytics power digital transformation.",
        seo_keywords: "digital transformation, automation, business innovation",
        authors_json: [
          {
            name: "K. V. Jacob",
            slug: "k-v-jacob",
            bio: "Founder & Director of KVJ Analytics. Leads corporate reporting automation consultancies and university practical analytics certifications.",
            avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            designation: "Director & Principal Consultant",
            company: "KVJ Analytics",
            is_featured: true,
            is_guest: false,
            social_links: { linkedin: "https://linkedin.com", twitter: "https://twitter.com" }
          }
        ],
        category_json: {
          title: "Digital Transformation",
          slug: "digital-transformation",
          icon: "TrendingUp",
          color: "corporate",
          description: "Insights on business process re-engineering, digital agility, and modernization.",
          featured: true,
          order: 2,
          visibility: true,
          seo: { title: "Digital Transformation & Agility Insights", description: "Learn how to build digital automation and cloud pipelines." }
        },
        related_ids: ["post1", "post3"]
      },
      {
        id: "post3",
        slug: "how-artificial-intelligence-is-revolutionising-business-analytics",
        title: "How Artificial Intelligence is Revolutionising Business Analytics",
        description: "AI has evolved from a futuristic concept into a practical business tool, empowering organisations to move from reactive analytics to proactive business planning.",
        body_html: `
          <p class="lead">Artificial Intelligence (AI) has evolved from a futuristic concept into a practical business tool that is reshaping industries worldwide. Today, organisations use AI to analyse large volumes of information, automate repetitive tasks, improve forecasting, and support better decision-making.</p>

          <div class="callout callout-tip">
            <strong>Analytics Evolution:</strong> When combined with Business Intelligence and Data Analytics, AI empowers organisations to make smarter decisions faster than ever before.
          </div>

          <h2>AI and Modern Business Analytics</h2>
          <p>Traditional analytics helps organisations understand what has happened. Artificial Intelligence extends this capability by helping organisations predict what is likely to happen and recommend the best course of action. This enables leaders to move from reactive decision-making to proactive business planning.</p>

          <blockquote>
            <p>"AI doesn't replace analytics; it amplifies decision-making speed by forecasting next month's performance."</p>
          </blockquote>

          <h2>Real-World Applications</h2>
          <ul>
            <li><strong>Sales Forecasting:</strong> AI analyses historical sales data to predict future demand and identify seasonal trends.</li>
            <li><strong>Customer Insights:</strong> Businesses gain a deeper understanding of customer preferences, behaviours, and engagement patterns.</li>
            <li><strong>Financial Analysis:</strong> AI helps identify anomalies, detect potential risks, and improve financial planning.</li>
            <li><strong>Operational Optimisation:</strong> Intelligent analytics reveal process inefficiencies and recommend improvements.</li>
            <li><strong>Automated Reporting:</strong> Reports are generated automatically, reducing manual effort while increasing consistency and accuracy.</li>
          </ul>

          <h2>Traditional vs. AI-Powered Analytics</h2>
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                <th>Traditional Analytics</th>
                <th>AI-Powered Analytics</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Focus</td>
                <td>Historical Reporting (Descriptive)</td>
                <td>Forward-Looking Modeling (Predictive)</td>
              </tr>
              <tr>
                <td>Insight Derivation</td>
                <td>Manual spreadsheet analysis</td>
                <td>Automated pattern and anomaly detection</td>
              </tr>
              <tr>
                <td>Action Guidance</td>
                <td>Interpreted by analyst reports</td>
                <td>Recommends optimal operational decisions</td>
              </tr>
            </tbody>
          </table>

          <h2>Advantages of AI-Powered Analytics</h2>
          <ol>
            <li>Faster insights.</li>
            <li>Improved forecasting.</li>
            <li>Better strategic planning.</li>
            <li>Reduced manual effort.</li>
            <li>Increased operational efficiency.</li>
            <li>More confident decision-making.</li>
          </ol>

          <h2>Preparing for AI Adoption</h2>
          <p>Successful AI implementation requires high-quality data, clearly defined business objectives, strong governance, skilled teams, and continuous monitoring. AI should be viewed as a tool that enhances human expertise rather than replacing it.</p>

          <h2>Conclusion</h2>
          <p>Artificial Intelligence is transforming the way organisations analyse information and make strategic decisions. Businesses that combine AI with Business Intelligence and Data Analytics will be better equipped to innovate, improve efficiency, and create long-term competitive advantage.</p>
        `,
        cover_url: "https://picsum.photos/800/400?random=33",
        author_name: "K. V. Jacob",
        author_slug: "k-v-jacob",
        author_bio: "Founder & Director of KVJ Analytics. Leads corporate reporting automation consultancies and university practical analytics certifications.",
        category_title: "Artificial Intelligence",
        category_slug: "artificial-intelligence",
        published_at: "2026-07-10T09:00:00.000Z",
        featured: false,
        is_published: true,
        status: "published",
        display_order: 3,
        featured_flags: ["latest"],
        tags: ["artificial-intelligence", "ai", "predictive-analytics", "machine-learning"],
        seo_title: "AI Revolutionizing Business Analytics",
        seo_description: "Learn how machine learning and artificial intelligence are changing business forecasting and analytics dashboards.",
        seo_keywords: "artificial intelligence, machine learning, predictive analytics",
        authors_json: [
          {
            name: "K. V. Jacob",
            slug: "k-v-jacob",
            bio: "Founder & Director of KVJ Analytics. Leads corporate reporting automation consultancies and university practical analytics certifications.",
            avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            designation: "Director & Principal Consultant",
            company: "KVJ Analytics",
            is_featured: true,
            is_guest: false,
            social_links: { linkedin: "https://linkedin.com", twitter: "https://twitter.com" }
          }
        ],
        category_json: {
          title: "Artificial Intelligence",
          slug: "artificial-intelligence",
          icon: "Cpu",
          color: "brand",
          description: "Insights on machine learning models, predictive intelligence, and algorithmic forecasting.",
          featured: true,
          order: 3,
          visibility: true,
          seo: { title: "AI & Machine Learning in Business Analytics", description: "Discover predictive models, anomaly indicators, and neural networks." }
        },
        related_ids: ["post1", "post2"]
      }
    ],

  };
}

if (!globalForMockDb.mockStorage) {
  globalForMockDb.mockStorage = {};
}

export const mockDb = globalForMockDb.mockDb;

class MockSupabaseQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderFields: Array<{ column: string; ascending: boolean }> = [];
  private limitCount: number | null = null;
  private operation: "select" | "insert" | "update" | "delete" | "upsert" | null = null;
  private insertData: any[] = [];
  private updateData: any = null;
  private upsertData: any[] = [];
  private isSingle = false;
  private isMaybeSingle = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(fields?: string) {
    if (!this.operation) {
      this.operation = "select";
    }
    return this;
  }

  insert(data: any | any[]) {
    this.operation = "insert";
    this.insertData = Array.isArray(data) ? data : [data];
    return this;
  }

  update(data: any) {
    this.operation = "update";
    this.updateData = data;
    return this;
  }

  upsert(data: any | any[], options?: any) {
    this.operation = "upsert";
    this.upsertData = Array.isArray(data) ? data : [data];
    return this;
  }

  delete() {
    this.operation = "delete";
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => {
      // Check column value match (handling undefined fields gracefully)
      return item[column] === value;
    });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderFields.push({
      column,
      ascending: options?.ascending !== false,
    });
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  async execute() {
    const list = mockDb[this.tableName] || [];
    let error: any = null;
    let data: any = null;

    try {
      if (this.operation === "select" || !this.operation) {
        // Filter
        let filtered = [...list];
        for (const filterFn of this.filters) {
          filtered = filtered.filter(filterFn);
        }

        // Order
        for (const ord of this.orderFields) {
          filtered.sort((a, b) => {
            const av = a[ord.column];
            const bv = b[ord.column];
            if (av == null && bv != null) return ord.ascending ? -1 : 1;
            if (bv == null && av != null) return ord.ascending ? 1 : -1;
            if (av < bv) return ord.ascending ? -1 : 1;
            if (av > bv) return ord.ascending ? 1 : -1;
            return 0;
          });
        }

        // Limit
        if (this.limitCount !== null) {
          filtered = filtered.slice(0, this.limitCount);
        }

        const enrichRow = (item: any) => {
          if (!item) return item;
          const copy = { ...item };
          if (this.tableName === "unlock_codes") {
            const course = mockDb.courses?.find((c) => c.id === copy.course_id);
            copy.courses = course ? { title: course.title, slug: course.slug } : null;

            const college = mockDb.colleges?.find((c) => c.id === copy.college_id);
            copy.colleges = college ? { name: college.name } : null;

            const org = mockDb.clients?.find((c) => c.id === copy.organization_id);
            copy.clients = org ? { name: org.name } : null;
          } else if (this.tableName === "code_redemptions") {
            const code = mockDb.unlock_codes?.find((c) => c.id === copy.code_id);
            if (code) {
              const course = mockDb.courses?.find((c) => c.id === code.course_id);
              copy.unlock_codes = {
                ...code,
                courses: course ? { title: course.title } : null
              };
            }
            const profile = mockDb.profiles?.find((p) => p.id === copy.user_id);
            copy.profiles = profile ? { name: profile.name, email: profile.email || "student@kvjanalytics.in" } : null;

            const course = mockDb.courses?.find((c) => c.id === copy.course_id);
            copy.courses = course ? { title: course.title } : null;
          }
          return copy;
        };

        if (this.isSingle || this.isMaybeSingle) {
          data = filtered.length > 0 ? enrichRow(filtered[0]) : null;
        } else {
          data = filtered.map(enrichRow);
        }
      } else if (this.operation === "insert") {
        const newRows = this.insertData.map((row) => ({
          id: row.id || `row-${Math.random().toString(36).substring(2, 9)}`,
          created_at: new Date().toISOString(),
          ...row,
        }));

        list.push(...newRows);
        mockDb[this.tableName] = list;

        data = (this.isSingle || this.isMaybeSingle) ? (newRows.length > 0 ? newRows[0] : null) : newRows;
      } else if (this.operation === "update") {
        const updatedRows: any[] = [];
        mockDb[this.tableName] = list.map((item) => {
          let match = true;
          for (const filterFn of this.filters) {
            if (!filterFn(item)) {
              match = false;
              break;
            }
          }
          if (match) {
            const updated = { ...item, ...this.updateData, updated_at: new Date().toISOString() };
            updatedRows.push(updated);
            return updated;
          }
          return item;
        });

        if (this.isSingle || this.isMaybeSingle) {
          data = updatedRows.length > 0 ? updatedRows[0] : null;
        } else {
          data = updatedRows;
        }
      } else if (this.operation === "upsert") {
        const upsertedRows: any[] = [];
        for (const row of this.upsertData) {
          let index = -1;
          if (row.slug) {
            index = list.findIndex((item) => item.slug === row.slug);
          } else if (row.id) {
            index = list.findIndex((item) => item.id === row.id);
          }

          if (index > -1) {
            list[index] = { ...list[index], ...row, updated_at: new Date().toISOString() };
            upsertedRows.push(list[index]);
          } else {
            const newRow = {
              id: row.id || `row-${Math.random().toString(36).substring(2, 9)}`,
              created_at: new Date().toISOString(),
              ...row,
            };
            list.push(newRow);
            upsertedRows.push(newRow);
          }
        }
        mockDb[this.tableName] = list;
        data = this.isSingle ? upsertedRows[0] : upsertedRows;
      } else if (this.operation === "delete") {
        const beforeCount = list.length;
        const remaining = list.filter((item) => {
          let match = true;
          for (const filterFn of this.filters) {
            if (!filterFn(item)) {
              match = false;
              break;
            }
          }
          return !match;
        });
        mockDb[this.tableName] = remaining;
        data = { count: beforeCount - remaining.length };
      }
    } catch (e: any) {
      error = { message: e.message };
    }

    return { data, error };
  }

  // Thenable implementation to support direct await
  async then(onfulfilled: (value: any) => any) {
    const result = await this.execute();
    return onfulfilled(result);
  }
}

class MockSupabaseAuth {
  async getSession() {
    const loggedInUser = globalForMockDb.mockLoggedInUser || { id: "user1", email: "student@kvjanalytics.in" };
    return {
      data: {
        session: {
          user: loggedInUser,
          access_token: "mock-access-token",
        },
      },
      error: null,
    };
  }

  onAuthStateChange(callback: any) {
    const loggedInUser = globalForMockDb.mockLoggedInUser || { id: "user1", email: "student@kvjanalytics.in" };
    setTimeout(() => {
      callback("SIGNED_IN", { user: loggedInUser, access_token: "mock-access-token" });
    }, 0);
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  }

  async signUp(options: any) {
    const email = options.email;
    const user = {
      id: `usr-${Math.random().toString(36).substring(2, 9)}`,
      email,
      raw_user_meta_data: options.options?.data || {},
    };

    mockDb.profiles.push({
      id: user.id,
      name: user.raw_user_meta_data.name || "Student Demo",
      organization: user.raw_user_meta_data.organization || "Company/College",
      phone: user.raw_user_meta_data.phone || "",
      role: "student",
      created_at: new Date().toISOString(),
    });

    globalForMockDb.mockLoggedInUser = user;
    return { data: { user }, error: null };
  }

  async signInWithPassword(options: any) {
    const email = options.email;
    const profile = mockDb.profiles.find((p) => p.email === email) || {
      id: "user1",
      name: "Student Demo",
      role: "student",
    };

    const user = { id: profile.id, email };
    globalForMockDb.mockLoggedInUser = user;
    return {
      data: {
        user,
        session: { access_token: "mock-access-token", user },
      },
      error: null,
    };
  }

  async signOut() {
    globalForMockDb.mockLoggedInUser = null;
    return { error: null };
  }

  async getUser(token?: string) {
    const loggedInUser = globalForMockDb.mockLoggedInUser || { id: "user1", email: "student@kvjanalytics.in" };
    return {
      data: {
        user: loggedInUser,
      },
      error: null,
    };
  }

  get admin() {
    return {
      getUserById: async (user_id: string) => {
        const profile = mockDb.profiles.find((p) => p.id === user_id) || {
          id: user_id,
          name: "Student Demo",
          email: "student@kvjanalytics.in",
        };
        return {
          data: {
            user: {
              id: user_id,
              email: (profile as any).email || "student@kvjanalytics.in",
              user_metadata: {
                name: (profile as any).name || "Student Demo",
              },
            },
          },
          error: null,
        };
      },
    };
  }
}

export class MockSupabaseClient {
  from(tableName: string) {
    return new MockSupabaseQueryBuilder(tableName);
  }

  get auth() {
    return new MockSupabaseAuth();
  }

  get storage() {
    return {
      from: (bucketName: string) => {
        return {
          upload: async (path: string, buffer: Buffer, options?: any) => {
            const contentType = options?.contentType || "application/octet-stream";
            const base64 = buffer.toString("base64");
            const dataUrl = `data:${contentType};base64,${base64}`;

            globalForMockDb.mockStorage[path] = dataUrl;
            return { data: { path }, error: null };
          },
          getPublicUrl: (path: string) => {
            const publicUrl =
              globalForMockDb.mockStorage[path] ||
              `https://picsum.photos/400/300?random=${Math.random()}`;
            return { data: { publicUrl } };
          },
        };
      },
    };
  }
}

export const mockSupabaseClient = new MockSupabaseClient();
