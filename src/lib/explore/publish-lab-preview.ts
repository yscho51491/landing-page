import { uploadLessonCoverImage } from "@/lib/storage/upload-cover-image";
import type { LabLessonIdea } from "@/types/lab";
import type { SupabaseClient } from "@supabase/supabase-js";

function flattenMaterials(idea: LabLessonIdea): string[] {
  return idea.materials.flatMap((g) =>
    g.items.map((item) =>
      g.category ? `${g.category}: ${item}` : item,
    ),
  );
}

/** 실험실 완성작 미리보기 → 메인 그리드 공개 */
export async function publishLabPreviewToExplore(
  supabase: SupabaseClient,
  userId: string,
  idea: LabLessonIdea,
  words: [string, string],
  imageDataUrl: string,
): Promise<{ id: string } | { error: string }> {
  const uploaded = await uploadLessonCoverImage(
    supabase,
    userId,
    imageDataUrl,
  );
  if ("error" in uploaded) {
    return uploaded;
  }

  const baseRow = {
    user_id: userId,
    title: idea.title,
    audience: `${words[0]} × ${words[1]}`,
    idea: idea.overview,
    materials: flattenMaterials(idea),
    cover_image_url: uploaded.publicUrl,
    is_public: true,
  };

  const { data: fullInsert, error: fullError } = await supabase
    .from("published_lessons")
    .insert({
      ...baseRow,
      lesson_detail: idea,
      source: "lab",
    })
    .select("id")
    .single();

  if (!fullError && fullInsert) {
    return { id: fullInsert.id };
  }

  if (fullError) {
    console.warn(
      "[publish-lab-preview] full insert failed, retrying minimal:",
      fullError.message,
    );
  }

  const { data: minimalInsert, error: minimalError } = await supabase
    .from("published_lessons")
    .insert(baseRow)
    .select("id")
    .single();

  if (minimalError || !minimalInsert) {
    console.error("[publish-lab-preview] insert", minimalError ?? fullError);
    return {
      error:
        minimalError?.message ??
        fullError?.message ??
        "메인 공개 저장에 실패했습니다. published_lessons 테이블을 확인해 주세요.",
    };
  }

  return { id: minimalInsert.id };
}
