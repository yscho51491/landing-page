import { generateLabIdea } from "@/lib/lab/generate-idea";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { NextResponse } from "next/server";

function parseWord(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const word = value.trim();
  if (word.length === 0 || word.length > 10) return null;
  return word;
}

export async function handleGenerateIdeaPost(request: Request) {
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
      { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
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

  const { word1: rawWord1, word2: rawWord2 } = (body ?? {}) as {
    word1?: unknown;
    word2?: unknown;
  };

  const word1 = parseWord(rawWord1);
  const word2 = parseWord(rawWord2);

  if (!word1 || !word2) {
    return NextResponse.json(
      { error: "단어 2개를 각각 1~10자로 입력해주세요." },
      { status: 400 },
    );
  }

  try {
    const idea = await generateLabIdea(apiKey, word1, word2);
    return NextResponse.json({ idea });
  } catch (err) {
    const code = err instanceof Error ? err.message : "UNKNOWN";

    if (
      code === "OPENAI_EMPTY" ||
      code === "OPENAI_PARSE" ||
      code === "OPENAI_INVALID_SHAPE"
    ) {
      return NextResponse.json(
        { error: "AI 응답 형식이 올바르지 않습니다. 다시 시도해 주세요." },
        { status: 502 },
      );
    }

    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) {
        return NextResponse.json(
          { error: "OpenAI API 키가 올바르지 않습니다." },
          { status: 500 },
        );
      }
      if (err.code === "insufficient_quota") {
        return NextResponse.json(
          { error: "OpenAI 사용 한도가 부족합니다. Billing 설정을 확인해 주세요." },
          { status: 402 },
        );
      }
      if (err.status === 429) {
        return NextResponse.json(
          { error: "요청이 많습니다. 잠시 후 다시 시도해 주세요." },
          { status: 429 },
        );
      }
    }

    console.error("[lab-generate-idea]", err);
    return NextResponse.json(
      { error: "아이디어 생성에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
