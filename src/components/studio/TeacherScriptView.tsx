import FormattedBracketText from "@/components/studio/FormattedBracketText";
import PlainScriptView from "@/components/studio/PlainScriptView";
import { isStructuredScript } from "@/lib/lesson/format-lesson-text";
import type { TeacherScript } from "@/types/lesson";

type TeacherScriptViewProps = {
  script: TeacherScript;
};

function ScriptSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-5 first:mt-0">
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <div className="mt-3 rounded-xl border border-border/80 bg-surface-alt/40 p-4">
        {isStructuredScript(body) ? (
          <FormattedBracketText text={body} mode="script" />
        ) : (
          <PlainScriptView text={body} />
        )}
      </div>
    </section>
  );
}

export default function TeacherScriptView({ script }: TeacherScriptViewProps) {
  return (
    <article>
      <ScriptSection title="도입 멘트" body={script.intro.script} />
      <ScriptSection title="전개 멘트" body={script.main.script} />
      <ScriptSection title="마무리 멘트" body={script.closing.script} />
    </article>
  );
}
