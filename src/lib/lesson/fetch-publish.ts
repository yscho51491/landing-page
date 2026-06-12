import type { LessonInput, LessonResult } from "@/types/lesson";

export async function fetchPublishLesson(
  input: LessonInput,
  output: LessonResult,
  coverImageDataUrl: string,
): Promise<{ id: string }> {
  const res = await fetch("/api/lessons/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, output, coverImageDataUrl }),
  });

  const data = (await res.json()) as { id?: string; error?: string };
  if (!res.ok || !data.id) {
    throw new Error(data.error ?? "수업 공개에 실패했습니다.");
  }
  return { id: data.id };
}
