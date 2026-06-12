import {
  buildSampleArtImagePrompt,
  buildWorksheetImagePrompt,
} from "@/lib/lesson/image-prompts";
import { IMAGE_GEN_SETTINGS } from "@/lib/lesson/image-config";
import type { ImageAssetKind, LessonInput, LessonResult } from "@/types/lesson";
import OpenAI from "openai";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callWithRateLimitRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const retryable =
      err instanceof OpenAI.APIError &&
      err.status === 429 &&
      err.code !== "insufficient_quota";
    if (!retryable) {
      throw err;
    }
    await sleep(3000);
    return fn();
  }
}

function buildPrompt(
  kind: ImageAssetKind,
  input: LessonInput,
  output: LessonResult,
  index: number,
): string {
  if (kind === "worksheet") {
    return buildWorksheetImagePrompt(input, output, index);
  }
  return buildSampleArtImagePrompt(input, output, index);
}

export async function generateLessonImageAsset(
  apiKey: string,
  params: {
    kind: ImageAssetKind;
    input: LessonInput;
    output: LessonResult;
    index: number;
  },
): Promise<string> {
  const settings = IMAGE_GEN_SETTINGS[params.kind];
  const prompt = buildPrompt(
    params.kind,
    params.input,
    params.output,
    params.index,
  );

  const openai = new OpenAI({ apiKey });

  const response = await callWithRateLimitRetry(() =>
    openai.images.generate({
      model: settings.model,
      prompt,
      size: settings.size,
      quality: settings.quality,
      n: 1,
    }),
  );

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("IMAGE_EMPTY");
  }

  return `data:image/png;base64,${b64}`;
}
