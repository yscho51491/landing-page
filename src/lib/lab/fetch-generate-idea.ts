import type { LabLessonIdea } from "@/types/lab";

export async function fetchGenerateIdea(
  word1: string,
  word2: string,
): Promise<LabLessonIdea> {
  const res = await fetch("/api/lab/generate-idea", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word1, word2 }),
  });

  const data = (await res.json()) as { idea?: LabLessonIdea; error?: string };
  if (!res.ok || !data.idea) {
    throw new Error(data.error ?? "아이디어 생성에 실패했습니다.");
  }
  return data.idea;
}
