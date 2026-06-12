import type { LabLessonIdea } from "@/types/lab";

export type GenerateIdeaResult = {
  idea: LabLessonIdea;
  lessonId?: string;
};

export async function fetchGenerateIdea(
  word1: string,
  word2: string,
): Promise<GenerateIdeaResult> {
  const res = await fetch("/api/lab/generate-idea", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word1, word2 }),
  });

  const data = (await res.json()) as {
    idea?: LabLessonIdea;
    lessonId?: string;
    error?: string;
  };
  if (!res.ok || !data.idea) {
    throw new Error(data.error ?? "아이디어 생성에 실패했습니다.");
  }
  return { idea: data.idea, lessonId: data.lessonId };
}
