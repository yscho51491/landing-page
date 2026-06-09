import * as lessonParse from "@/lib/lesson/parse-output";
import type { LessonInput, LessonResult } from "@/types/lesson";

export async function fetchGenerateLesson(
  input: LessonInput,
): Promise<LessonResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const response = await fetch("/api/generate-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    const text = await response.text();
    let data: unknown = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(
        response.status === 404
          ? "API가 배포되지 않았습니다. git push 후 Vercel 재배포를 확인해 주세요."
          : "서버 응답을 읽을 수 없습니다.",
      );
    }

    const errorBody = data as { error?: string } | null;
    if (!response.ok) {
      throw new Error(errorBody?.error ?? `요청 실패 (${response.status})`);
    }

    const parsed = lessonParse.parseLessonResult(data);
    if (!parsed) {
      throw new Error(
        "AI 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해 주세요.",
      );
    }

    return parsed;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("요청 시간이 초과되었습니다. 다시 시도해 주세요.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
