import type { LessonInput, LessonResult } from "@/types/lesson";
import type { PptSlideOutline } from "@/lib/lesson/ppt-outline";

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
    `Duration: ${input.duration}`,
    `Overview: ${output.lessonPlan.overview.slice(0, 400)}`,
    `Main activities: ${collectKeyActivities(output)}`,
    `Materials: ${output.lessonPlan.materials.slice(0, 5).join(", ")}`,
  ].join("\n");
}

const WORKSHEET_VARIANTS = [
  "Main activity line-art worksheet: central drawing subject for the lesson, large clear outlines for coloring or tracing, minimal decorative border, empty space for student work.",
  "Step-by-step practice sheet: 3-4 numbered simple drawing steps, line art only, arrows showing progression, helper shapes and guides.",
  "Supplementary design worksheet: decorative frame, pattern practice area, small motif related to the lesson theme, extra creative space.",
] as const;

const SAMPLE_ART_VARIANTS = [
  "Finished example artwork in soft crayon and colored pencil style, warm harmonious palette, child-friendly but polished, shows the main lesson subject completed.",
  "Alternative example composition: different angle or layout, same lesson theme, expressive brushstroke texture, inspiring reference for students.",
  "Third example emphasizing color mood and emotion of the lesson theme, gentle highlights, gallery-style presentation on light paper background.",
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
    variant,
    "No long paragraphs of text. Only short Korean labels if needed (max 3-4 words).",
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

  return [
    "Colored example artwork for a Korean art class, portrait orientation.",
    variant,
    "Appropriate for the stated audience age group.",
    "No watermark, no photo realism, illustrated art class style.",
    lessonContext(input, output),
  ].join("\n");
}

export function buildPptSlideImagePrompt(
  input: LessonInput,
  output: LessonResult,
  slide: PptSlideOutline,
  slideIndex: number,
): string {
  return [
    `Vertical presentation slide image for Korean art classroom, slide ${slideIndex + 1} of 10.`,
    `Slide title (render clearly in Korean at top): ${slide.title}`,
    `Main visual content: ${slide.visualDescription}`,
    `Key text bullets to include (short Korean, large readable font): ${slide.bulletPoints.join(" / ")}`,
    "Clean pastel educational design, slide layout with title bar and illustration area.",
    "Professional teacher PPT aesthetic, not cluttered.",
    lessonContext(input, output),
  ].join("\n");
}
