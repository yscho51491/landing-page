import {
  containsForeignScript,
  sanitizeKoreanText,
  sanitizeKoreanTexts,
} from "@/lib/text/korean-only";
import type { LabLessonIdea } from "@/types/lab";

function collectIdeaStrings(idea: LabLessonIdea): string[] {
  return [
    idea.title,
    idea.overview,
    ...idea.goals,
    ...idea.expectedEffects,
    ...idea.materials.flatMap((g) => [g.category, ...g.items]),
    ...idea.process.flatMap((s) => [s.title, ...s.points]),
  ];
}

export function labIdeaHasForeignScript(idea: LabLessonIdea): boolean {
  return collectIdeaStrings(idea).some(containsForeignScript);
}

/** 생성 결과에서 외국어 문자를 정리 */
export function normalizeLabIdeaKorean(idea: LabLessonIdea): LabLessonIdea {
  return {
    title: sanitizeKoreanText(idea.title),
    overview: sanitizeKoreanText(idea.overview),
    goals: sanitizeKoreanTexts(idea.goals),
    materials: idea.materials.map((g) => ({
      category: sanitizeKoreanText(g.category),
      items: sanitizeKoreanTexts(g.items),
    })),
    process: idea.process.map((step) => ({
      title: sanitizeKoreanText(step.title),
      points: sanitizeKoreanTexts(step.points),
    })),
    expectedEffects: sanitizeKoreanTexts(idea.expectedEffects),
  };
}
