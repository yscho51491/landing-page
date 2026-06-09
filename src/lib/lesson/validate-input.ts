import type { LessonInput } from "@/types/lesson";

const MAX_TOPIC = 200;
const MAX_REQUIREMENTS = 500;

export function parseLessonInput(body: unknown):
  | { ok: true; data: LessonInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "요청 형식이 올바르지 않습니다." };
  }

  const raw = body as Record<string, unknown>;
  const topic = String(raw.topic ?? "").trim();
  const audience = String(raw.audience ?? "").trim();
  const duration = String(raw.duration ?? "").trim();
  const requirements = String(raw.requirements ?? "").trim();

  if (!topic) {
    return { ok: false, error: "수업 주제를 입력해 주세요." };
  }
  if (!audience) {
    return { ok: false, error: "수업 대상을 선택해 주세요." };
  }
  if (!duration) {
    return { ok: false, error: "수업 시간을 선택해 주세요." };
  }
  if (topic.length > MAX_TOPIC) {
    return { ok: false, error: "수업 주제가 너무 깁니다." };
  }
  if (requirements.length > MAX_REQUIREMENTS) {
    return { ok: false, error: "필수 반영사항이 너무 깁니다." };
  }

  return {
    ok: true,
    data: { topic, audience, duration, requirements },
  };
}
