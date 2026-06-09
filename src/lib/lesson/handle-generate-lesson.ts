import { generateLessonText } from "@/lib/lesson/generate-text";
import { parseLessonInput } from "@/lib/lesson/validate-input";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function handleGenerateLessonPost(request: Request) {
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

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY가 설정되지 않았습니다. .env.local에 키를 추가한 뒤 서버를 재시작해 주세요.",
      },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문을 읽을 수 없습니다." },
      { status: 400 },
    );
  }

  const parsed = parseLessonInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const output = await generateLessonText(parsed.data, apiKey);
    return NextResponse.json(output);
  } catch (err) {
    const code = err instanceof Error ? err.message : "UNKNOWN";

    if (
      code === "OPENAI_EMPTY" ||
      code === "OPENAI_PARSE" ||
      code === "OPENAI_INVALID_SHAPE"
    ) {
      return NextResponse.json(
        {
          error:
            "AI 응답 LessonResult JSON 형식이 올바르지 않습니다. 다시 시도해 주세요.",
        },
        { status: 502 },
      );
    }

    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) {
        return NextResponse.json(
          {
            error:
              "OpenAI API 키가 올바르지 않습니다. .env.local을 확인해 주세요.",
          },
          { status: 500 },
        );
      }
      if (err.status === 429) {
        const isQuota =
          err.code === "insufficient_quota" ||
          err.message.toLowerCase().includes("quota");
        return NextResponse.json(
          {
            error: isQuota
              ? "OpenAI 사용 한도(크레딧)가 부족합니다. platform.openai.com → Settings → Billing에서 결제 수단·잔액을 확인해 주세요."
              : "OpenAI 요청 한도에 걸렸습니다. 1~2분 뒤에 다시 시도해 주세요.",
          },
          { status: 429 },
        );
      }
    }

    console.error("[generate-lesson]", err);
    return NextResponse.json(
      { error: "수업자료 생성에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
