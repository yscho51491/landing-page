import { parseLabLessonIdea } from "@/lib/lab/parse-idea";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { LabLessonIdea } from "@/types/lab";

export type MyLabLesson = {
  id: string;
  words: [string, string];
  idea: LabLessonIdea;
  coverImageUrl: string | null;
  createdAt: string;
};

type UserLabLessonRow = {
  id: string;
  word1: string;
  word2: string;
  lesson_detail: unknown;
  cover_image_url: string | null;
  created_at: string;
};

function rowToMyLabLesson(row: UserLabLessonRow): MyLabLesson | null {
  const idea = parseLabLessonIdea(row.lesson_detail);
  if (!idea) return null;

  return {
    id: row.id,
    words: [row.word1, row.word2],
    idea,
    coverImageUrl: row.cover_image_url,
    createdAt: row.created_at,
  };
}

/** 로그인 사용자의 실험실 수업 목록 (최신순) */
export async function getMyLabLessons(userId: string): Promise<MyLabLesson[]> {
  if (!hasSupabaseEnv()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_lab_lessons")
      .select("id, word1, word2, lesson_detail, cover_image_url, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error || !data) {
      if (error) {
        console.error("[my] user_lab_lessons select", error.message);
      }
      return [];
    }

    return (data as UserLabLessonRow[])
      .map(rowToMyLabLesson)
      .filter((item): item is MyLabLesson => item !== null);
  } catch (err) {
    console.error("[my] user_lab_lessons fetch", err);
    return [];
  }
}
