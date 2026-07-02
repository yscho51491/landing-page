import type { LabLessonDirection } from "@/types/lab";

export const LAB_DIRECTION_SYSTEM_PROMPT = `당신은 유치부·초등·중고등·미술학원 수업을 기획하는 키즈아트 수업기획 전문가입니다.
사용자가 제시한 두 단어를 결합해, 서로 다른 미술 수업 방향 3가지를 제안합니다.

【원칙】
1. 3개 방향은 서로 다른 접근(재료·표현·스토리·활동 형태)이어야 합니다.
2. 각 방향은 실제 미술 수업으로 바로 확장 가능해야 합니다.
3. title은 15~25자, intro는 한 줄(40~60자)로 호기심을 끌게 작성합니다.
4. 모든 텍스트는 한국어로만 작성합니다.

반드시 아래 JSON 형식으로만 응답:
{
  "directions": [
    { "id": "1", "title": "수업 방향 제목", "intro": "한 줄 소개" },
    { "id": "2", "title": "수업 방향 제목", "intro": "한 줄 소개" },
    { "id": "3", "title": "수업 방향 제목", "intro": "한 줄 소개" }
  ]
}`;

export function buildLabDirectionUserPrompt(word1: string, word2: string): string {
  return `두 단어: "${word1}" + "${word2}"

이 두 단어를 결합한 미술 수업 방향을 서로 다르게 3가지 제안하세요.
각 방향은 title과 intro(한 줄)만 포함합니다.`;
}

export function parseLabLessonDirections(raw: unknown): LabLessonDirection[] | null {
  if (!raw || typeof raw !== "object") return null;
  const list = (raw as { directions?: unknown }).directions;
  if (!Array.isArray(list) || list.length < 3) return null;

  const parsed: LabLessonDirection[] = [];

  for (let i = 0; i < 3; i++) {
    const item = list[i];
    if (!item || typeof item !== "object") return null;
    const { id, title, intro } = item as Record<string, unknown>;
    const safeTitle = typeof title === "string" ? title.trim() : "";
    const safeIntro = typeof intro === "string" ? intro.trim() : "";
    if (!safeTitle || !safeIntro) return null;
    parsed.push({
      id: typeof id === "string" && id.trim() ? id.trim() : String(i + 1),
      title: safeTitle,
      intro: safeIntro,
    });
  }

  return parsed;
}

export function parseLabLessonDirection(value: unknown): LabLessonDirection | null {
  if (!value || typeof value !== "object") return null;
  const { id, title, intro } = value as Record<string, unknown>;
  const safeTitle = typeof title === "string" ? title.trim() : "";
  const safeIntro = typeof intro === "string" ? intro.trim() : "";
  if (!safeTitle || !safeIntro) return null;
  return {
    id: typeof id === "string" && id.trim() ? id.trim() : "1",
    title: safeTitle,
    intro: safeIntro,
  };
}
