import {
  parseBracketSections,
  type BracketSection,
} from "@/lib/lesson/format-lesson-text";

type FormattedBracketTextProps = {
  text: string;
  mode: "plan" | "script";
};

function SectionBlock({
  section,
  mode,
}: {
  section: BracketSection;
  mode: "plan" | "script";
}) {
  if (!section.label) {
    return (
      <p className="whitespace-pre-wrap leading-relaxed">{section.content}</p>
    );
  }

  const emoji = mode === "script" ? section.emoji : undefined;

  return (
    <div className="mt-3 first:mt-0">
      <p className="text-sm font-bold text-emphasis">
        {emoji ? `${emoji} ` : ""}
        {section.label}
      </p>
      <p className="mt-1.5 whitespace-pre-wrap pl-0 text-sm leading-relaxed text-foreground md:pl-1">
        {section.content}
      </p>
    </div>
  );
}

export default function FormattedBracketText({
  text,
  mode,
}: FormattedBracketTextProps) {
  const sections = parseBracketSections(text);

  if (sections.length === 0) {
    return null;
  }

  if (sections.length === 1 && !sections[0].label) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {sections[0].content}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <SectionBlock key={`${section.label}-${i}`} section={section} mode={mode} />
      ))}
    </div>
  );
}
