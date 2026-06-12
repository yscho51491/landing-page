import type { LessonExample } from "@/data/lessonExamples";
import { parseLabLessonIdea } from "@/lib/lab/parse-idea";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { LabLessonIdea } from "@/types/lab";

export type PublishedExploreData = {
  items: LessonExample[];
  details: Record<string, LabLessonIdea>;
};

type PublishedLessonRow = {
  id: string;
  title: string;
  audience: string;
  idea: string;
  materials: string[];
  cover_image_url: string;
  lesson_detail?: unknown;
};

const SELECT_FULL =
  "id, title, audience, idea, materials, cover_image_url, lesson_detail";
const SELECT_BASE =
  "id, title, audience, idea, materials, cover_image_url";

function rowToExploreEntry(row: PublishedLessonRow): {
  item: LessonExample;
  detail: LabLessonIdea;
} {
  const id = `published-${row.id}`;

  const item: LessonExample = {
    id,
    imageSrc: row.cover_image_url,
    imageAlt: `${row.title} 수업 완성작`,
    title: row.title,
    aspect: "2:3",
  };

  const parsedDetail = parseLabLessonIdea(row.lesson_detail);
  const detail: LabLessonIdea = parsedDetail ?? {
    title: row.title,
    overview: row.idea,
    goals: [],
    materials:
      row.materials.length > 0
        ? [{ category: "재료", items: row.materials }]
        : [],
    process: [],
    expectedEffects: [],
  };

  return { item, detail };
}

/** 메인 그리드에 표시할 공개 수업 목록 + 상세 (최신순) */
export async function getPublishedLessonExamples(): Promise<PublishedExploreData> {
  if (!hasSupabaseEnv()) {
    return { items: [], details: {} };
  }

  try {
    const supabase = await createClient();

    let data: PublishedLessonRow[] | null = null;

    const full = await supabase
      .from("published_lessons")
      .select(SELECT_FULL)
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(40);

    if (!full.error && full.data) {
      data = full.data as PublishedLessonRow[];
    } else if (full.error) {
      console.warn(
        "[explore] full select failed, retrying base columns:",
        full.error.message,
      );

      const base = await supabase
        .from("published_lessons")
        .select(SELECT_BASE)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(40);

      if (base.error || !base.data) {
        console.error("[explore] published_lessons select", base.error?.message);
        return { items: [], details: {} };
      }

      data = base.data as PublishedLessonRow[];
    }

    if (!data || data.length === 0) {
      return { items: [], details: {} };
    }

    const items: LessonExample[] = [];
    const details: Record<string, LabLessonIdea> = {};

    for (const row of data) {
      const { item, detail } = rowToExploreEntry(row);
      items.push(item);
      details[item.id] = detail;
    }

    return { items, details };
  } catch (err) {
    console.error("[explore] published_lessons fetch", err);
    return { items: [], details: {} };
  }
}
