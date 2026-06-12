import type { LabLessonIdea } from "@/types/lab";

export type LabPreviewResult = {
  imageDataUrl: string;
  coins: number;
  notice: string;
  publishedToMain?: boolean;
  publishError?: string;
};

export async function fetchPreviewArtwork(
  idea: LabLessonIdea,
  words: [string, string],
): Promise<LabPreviewResult> {
  const res = await fetch("/api/lab/preview-artwork", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, words }),
  });

  const data = (await res.json()) as LabPreviewResult & { error?: string };
  if (!res.ok || !data.imageDataUrl) {
    throw new Error(data.error ?? "완성작 미리보기에 실패했습니다.");
  }

  return data;
}
