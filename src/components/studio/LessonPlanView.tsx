import PlanActivityView from "@/components/studio/PlanActivityView";
import type { StructuredLessonPlan } from "@/types/lesson";

type LessonPlanViewProps = {
  plan: StructuredLessonPlan;
};

function PhaseBlock({
  label,
  phase,
}: {
  label: string;
  phase: StructuredLessonPlan["process"]["intro"];
}) {
  return (
    <section className="mt-5">
      <h3 className="text-base font-bold text-foreground">
        [{label}]
        {phase.duration ? (
          <span className="ml-2 text-sm font-medium text-emphasis">
            ({phase.duration})
          </span>
        ) : null}
      </h3>
      <ul className="mt-2 space-y-4 pl-0 text-sm leading-relaxed text-foreground">
        {phase.activities.map((activity, i) => (
          <li
            key={i}
            className="list-none rounded-xl border border-amber-200/80 bg-amber-50/90 p-4 shadow-sm"
          >
            <PlanActivityView activity={activity} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function LessonPlanView({ plan }: LessonPlanViewProps) {
  return (
    <article className="space-y-5 text-sm leading-relaxed text-foreground">
      <header>
        <h2 className="text-lg font-bold text-foreground">{plan.title}</h2>
      </header>

      <section>
        <h3 className="font-bold text-foreground">수업 개요</h3>
        <p className="mt-2 whitespace-pre-wrap">{plan.overview}</p>
      </section>

      <section>
        <h3 className="font-bold text-foreground">학습 목표</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {plan.goals.map((goal, i) => (
            <li key={i}>{goal}</li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="font-bold text-foreground">준비물</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {plan.materials.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-foreground">수업 과정</h3>
        <PhaseBlock label="도입" phase={plan.process.intro} />
        <PhaseBlock label="전개" phase={plan.process.main} />
        <PhaseBlock label="마무리" phase={plan.process.closing} />
      </section>

      <section>
        <h3 className="font-bold text-foreground">기대 효과</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          {plan.expectedEffects.map((effect, i) => (
            <li key={i}>{effect}</li>
          ))}
        </ol>
      </section>

      {plan.evaluationPoints.length > 0 && (
        <section>
          <h3 className="font-bold text-foreground">평가 포인트</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            {plan.evaluationPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ol>
        </section>
      )}
    </article>
  );
}
