import type { LabLessonIdea } from "@/types/lab";

const MIN_STEPS = 4;
const MIN_POINTS_PER_STEP = 3;
const MIN_POINT_CHARS = 28;

/** 수업 과정이 충분히 구체적인지 검사 */
export function isLabProcessDetailedEnough(idea: LabLessonIdea): boolean {
  if (idea.process.length < MIN_STEPS) {
    return false;
  }

  return idea.process.every((step) => {
    if (step.points.length < MIN_POINTS_PER_STEP) {
      return false;
    }
    return step.points.every((point) => point.trim().length >= MIN_POINT_CHARS);
  });
}
