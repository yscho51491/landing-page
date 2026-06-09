import { parseBracketSections } from "./format-lesson-text";
import type { LessonPlanActivity } from "@/types/lesson";

const EXAMPLE_LABEL_ORDER = [
  "교사용 발문",
  "교사의 발문",
  "교사 발문",
  "예상 수강자 반응",
  "예상 반응",
  "예상 아동 반응",
  "교사 연결 멘트",
] as const;

function isKeyActivityLabel(label: string): boolean {
  return /^(핵심 활동|교사 자료·설명|교사 자료|설명)$/.test(label);
}

function isExampleLabel(label: string): boolean {
  return /^(교사용 발문|교사의 발문|교사 발문|예상 수강자 반응|예상 아동 반응|예상 반응|교사 연결 멘트)$/.test(
    label,
  );
}

function isPurposeLabel(label: string): boolean {
  return label === "활동 목적";
}

function isTimeTipLabel(label: string): boolean {
  return /^(시간 운영 팁|교사용 진행 팁)$/.test(label);
}

function exampleSortIndex(label: string): number {
  const idx = EXAMPLE_LABEL_ORDER.indexOf(
    label as (typeof EXAMPLE_LABEL_ORDER)[number],
  );
  return idx >= 0 ? idx : 99;
}

export function activityFromBracketText(text: string): LessonPlanActivity {
  const sections = parseBracketSections(text);
  const activity: LessonPlanActivity = {
    keyActivity: "",
    activityExamples: [],
    purpose: "",
    timeTip: "",
  };

  const exampleItems: { label: string; content: string }[] = [];

  for (const section of sections) {
    if (!section.label) {
      if (section.content && !activity.keyActivity) {
        activity.keyActivity = section.content;
      }
      continue;
    }

    if (isKeyActivityLabel(section.label)) {
      activity.keyActivity = section.content;
    } else if (isExampleLabel(section.label)) {
      exampleItems.push({ label: section.label, content: section.content });
    } else if (isPurposeLabel(section.label)) {
      activity.purpose = section.content;
    } else if (isTimeTipLabel(section.label)) {
      activity.timeTip = section.content;
    } else if (section.content) {
      exampleItems.push({ label: section.label, content: section.content });
    }
  }

  exampleItems.sort(
    (a, b) => exampleSortIndex(a.label) - exampleSortIndex(b.label),
  );
  activity.activityExamples = exampleItems
    .map((item) => item.content.trim())
    .filter(Boolean);

  return activity;
}

/** AI가 【】 블록을 activity마다 쪼개 보낸 경우 한 카드로 합침 */
export function coalesceFragmentedActivities(
  activities: LessonPlanActivity[],
): LessonPlanActivity[] {
  if (activities.length <= 1) {
    return activities;
  }

  const allLackKeyActivity = activities.every((a) => !a.keyActivity.trim());
  if (!allLackKeyActivity) {
    return activities;
  }

  const merged: LessonPlanActivity = {
    keyActivity: "",
    activityExamples: [],
    purpose: "",
    timeTip: "",
  };

  for (const a of activities) {
    if (a.keyActivity.trim()) {
      merged.keyActivity = a.keyActivity.trim();
    }
    merged.activityExamples.push(...a.activityExamples);
    if (a.purpose.trim()) {
      merged.purpose = a.purpose.trim();
    }
    if (a.timeTip.trim()) {
      merged.timeTip = a.timeTip.trim();
    }
  }

  return [merged];
}

export function hasPlanActivityStructure(text: string): boolean {
  return /【[^】]+】/.test(text);
}
