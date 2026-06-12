import type { SupabaseClient } from "@supabase/supabase-js";

const DATA_URL_PATTERN =
  /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/;

export async function uploadLessonCoverImage(
  supabase: SupabaseClient,
  userId: string,
  coverImageDataUrl: string,
): Promise<{ publicUrl: string } | { error: string }> {
  const match = coverImageDataUrl.match(DATA_URL_PATTERN);
  if (!match) {
    return { error: "커버 이미지 데이터가 올바르지 않습니다." };
  }

  const [, imageExt, base64Data] = match;
  const buffer = Buffer.from(base64Data, "base64");
  const storagePath = `${userId}/${crypto.randomUUID()}.${imageExt}`;

  const { error: uploadError } = await supabase.storage
    .from("lesson-covers")
    .upload(storagePath, buffer, {
      contentType: `image/${imageExt}`,
    });

  if (uploadError) {
    console.error("[upload-cover-image]", uploadError);
    return {
      error:
        "이미지 업로드에 실패했습니다. lesson-covers 버킷 설정을 확인해 주세요.",
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("lesson-covers").getPublicUrl(storagePath);

  return { publicUrl };
}
