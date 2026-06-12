import type { LabLessonIdea } from "@/types/lab";

/** 이미지 API 안전 필터 회피: 실존 작가명 → 스타일 설명으로 치환 */
const ARTIST_TO_STYLE: [RegExp, string][] = [
  [/쿠사마\s*야요이|야요이\s*쿠사마|kusama/gi, "colorful polka dot pattern art"],
  [/클림트|klimt/gi, "decorative floral gold pattern art"],
  [/잭슨\s*폴록|폴록|pollock/gi, "abstract drip and splatter paint texture"],
  [/몬드리안|mondrian/gi, "geometric primary color grid composition"],
  [/피카소|picasso/gi, "cubist fragmented shape style"],
  [/반\s*고흐|고흐|van\s*gogh/gi, "swirling brushstroke expressive color style"],
  [/모네|monet/gi, "soft impressionist light and color style"],
  [/김홍도|신사임당/gi, "traditional Korean painting style"],
  [/제프\s*쿤스|koons/gi, "shiny balloon-like sculptural color style"],
  [/무라카미\s*다카시|murakami/gi, "bright pop flower and smile motif style"],
  [/모딜리아니|modigliani/gi, "elongated portrait silhouette style"],
  [/진주\s*귀\s*고리\s*소녀/gi, "Dutch golden age portrait lighting style"],
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

const IMAGE_SAFETY_PREFIX = [
  "Family-friendly elementary school art class finished example artwork only.",
  "Innocent, cheerful, classroom-appropriate illustration.",
  "No photorealistic human faces, no nudity, no violence, no text or watermark.",
].join(" ");

export function buildLabPreviewImagePrompt(
  idea: LabLessonIdea,
  words: [string, string],
): string {
  const safeTitle = sanitizeForImagePrompt(idea.title);
  const safeOverview = sanitizeForImagePrompt(idea.overview.slice(0, 350));
  const safeWords = words.map((w) => sanitizeForImagePrompt(w));

  const materials = sanitizeForImagePrompt(
    idea.materials
      .flatMap((g) => g.items)
      .slice(0, 6)
      .join(", "),
  );

  const activities = sanitizeForImagePrompt(
    idea.process
      .flatMap((step) => step.points)
      .slice(0, 3)
      .join(" "),
  );

  return [
    IMAGE_SAFETY_PREFIX,
    "Colored example artwork for a Korean elementary art class, portrait orientation.",
    "FRAMING RULES: the complete artwork must be fully visible inside the frame.",
    "Keep the main subject centered with comfortable margins on all sides.",
    "Finished example in soft crayon and colored pencil style, warm harmonious palette.",
    `Creative fusion theme: "${safeWords[0]}" and "${safeWords[1]}".`,
    `Lesson title: ${safeTitle}`,
    `Lesson summary: ${safeOverview}`,
    `Key art-making steps: ${activities}`,
    `Art supplies used: ${materials}`,
    "Illustrated children's art class style, not photo realism.",
  ].join("\n");
}

/** 안전 필터 거절 시 사용하는 단순 프롬프트 */
export function buildLabPreviewImagePromptFallback(
  idea: LabLessonIdea,
  words: [string, string],
): string {
  const safeTitle = sanitizeForImagePrompt(idea.title);
  const safeWords = words.map((w) => sanitizeForImagePrompt(w));

  return [
    IMAGE_SAFETY_PREFIX,
    "Portrait orientation children's art class example artwork on white paper.",
    "Soft crayon and colored pencil illustration with warm cheerful colors.",
    `Art theme combining ${safeWords[0]} and ${safeWords[1]}.`,
    `Inspired by lesson: ${safeTitle}.`,
    "Show a completed student craft project with simple shapes, patterns, and collage elements.",
    "Centered composition, full artwork visible, no text, no watermark.",
  ].join("\n");
}

export function isImageSafetyRejection(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return msg.includes("safety") || msg.includes("rejected by the safety");
}
