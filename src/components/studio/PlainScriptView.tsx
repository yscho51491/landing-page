import { parseScriptPlainBlocks } from "@/lib/lesson/format-lesson-text";

type PlainScriptViewProps = {
  text: string;
};

export default function PlainScriptView({ text }: PlainScriptViewProps) {
  const blocks = parseScriptPlainBlocks(text);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const emoji = block.role === "student" ? "👤" : "👩‍🏫";
        const label =
          block.role === "student" ? "예상 수강자 반응" : "교사 멘트";

        return (
          <div key={i} className="first:mt-0">
            <p className="text-sm font-bold text-emphasis">
              {emoji} {label}
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {block.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
