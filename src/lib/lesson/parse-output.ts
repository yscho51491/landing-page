import {
  activityFromBracketText,
  coalesceFragmentedActivities,
} from "@/lib/lesson/plan-activity-layout";
import { sanitizeParticipantTerms } from "@/lib/lesson/participant-terms";
import type {
  LessonPlanActivity,
  LessonResult,
  LessonProcessPhase,
  TeacherScriptSection,
} from "@/types/lesson";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => asString(item))
    .filter((item) => item.length > 0);
}

function parseActivityObject(value: unknown): LessonPlanActivity | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const raw = value as Record<string, unknown>;
  const keyActivity = sanitizeParticipantTerms(asString(raw.keyActivity));
  const purpose = sanitizeParticipantTerms(asString(raw.purpose));
  const timeTip = sanitizeParticipantTerms(asString(raw.timeTip));

  let activityExamples: string[] = [];
  if (Array.isArray(raw.activityExamples)) {
    activityExamples = raw.activityExamples
      .map((item) => sanitizeParticipantTerms(asString(item)))
      .filter(Boolean);
  } else {
    const legacyExamples = sanitizeParticipantTerms(
      asString(raw.examples ?? raw.activityExample),
    );
    if (legacyExamples) {
      activityExamples = [legacyExamples];
    }
  }

  if (
    !keyActivity &&
    activityExamples.length === 0 &&
    !purpose &&
    !timeTip
  ) {
    return null;
  }

  return { keyActivity, activityExamples, purpose, timeTip };
}

function parseActivityItem(value: unknown): LessonPlanActivity | null {
  if (typeof value === "string") {
    const text = sanitizeParticipantTerms(value.trim());
    if (!text) {
      return null;
    }
    return activityFromBracketText(text);
  }
  return parseActivityObject(value);
}

function parsePhase(value: unknown): LessonProcessPhase | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const phase = value as Record<string, unknown>;
  const duration = sanitizeParticipantTerms(asString(phase.duration));
  const rawActivities = phase.activities;

  if (!Array.isArray(rawActivities)) {
    if (!duration) {
      return null;
    }
    return { duration, activities: [] };
  }

  const parsed = rawActivities
    .map(parseActivityItem)
    .filter((item): item is LessonPlanActivity => item !== null);

  const activities = coalesceFragmentedActivities(parsed);

  if (!duration && activities.length === 0) {
    return null;
  }

  return { duration, activities };
}

function parseScriptSection(value: unknown): TeacherScriptSection | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const section = value as Record<string, unknown>;
  const script = sanitizeParticipantTerms(asString(section.script));
  if (!script) {
    return null;
  }
  return { script };
}

function sanitizePlanActivity(activity: LessonPlanActivity): LessonPlanActivity {
  return {
    keyActivity: sanitizeParticipantTerms(activity.keyActivity),
    activityExamples: activity.activityExamples.map(sanitizeParticipantTerms),
    purpose: sanitizeParticipantTerms(activity.purpose),
    timeTip: sanitizeParticipantTerms(activity.timeTip),
  };
}

export function parseLessonResult(raw: unknown): LessonResult | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const body = raw as Record<string, unknown>;
  const planRaw = body.lessonPlan;
  const scriptRaw = body.teacherScript;

  if (!planRaw || typeof planRaw !== "object") {
    return null;
  }
  if (!scriptRaw || typeof scriptRaw !== "object") {
    return null;
  }

  const plan = planRaw as Record<string, unknown>;
  const script = scriptRaw as Record<string, unknown>;

  const processRaw = plan.process;
  if (!processRaw || typeof processRaw !== "object") {
    return null;
  }
  const process = processRaw as Record<string, unknown>;

  const intro = parsePhase(process.intro);
  const main = parsePhase(process.main);
  const closing = parsePhase(process.closing);

  const introScript = parseScriptSection(script.intro);
  const mainScript = parseScriptSection(script.main);
  const closingScript = parseScriptSection(script.closing);

  const title = sanitizeParticipantTerms(asString(plan.title));
  const overview = sanitizeParticipantTerms(asString(plan.overview));
  const goals = asStringArray(plan.goals).map(sanitizeParticipantTerms);
  const materials = asStringArray(plan.materials).map(sanitizeParticipantTerms);
  const expectedEffects = asStringArray(plan.expectedEffects).map(
    sanitizeParticipantTerms,
  );
  const evaluationPoints = asStringArray(plan.evaluationPoints).map(
    sanitizeParticipantTerms,
  );

  if (
    !title ||
    !overview ||
    goals.length === 0 ||
    materials.length === 0 ||
    expectedEffects.length === 0 ||
    !intro ||
    !main ||
    !closing ||
    !introScript ||
    !mainScript ||
    !closingScript
  ) {
    return null;
  }

  const mapPhase = (phase: LessonProcessPhase): LessonProcessPhase => ({
    duration: phase.duration,
    activities: phase.activities.map(sanitizePlanActivity),
  });

  return {
    lessonPlan: {
      title,
      overview,
      goals,
      materials,
      process: {
        intro: mapPhase(intro),
        main: mapPhase(main),
        closing: mapPhase(closing),
      },
      expectedEffects,
      evaluationPoints,
    },
    teacherScript: {
      intro: introScript,
      main: mainScript,
      closing: closingScript,
    },
  };
}

/** @deprecated parseLessonResult 사용 */
export function parseLessonTextOutput(raw: unknown): LessonResult | null {
  return parseLessonResult(raw);
}
