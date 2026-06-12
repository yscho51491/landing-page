import type {
  LabLessonIdea,
  LabLessonMaterialGroup,
  LabLessonProcessStep,
} from "@/types/lab";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(/[,，、\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(value)) return [];
  return value.map(asString).filter(Boolean);
}

/** AI가 중첩 객체로 감싸서 보내는 경우 풀기 */
function normalizeRoot(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  let obj = value as Record<string, unknown>;
  for (const key of ["idea", "lessonIdea", "lesson", "result", "data"]) {
    const nested = obj[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      obj = nested as Record<string, unknown>;
      break;
    }
  }
  return obj;
}

function parseMaterials(value: unknown): LabLessonMaterialGroup[] {
  if (!Array.isArray(value)) return [];

  if (value.every((v) => typeof v === "string")) {
    const items = asStringArray(value);
    return items.length > 0 ? [{ category: "준비물", items }] : [];
  }

  const groups = value
    .map((g) => {
      if (!g || typeof g !== "object") return null;
      const group = g as Record<string, unknown>;
      const category =
        asString(group.category) ||
        asString(group.name) ||
        asString(group.label) ||
        asString(group["분류"]) ||
        "준비물";
      const items = asStringArray(group.items ?? group.materials ?? group.list);
      if (items.length === 0) return null;
      return { category, items };
    })
    .filter((g): g is LabLessonMaterialGroup => g !== null);

  return groups;
}

function parseProcess(value: unknown): LabLessonProcessStep[] {
  if (!Array.isArray(value)) return [];

  if (value.every((v) => typeof v === "string")) {
    return value
      .map((raw, i) => {
        const text = asString(raw);
        if (!text) return null;
        return { title: `${i + 1}단계`, points: [text] };
      })
      .filter((s): s is LabLessonProcessStep => s !== null);
  }

  return value
    .map((s, i) => {
      if (typeof s === "string") {
        const text = asString(s);
        return text ? { title: `${i + 1}단계`, points: [text] } : null;
      }
      if (!s || typeof s !== "object") return null;
      const step = s as Record<string, unknown>;
      const title =
        asString(step.title) ||
        asString(step.name) ||
        asString(step.phase) ||
        asString(step["단계"]) ||
        `${i + 1}단계`;
      let points = asStringArray(
        step.points ??
          step.items ??
          step.steps ??
          step.activities ??
          step["내용"],
      );
      const desc = asString(
        step.description ?? step.content ?? step.body ?? step["설명"],
      );
      if (points.length === 0 && desc) {
        points = [desc];
      }
      if (points.length === 0) return null;
      return { title, points };
    })
    .filter((s): s is LabLessonProcessStep => s !== null);
}

/** AI 응답을 LabLessonIdea로 검증·정규화. 형식이 어긋나면 null */
export function parseLabLessonIdea(value: unknown): LabLessonIdea | null {
  const obj = normalizeRoot(value);
  if (!obj) return null;

  const idea: LabLessonIdea = {
    title:
      asString(obj.title) ||
      asString(obj.name) ||
      asString(obj["제목"]),
    overview:
      asString(obj.overview) ||
      asString(obj.summary) ||
      asString(obj.description) ||
      asString(obj["수업개요"]) ||
      asString(obj["개요"]),
    goals: asStringArray(
      obj.goals ?? obj.goal ?? obj.learningGoals ?? obj["학습목표"],
    ),
    materials: parseMaterials(
      obj.materials ?? obj.supplies ?? obj["준비물"],
    ),
    process: parseProcess(
      obj.process ?? obj.steps ?? obj.activities ?? obj["수업과정"],
    ),
    expectedEffects: asStringArray(
      obj.expectedEffects ??
        obj.effects ??
        obj.benefits ??
        obj["기대효과"],
    ),
  };

  if (!idea.title || !idea.overview) {
    return null;
  }

  if (idea.goals.length === 0) {
    idea.goals = ["창의적 표현력 향상", "두 단어의 융합적 사고 경험"];
  }
  if (idea.materials.length === 0) {
    idea.materials = [{ category: "기본재료", items: ["도화지", "색연필", "풀"] }];
  }
  if (idea.process.length === 0) {
    idea.process = [
      {
        title: "1️⃣ 도입",
        points: ["주제와 재료를 소개하고, 두 단어가 어떻게 연결되는지 이야기합니다."],
      },
      {
        title: "2️⃣ 활동",
        points: ["창작 활동을 진행하며 아이디어를 시각적으로 표현합니다."],
      },
      {
        title: "3️⃣ 마무리",
        points: ["작품을 공유하고 활동에서 느낀 점을 나눕니다."],
      },
    ];
  }
  if (idea.expectedEffects.length === 0) {
    idea.expectedEffects = ["미술 활동에 대한 흥미 증진", "자신감 있는 표현 경험"];
  }

  return idea;
}
