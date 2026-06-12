import {
  IMAGE_GEN_SETTINGS,
  SAMPLE_ART_IMAGE_COUNT,
  WORKSHEET_IMAGE_COUNT,
} from "@/lib/lesson/image-config";
import type { ImageAssetKind, LessonInput, LessonResult } from "@/types/lesson";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "요청에 실패했습니다.");
  }
  return data;
}

export async function fetchSingleLessonImage(
  kind: ImageAssetKind,
  input: LessonInput,
  output: LessonResult,
  index: number,
): Promise<string> {
  const data = await postJson<{ imageDataUrl: string }>(
    "/api/lessons/generate-image",
    {
      kind,
      index,
      input,
      output,
    },
  );
  return data.imageDataUrl;
}

export type ImageGenerationProgress = {
  completed: number;
  total: number;
  label: string;
};

export async function fetchImageAssetSet(
  kind: ImageAssetKind,
  input: LessonInput,
  output: LessonResult,
  onProgress?: (progress: ImageGenerationProgress) => void,
): Promise<{ images: string[] }> {
  const settings = IMAGE_GEN_SETTINGS[kind];
  const images: string[] = [];

  const count =
    kind === "worksheet" ? WORKSHEET_IMAGE_COUNT : SAMPLE_ART_IMAGE_COUNT;

  for (let i = 0; i < count; i++) {
    const imageDataUrl = await fetchSingleLessonImage(
      kind,
      input,
      output,
      i,
    );
    images.push(imageDataUrl);
    onProgress?.({
      completed: i + 1,
      total: settings.count,
      label: `${i + 1}/${count} 생성 완료`,
    });
  }

  return { images };
}
