import React from "react";
import { supabase } from "@/lib/supabase";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_TRAINING_HUB } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
import { TrainingHubClient } from "@/components/TrainingHubClient";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "Training — Power BI, Excel, Data Analytics Courses & Programs",
  description:
    "Practical, placement-focused training in Advanced Excel, Power BI, Data Analytics, dashboards and automation. Online courses, corporate & college programs, one-to-one mentoring and internships.",
  path: "/training",
  keywords: ["Power BI training", "Excel training", "data analytics course", "corporate training", "college training", "online analytics courses", "internships"],
});

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  type: "self_serve" | "inquiry";
}

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "cat1",
    slug: "one-to-one",
    name: "One-to-One",
    description: "Personalized mentoring sessions tailored for custom growth plans.",
    image_url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800",
    type: "inquiry",
  },
  {
    id: "cat2",
    slug: "corporate",
    name: "Corporate",
    description: "Dedicated team automation, reports, and analytical solutions training.",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    type: "inquiry",
  },
  {
    id: "cat3",
    slug: "colleges",
    name: "Colleges",
    description: "Curriculum partnerships and evaluation systems for students and academies.",
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    type: "inquiry",
  },
  {
    id: "cat4",
    slug: "online-courses",
    name: "Online Courses",
    description: "Self-paced video courses for professional spreadsheet modeling and analytics.",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    type: "self_serve",
  },
  {
    id: "cat5",
    slug: "internships",
    name: "Internships",
    description: "Hands-on project experience with placement-focused learning paths.",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
    type: "self_serve",
  },
];

export default async function TrainingHubPage() {
  let categories: Category[] = [];

  try {
    const { data, error } = await supabase
      .from("course_categories")
      .select("id, slug, name, description, image_url, type")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      categories = data.map((cat: any) => ({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description || "",
        image_url: cat.image_url || FALLBACK_CATEGORIES.find(c => c.slug === cat.slug)?.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        type: cat.type as any,
      }));
    }
  } catch (err) {
    console.warn("Supabase category fetch error, falling back:", err);
  }

  if (categories.length === 0) {
    categories = FALLBACK_CATEGORIES;
  }

  // Editable page content (admin-managed via /admin/content → "Training Hub")
  const hub = mergePageContent(await getPageContent("training"), FALLBACK_TRAINING_HUB);

  return (
    <TrainingHubClient
      categories={categories}
      hub={hub as any}
    />
  );
}
