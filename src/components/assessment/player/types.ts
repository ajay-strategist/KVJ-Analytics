export interface Lesson {
  id: string;
  title: string;
  kind: "material" | "activity" | "assessment";
  max_score: number | null;
  video_url?: string | null;
  content_html?: string | null;
  moduleTitle?: string;
  moduleIdx?: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface EnrichedModule extends Module {
  displayTitle: string;
}

export interface ContentPlayerClientProps {
  course: {
    id: string;
    title: string;
    slug: string;
  };
  modules: Module[];
  /** Admin preview mode — verified server-side via the admin session cookie. Skips the
   *  login + enrollment gate so an admin can review the materials exactly as a student sees
   *  them, without paying or enrolling. Progress is never saved in this mode. */
  adminPreview?: boolean;
  initialLessonId?: string | null;
}

export interface ActivityResult {
  score: number;
  maxScore: number;
}

