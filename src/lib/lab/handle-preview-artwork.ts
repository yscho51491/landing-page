import {
  PREVIEW_COST,
  refundArtlabCoins,
  spendArtlabCoins,
} from "@/lib/coins/spend-coins";
import { publishLabPreviewToExplore } from "@/lib/explore/publish-lab-preview";
import { generateLabPreviewImage } from "@/lib/lab/generate-preview-image";
import { isImageSafetyRejection } from "@/lib/lab/preview-image-prompt";
import { parseLabLessonIdea } from "@/lib/lab/parse-idea";
import { createClient } from "@/lib/supabase/server";
import type { LabLessonIdea } from "@/types/lab";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type PreviewBody = {
  idea?: unknown;
  words?: unknown;
};

function parseWords(value: unknown): [string, string] | null {
  if (!Array.isArray(value) || value.length !== 2) return null;
  const w1 = typeof value[0] === "string" ? value[0].trim() : "";
  const w2 = typeof value[1] === "string" ? value[1].trim() : "";
  if (!w1 || !w2 || w1.length > 10 || w2.length > 10) return null;
  return [w1, w2];
}

export async function handlePreviewArtworkPost(request: Request) {
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

  const body = (rawBody ?? {}) as PreviewBody;
  const words = parseWords(body.words);
  const idea = parseLabLessonIdea(body.idea);

  if (!words || !idea) {
    return NextResponse.json(
      { error: "수업 아이디어 데이터가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const spend = await spendArtlabCoins(PREVIEW_COST);
  if (!spend.ok) {
    if (spend.code === "INSUFFICIENT_COINS") {
      return NextResponse.json(
        { error: "보유 아트랩코인이 부족합니다." },
        { status: 402 },
      );
    }
    return NextResponse.json(
      { error: "코인 차감에 실패했습니다." },
      { status: 500 },
    );
  }

  try {
    const imageDataUrl = await generateLabPreviewImage(apiKey, idea, words);

    const published = await publishLabPreviewToExplore(
      supabase,
      user.id,
      idea,
      words,
      imageDataUrl,
    );

    const publishedToMain = "id" in published;
    const publishError =
      "error" in published ? published.error : undefined;

    if (publishedToMain) {
      revalidatePath("/");
    } else if (publishError) {
      console.warn("[lab-preview-artwork] publish failed:", publishError);
    }

    const notice = publishedToMain
      ? "아트랩코인 1개가 차감되었습니다. 완성작이 메인 화면에 공개되었어요."
      : "아트랩코인 1개가 차감되었습니다.";

    return NextResponse.json({
      imageDataUrl,
      coins: spend.balance,
      notice,
      publishedToMain,
      publishError,
      publishedId: publishedToMain ? published.id : undefined,
    });
  } catch (err) {
    await refundArtlabCoins(PREVIEW_COST);

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
      if (err.status === 400 && isImageSafetyRejection(err)) {
        return NextResponse.json(
          {
            error:
              "이미지 안전 필터에 걸렸습니다. 코인은 환불되었으니 다시 시도해 주세요.",
          },
          { status: 422 },
        );
      }
    }

    if (isImageSafetyRejection(err)) {
      return NextResponse.json(
        {
          error:
            "이미지 안전 필터에 걸렸습니다. 코인은 환불되었으니 다시 시도해 주세요.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { error: "완성작 미리보기 생성에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
