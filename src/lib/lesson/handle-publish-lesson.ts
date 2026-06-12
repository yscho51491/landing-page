import * as lessonParse from "@/lib/lesson/parse-output";
import { parseLessonInput } from "@/lib/lesson/validate-input";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type PublishBody = {
  input?: unknown;
  output?: unknown;
  coverImageDataUrl?: unknown;
};

const DATA_URL_PATTERN = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/;

export async function handlePublishLessonPost(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문을 읽을 수 없습니다." },
      { status: 400 },
    );
  }

  const body = (rawBody ?? {}) as PublishBody;

  const parsedInput = parseLessonInput(body.input);
  if (!parsedInput.ok) {
    return NextResponse.json({ error: parsedInput.error }, { status: 400 });
  }
  const input = parsedInput.data;

  const output = lessonParse.parseLessonResult(body.output);
  if (!output) {
    return NextResponse.json(
      { error: "수업 결과 데이터가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const coverImageDataUrl =
    typeof body.coverImageDataUrl === "string" ? body.coverImageDataUrl : "";
  const match = coverImageDataUrl.match(DATA_URL_PATTERN);
  if (!match) {
    return NextResponse.json(
      { error: "커버 이미지 데이터가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const [, imageExt, base64Data] = match;
  const buffer = Buffer.from(base64Data, "base64");
  const storagePath = `${user.id}/${crypto.randomUUID()}.${imageExt}`;

  const { error: uploadError } = await supabase.storage
    .from("lesson-covers")
    .upload(storagePath, buffer, {
      contentType: `image/${imageExt}`,
    });

  if (uploadError) {
    console.error("[publish-lesson] storage upload", uploadError);
    return NextResponse.json(
      {
        error:
          "커버 이미지 업로드에 실패했습니다. Supabase에 lesson-covers 버킷이 있는지 확인해 주세요.",
      },
      { status: 500 },
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("lesson-covers").getPublicUrl(storagePath);

  const { data: inserted, error: insertError } = await supabase
    .from("published_lessons")
    .insert({
      user_id: user.id,
      title: output.lessonPlan.title || input.topic,
      audience: input.audience,
      idea: output.lessonPlan.overview,
      materials: output.lessonPlan.materials,
      cover_image_url: publicUrl,
      is_public: true,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[publish-lesson] insert", insertError);
    return NextResponse.json(
      {
        error:
          "수업 공개 저장에 실패했습니다. published_lessons 테이블과 RLS 정책을 확인해 주세요.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: inserted.id });
}
