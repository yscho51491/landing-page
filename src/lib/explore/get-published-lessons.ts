import type { LessonExample } from "@/data/lessonExamples";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { LabLessonIdea } from "@/types/lab";

type PublishedLessonRow = {
  id: string;
  title: string;
  audience: string;
  idea: string;
  materials: string[];
  cover_image_url: string;
};

export type PublishedExploreData = {
  items: LessonExample[];
  details: Record<string, LabLessonIdea>;
};

/** 메인 그리드에 표시할 공개 수업 목록 + 상세 (최신순) */
export async function getPublishedLessonExamples(): Promise<PublishedExploreData> {
  if (!hasSupabaseEnv()) {
    return { items: [], details: {} };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("published_lessons")
      .select("id, title, audience, idea, materials, cover_image_url")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(40);

    if (error || !data) {
      if (error) {
        console.error("[explore] published_lessons select", error.message);
      }
      return { items: [], details: {} };
    }

    const items: LessonExample[] = [];
    const details: Record<string, LabLessonIdea> = {};

    for (const row of data as PublishedLessonRow[]) {
      const id = `published-${row.id}`;

      // 생성 이미지는 1024x1536(2:3) — 원본 비율 그대로 표시됨
      items.push({
        id,
        imageSrc: row.cover_image_url,
        imageAlt: `${row.title} 수업 완성작`,
        title: row.title,
        aspect: "2:3",
      });

      details[id] = {
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
    }

    return { items, details };
  } catch (err) {
    console.error("[explore] published_lessons fetch", err);
    return { items: [], details: {} };
  }
}
