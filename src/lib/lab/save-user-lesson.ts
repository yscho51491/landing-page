import type { LabLessonIdea } from "@/types/lab";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function saveUserLabLesson(
  supabase: SupabaseClient,
  userId: string,
  words: [string, string],
  idea: LabLessonIdea,
): Promise<{ id: string } | { error: string }> {
  const { data, error } = await supabase
    .from("user_lab_lessons")
    .insert({
      user_id: userId,
      word1: words[0],
      word2: words[1],
      lesson_detail: idea,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.warn("[save-user-lab-lesson] insert failed:", error?.message);
    return { error: error?.message ?? "수업 저장에 실패했습니다." };
  }

  return { id: data.id };
}

export async function updateUserLabLessonCover(
  supabase: SupabaseClient,
  userId: string,
  lessonId: string,
  coverImageUrl: string,
): Promise<void> {
  const { error } = await supabase
    .from("user_lab_lessons")
    .update({ cover_image_url: coverImageUrl })
    .eq("id", lessonId)
    .eq("user_id", userId);

  if (error) {
    console.warn("[save-user-lab-lesson] cover update failed:", error.message);
  }
}
