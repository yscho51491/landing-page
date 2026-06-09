import type { LessonInput, LessonResult } from "@/types/lesson";
import OpenAI from "openai";
import { PPT_SLIDE_COUNT } from "@/lib/lesson/image-config";

export type PptSlideOutline = {
  title: string;
  visualDescription: string;
  bulletPoints: string[];
};

export type PptOutlineResult = {
  slides: PptSlideOutline[];
};

const OUTLINE_MODEL = "gpt-4o-mini";

const OUTLINE_SYSTEM = `너는 미술 수업용 PPT 슬라이드 기획자다.
수업 계획서를 바탕으로 정확히 10장의 슬라이드 구성안을 JSON으로 반환한다.
슬라이드는 도입(1-3)→전개(4-7)→마무리(8-10) 흐름을 따른다.
전개 슬라이드에는 실제 미술 활동·작품명·시범 내용을 구체적으로 넣는다.
JSON만 반환:
{
  "slides": [
    {
      "title": "슬라이드 제목 (한글, 짧게)",
      "visualDescription": "이 슬라이드에 들어갈 그림·사진·도안 설명 (영문으로 상세히, 이미지 생성용)",
      "bulletPoints": ["한글 핵심 문구 1", "한글 핵심 문구 2"]
    }
  ]
}
slides 배열 길이는 반드시 10.`;

export async function generatePptOutline(
  input: LessonInput,
  output: LessonResult,
  apiKey: string,
): Promise<PptOutlineResult> {
  const openai = new OpenAI({ apiKey });

  const userPayload = {
    topic: input.topic,
    audience: input.audience,
    duration: input.duration,
    lessonTitle: output.lessonPlan.title,
    overview: output.lessonPlan.overview,
    goals: output.lessonPlan.goals,
    introActivities: output.lessonPlan.process.intro.activities,
    mainActivities: output.lessonPlan.process.main.activities,
    closingActivities: output.lessonPlan.process.closing.activities,
    slideCount: PPT_SLIDE_COUNT,
  };

  const completion = await openai.chat.completions.create({
    model: OUTLINE_MODEL,
    temperature: 0.6,
    max_tokens: 4096,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: OUTLINE_SYSTEM },
      {
        role: "user",
        content: JSON.stringify(userPayload),
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("PPT_OUTLINE_EMPTY");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("PPT_OUTLINE_PARSE");
  }

  const body = parsed as { slides?: unknown };
  if (!Array.isArray(body.slides)) {
    throw new Error("PPT_OUTLINE_INVALID");
  }

  const slides: PptSlideOutline[] = body.slides
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const raw = item as Record<string, unknown>;
      const title = typeof raw.title === "string" ? raw.title.trim() : "";
      const visualDescription =
        typeof raw.visualDescription === "string"
          ? raw.visualDescription.trim()
          : "";
      const bulletPoints = Array.isArray(raw.bulletPoints)
        ? raw.bulletPoints
            .map((b) => (typeof b === "string" ? b.trim() : ""))
            .filter(Boolean)
        : [];

      if (!title || !visualDescription) {
        return null;
      }

      return { title, visualDescription, bulletPoints };
    })
    .filter((s): s is PptSlideOutline => s !== null);

  if (slides.length < PPT_SLIDE_COUNT) {
    throw new Error("PPT_OUTLINE_TOO_SHORT");
  }

  return { slides: slides.slice(0, PPT_SLIDE_COUNT) };
}
