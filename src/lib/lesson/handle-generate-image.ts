import { generateLessonImageAsset } from "@/lib/lesson/generate-image";
import { parseLessonInput } from "@/lib/lesson/validate-input";
import * as lessonParse from "@/lib/lesson/parse-output";
import { createClient } from "@/lib/supabase/server";
import type { ImageAssetKind, LessonInput, LessonResult } from "@/types/lesson";
import OpenAI from "openai";
import { NextResponse } from "next/server";

type GenerateImageBody = {
  kind?: ImageAssetKind;
  index?: number;
  input?: LessonInput;
  output?: LessonResult;
};

function parseBody(body: unknown): GenerateImageBody {
  if (!body || typeof body !== "object") {
    return {};
  }
  return body as GenerateImageBody;
}

export async function handleGenerateImagePost(request: Request) {
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

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문을 읽을 수 없습니다." },
      { status: 400 },
    );
  }

  const body = parseBody(rawBody);
  const kind = body.kind;
  const index = body.index;

  if (kind !== "worksheet" && kind !== "sampleArt") {
    return NextResponse.json({ error: "유효하지 않은 kind입니다." }, { status: 400 });
  }

  if (typeof index !== "number" || index < 0) {
    return NextResponse.json({ error: "index가 필요합니다." }, { status: 400 });
  }

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

  try {
    const imageDataUrl = await generateLessonImageAsset(apiKey, {
      kind,
      input,
      output,
      index,
    });

    return NextResponse.json({
      kind,
      index,
      imageDataUrl,
    });
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      if (err.status === 401) {
        return NextResponse.json(
          { error: "OpenAI API 키가 올바르지 않습니다." },
          { status: 500 },
        );
      }
      if (err.code === "insufficient_quota") {
        return NextResponse.json(
          {
            error:
              "OpenAI 사용 한도가 부족합니다. Billing 설정을 확인해 주세요.",
          },
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

    const code = err instanceof Error ? err.message : "IMAGE_FAILED";
    return NextResponse.json(
      { error: `이미지 생성에 실패했습니다. (${code})` },
      { status: 500 },
    );
  }
}
