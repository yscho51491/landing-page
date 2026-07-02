import type { LabLessonDirection } from "@/types/lab";

export async function fetchProposeDirections(
  word1: string,
  word2: string,
): Promise<LabLessonDirection[]> {
  const res = await fetch("/api/lab/propose-directions", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word1, word2 }),
  });

  const data = (await res.json()) as {
    directions?: LabLessonDirection[];
    error?: string;
  };

  if (!res.ok || !data.directions?.length) {
    throw new Error(data.error ?? "수업 방향 제안에 실패했습니다.");
  }

  return data.directions;
}
