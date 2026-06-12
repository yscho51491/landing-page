import type { LabLessonIdea } from "@/types/lab";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

function sanitizeFilename(title: string): string {
  return title.replace(/[\\/:*?"<>|]/g, "_").trim() || "수업안";
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
  });
}

function bulletLine(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: `• ${text}` })],
    spacing: { after: 80 },
  });
}

function bodyParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text })],
    spacing: { after: 160 },
  });
}

export async function buildLabLessonDocx(
  idea: LabLessonIdea,
  words: [string, string],
): Promise<Blob> {
  const children: Paragraph[] = [
    new Paragraph({
      text: idea.title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `키워드: ${words[0]} × ${words[1]}`,
          italics: true,
          color: "666666",
        }),
      ],
      spacing: { after: 240 },
    }),
    sectionHeading("📌 수업 개요"),
    bodyParagraph(idea.overview),
    sectionHeading("🎯 학습 목표"),
    ...idea.goals.map((goal) => bulletLine(goal)),
    sectionHeading("🧰 준비물"),
    ...idea.materials.flatMap((group) => [
      new Paragraph({
        children: [
          new TextRun({ text: group.category, bold: true }),
          new TextRun({ text: `: ${group.items.join(", ")}` }),
        ],
        spacing: { after: 80 },
      }),
    ]),
    sectionHeading("⏳ 수업 과정"),
    ...idea.process.flatMap((step) => [
      new Paragraph({
        children: [new TextRun({ text: step.title, bold: true })],
        spacing: { before: 120, after: 80 },
      }),
      ...step.points.map((point) => bulletLine(point)),
    ]),
    sectionHeading("✨ 기대 효과"),
    ...idea.expectedEffects.map((effect) => bulletLine(effect)),
  ];

  const doc = new Document({
    sections: [{ children }],
  });

  return Packer.toBlob(doc);
}

export async function downloadLabLessonDocx(
  idea: LabLessonIdea,
  words: [string, string],
): Promise<void> {
  const blob = await buildLabLessonDocx(idea, words);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${sanitizeFilename(idea.title)}.docx`;
  anchor.click();
  URL.revokeObjectURL(url);
}
