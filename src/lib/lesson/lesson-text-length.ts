import type {
  LessonPlanActivity,
  LessonResult,
  StructuredLessonPlan,
  TeacherScript,
} from "@/types/lesson";

export const MIN_LESSON_PLAN_CHARS = 2000;
export const MIN_TEACHER_SCRIPT_CHARS = 2000;

function flattenActivity(activity: LessonPlanActivity): string {
  return [
    activity.keyActivity,
    ...activity.activityExamples,
    activity.purpose,
    activity.timeTip,
  ].join("\n");
}

export function flattenLessonPlanText(plan: StructuredLessonPlan): string {
  const parts: string[] = [
    plan.title,
    plan.overview,
    ...plan.goals,
    ...plan.materials,
    plan.process.intro.duration,
    ...plan.process.intro.activities.map(flattenActivity),
    plan.process.main.duration,
    ...plan.process.main.activities.map(flattenActivity),
    plan.process.closing.duration,
    ...plan.process.closing.activities.map(flattenActivity),
    ...plan.expectedEffects,
    ...plan.evaluationPoints,
  ];
  return parts.join("\n");
}

export function flattenTeacherScriptText(script: TeacherScript): string {
  return [script.intro.script, script.main.script, script.closing.script].join(
    "\n",
  );
}

export function measureLessonTextLengths(result: LessonResult): {
  lessonPlanLength: number;
  teacherScriptLength: number;
  lessonPlanShort: boolean;
  teacherScriptShort: boolean;
  needsExpansion: boolean;
} {
  const lessonPlanLength = flattenLessonPlanText(result.lessonPlan).length;
  const teacherScriptLength = flattenTeacherScriptText(
    result.teacherScript,
  ).length;

  const lessonPlanShort = lessonPlanLength < MIN_LESSON_PLAN_CHARS;
  const teacherScriptShort = teacherScriptLength < MIN_TEACHER_SCRIPT_CHARS;

  return {
    lessonPlanLength,
    teacherScriptLength,
    lessonPlanShort,
    teacherScriptShort,
    needsExpansion: lessonPlanShort || teacherScriptShort,
  };
}
