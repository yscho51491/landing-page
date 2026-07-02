import { buildCraftPhotoPromptBlock } from "@/lib/lesson/craft-photo-prompt";
import type { LessonInput, LessonResult } from "@/types/lesson";

function collectKeyActivities(result: LessonResult): string {
  const phases = [
    result.lessonPlan.process.intro,
    result.lessonPlan.process.main,
    result.lessonPlan.process.closing,
  ];
  return phases
    .flatMap((phase) => phase.activities.map((a) => a.keyActivity))
    .filter(Boolean)
    .slice(0, 6)
    .join(" | ");
}

function lessonContext(input: LessonInput, output: LessonResult): string {
  return [
    `Lesson title: ${output.lessonPlan.title}`,
    `Topic: ${input.topic}`,
    `Audience: ${input.audience}`,
    `Overview: ${output.lessonPlan.overview.slice(0, 600)}`,
    `Main activities: ${collectKeyActivities(output)}`,
    `Materials to show in the artwork: ${output.lessonPlan.materials.join(", ")}`,
    "Depict the exact finished student project described above — same materials, same collage/3D techniques, photographed on a classroom table.",
  ].join("\n");
}

const WORKSHEET_NO_TEXT_RULES = [
  "ABSOLUTELY NO text of any kind in the image.",
  "NO letters, NO numbers, NO words, NO labels, NO captions, NO titles, NO typography, NO speech bubbles, NO writing lines, NO form fields, NO name/date blanks.",
  "Illustration and decorative line art ONLY — pure visual worksheet with zero readable characters.",
] as const;

const WORKSHEET_VARIANTS = [
  "Main activity line-art worksheet: central drawing subject for the lesson, large clear outlines for coloring or tracing, minimal decorative border, empty space for student work.",
  "Step-by-step practice sheet: 3-4 simple drawing steps in panels, line art only, arrows showing progression, helper shapes and guides — no step numbers.",
  "Supplementary design worksheet: decorative frame, pattern practice area, small motif related to the lesson theme, extra creative space.",
] as const;

const SAMPLE_ART_VARIANTS = [
  "Primary shot: finished project centered on the wooden art table, straight-on with slight overhead tilt — every collage layer sharp.",
  "Flat-lay angle: artwork on table with a few matching craft supplies (from the lesson materials list) visible at the edges.",
  "Detail-forward shot: emphasize raised pom-poms, paper layers, glue texture, and mixed-media depth under even daylight.",
] as const;

export function buildWorksheetImagePrompt(
  input: LessonInput,
  output: LessonResult,
  index: number,
): string {
  const variant =
    WORKSHEET_VARIANTS[index] ?? WORKSHEET_VARIANTS[0];

  return [
    "Black and white line art only, NO color fill, NO grayscale shading.",
    "Portrait A4 ratio educational art class worksheet for Korean teachers.",
    ...WORKSHEET_NO_TEXT_RULES,
    variant,
    "Clean printable design, high contrast outlines.",
    lessonContext(input, output),
  ].join("\n");
}

export function buildSampleArtImagePrompt(
  input: LessonInput,
  output: LessonResult,
  index: number,
): string {
  const variant =
    SAMPLE_ART_VARIANTS[index] ?? SAMPLE_ART_VARIANTS[0];

  const seed = `${input.topic}-${output.lessonPlan.title}-${index}`;

  return [
    buildCraftPhotoPromptBlock(seed),
    variant,
    "Korean elementary-to-teen art class finished project appropriate for the stated audience.",
    lessonContext(input, output),
    "Show ONE completed physical artwork object — the final display piece students would create.",
  ].join("\n\n");
}
