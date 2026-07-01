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
    team_members: [
      {
        id: "tm1",
        name: "Ajay Thomas",
        role: "Lead Consultant & Trainer",
        bio: "Over 16 years of expertise in spreadsheet automation, custom macros, Power BI development, and academic analytics consulting.",
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
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
    unlock_codes: [
      { id: "uc1", code: "123456", course_id: "c3", batch_label: "Beta Cohort", max_uses: 10, used_count: 0, expires_at: new Date(Date.now() + 10 * 86400000).toISOString(), is_active: true }
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
    this.operation = "select";
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

        if (this.isSingle) {
          if (filtered.length === 0) {
            throw new Error("No rows found matching query.");
          }
          data = filtered[0];
        } else if (this.isMaybeSingle) {
          data = filtered.length > 0 ? filtered[0] : null;
        } else {
          data = filtered;
        }
      } else if (this.operation === "insert") {
        const newRows = this.insertData.map((row) => ({
          id: row.id || `row-${Math.random().toString(36).substring(2, 9)}`,
          created_at: new Date().toISOString(),
          ...row,
        }));

        list.push(...newRows);
        mockDb[this.tableName] = list;

        data = this.isSingle ? newRows[0] : newRows;
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

        if (this.isSingle) {
          if (updatedRows.length === 0) {
            throw new Error("No rows matched for update.");
          }
          data = updatedRows[0];
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
