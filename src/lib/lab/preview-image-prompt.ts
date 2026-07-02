import type { LabLessonDirection } from "@/types/lab";
import { buildCraftPhotoPromptBlock } from "@/lib/lesson/craft-photo-prompt";
import type { LabLessonIdea } from "@/types/lab";

/** 이미지 API 안전 필터 회피: 실존 작가명 → 스타일 설명으로 치환 */
const ARTIST_TO_STYLE: [RegExp, string][] = [
  [/쿠사마\s*야요이|야요이\s*쿠사마|kusama/gi, "colorful polka dot pattern"],
  [/클림트|klimt/gi, "decorative floral gold pattern"],
  [/잭슨\s*폴록|폴록|pollock/gi, "abstract drip paint texture"],
  [/몬드리안|mondrian/gi, "geometric primary color grid"],
  [/피카소|picasso/gi, "cubist fragmented shapes"],
  [/반\s*고흐|고흐|van\s*gogh/gi, "swirling expressive brushstrokes"],
  [/모네|monet/gi, "soft impressionist light"],
  [/김홍도|신사임당/gi, "traditional Korean painting motifs"],
  [/제프\s*쿤스|koons/gi, "shiny sculptural color"],
  [/무라카미\s*다카시|murakami/gi, "bright pop flower motifs"],
  [/모딜리아니|modigliani/gi, "elongated silhouette forms"],
  [/진주\s*귀\s*고리\s*소녀/gi, "soft portrait lighting style"],
];

function sanitizeForImagePrompt(text: string): string {
  let result = text;
  for (const [pattern, replacement] of ARTIST_TO_STYLE) {
    result = result.replace(pattern, replacement);
  }
  return result
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[^\p{L}\p{N}\s.,!?+\-–—()/'"]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildLessonVisualBrief(
  idea: LabLessonIdea,
  words: [string, string],
  direction?: LabLessonDirection,
): string {
  const safeTitle = sanitizeForImagePrompt(idea.title);
  const safeOverview = sanitizeForImagePrompt(idea.overview.slice(0, 600));
  const safeWords = words.map((w) => sanitizeForImagePrompt(w));

  const materials = sanitizeForImagePrompt(
    idea.materials
      .flatMap((g) => g.items)
      .slice(0, 16)
      .join(", "),
  );

  const makingSteps = sanitizeForImagePrompt(
    idea.process
      .flatMap((step) => step.points)
      .slice(0, 10)
      .join(" "),
  );

  const finalStep = idea.process.at(-1);
  const resultObject = finalStep
    ? sanitizeForImagePrompt(finalStep.title)
    : safeTitle;

  return [
    direction
      ? `Selected lesson direction: ${sanitizeForImagePrompt(direction.title)} — ${sanitizeForImagePrompt(direction.intro)}.`
      : "",
    `Art lesson fusion theme: "${safeWords[0]}" + "${safeWords[1]}".`,
    `Finished artwork to photograph: ${resultObject}.`,
    `Lesson title: ${safeTitle}.`,
    `Lesson summary: ${safeOverview}.`,
    `How students make it: ${makingSteps}.`,
    `Materials visible in the piece: ${materials}.`,
    "Photograph ONE completed physical student art project on a wooden classroom table — same materials and techniques as the lesson, not a generic illustration.",
  ].join("\n");
}

export function buildLabPreviewImagePrompt(
  idea: LabLessonIdea,
  words: [string, string],
  direction?: LabLessonDirection,
): string {
  const seed = `${words[0]}-${words[1]}-${idea.title}`;
  return [
    buildCraftPhotoPromptBlock(seed),
    buildLessonVisualBrief(idea, words, direction),
  ].join("\n\n");
}

/** 안전 필터 거절 시 사용하는 단순 프롬프트 */
export function buildLabPreviewImagePromptFallback(
  idea: LabLessonIdea,
  words: [string, string],
): string {
  const seed = `${words[0]}-${words[1]}-fallback`;
  const safeTitle = sanitizeForImagePrompt(idea.title);
  const safeWords = words.map((w) => sanitizeForImagePrompt(w));

  return [
    buildCraftPhotoPromptBlock(seed),
    `Handmade art project combining ${safeWords[0]} and ${safeWords[1]} themes.`,
    `Inspired by lesson: ${safeTitle}.`,
    "Single finished craft object, centered, full object visible.",
  ].join("\n\n");
}

export function isImageSafetyRejection(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return msg.includes("safety") || msg.includes("rejected by the safety");
}
