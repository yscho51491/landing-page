import { IMAGE_GEN_SETTINGS } from "@/lib/lesson/image-config";
import {
  buildLabPreviewImagePrompt,
  buildLabPreviewImagePromptFallback,
  isImageSafetyRejection,
} from "@/lib/lab/preview-image-prompt";
import type { LabLessonIdea } from "@/types/lab";
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

async function requestImage(
  openai: OpenAI,
  prompt: string,
  settings: (typeof IMAGE_GEN_SETTINGS)["sampleArt"],
): Promise<string> {
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

export async function generateLabPreviewImage(
  apiKey: string,
  idea: LabLessonIdea,
  words: [string, string],
): Promise<string> {
  const settings = IMAGE_GEN_SETTINGS.sampleArt;
  const openai = new OpenAI({ apiKey });

  const prompts = [
    buildLabPreviewImagePrompt(idea, words),
    buildLabPreviewImagePromptFallback(idea, words),
  ];

  let lastError: unknown;

  for (const prompt of prompts) {
    try {
      return await requestImage(openai, prompt, settings);
    } catch (err) {
      lastError = err;
      if (isImageSafetyRejection(err) && prompt !== prompts[prompts.length - 1]) {
        console.warn("[lab-preview-image] safety rejection, retrying with fallback prompt");
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error("IMAGE_FAILED");
}
