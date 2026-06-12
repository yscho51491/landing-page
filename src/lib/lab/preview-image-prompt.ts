import type { LabLessonIdea } from "@/types/lab";

export function buildLabPreviewImagePrompt(
  idea: LabLessonIdea,
  words: [string, string],
): string {
  const materials = idea.materials
    .flatMap((g) => g.items)
    .slice(0, 8)
    .join(", ");

  const activities = idea.process
    .flatMap((step) => step.points)
    .slice(0, 4)
    .join(" | ");

  return [
    "Colored example artwork for a Korean elementary art class, portrait orientation.",
    "FRAMING RULES: the complete artwork must be fully visible inside the frame.",
    "Keep the main subject centered with comfortable margins on all sides.",
    "Nothing important may touch or get cut off at the edges of the image.",
    "Finished example artwork in soft crayon and colored pencil style, warm harmonious palette, child-friendly but polished.",
    `Creative fusion theme: "${words[0]}" + "${words[1]}".`,
    `Lesson title: ${idea.title}`,
    `Overview: ${idea.overview.slice(0, 400)}`,
    `Activities: ${activities}`,
    `Materials mood: ${materials}`,
    "Appropriate for elementary students, illustrated art class style.",
    "No watermark, no photo realism.",
  ].join("\n");
}
