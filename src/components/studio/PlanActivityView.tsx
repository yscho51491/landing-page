import type { LessonPlanActivity } from "@/types/lesson";

type PlanActivityViewProps = {
  activity: LessonPlanActivity;
};

export default function PlanActivityView({ activity }: PlanActivityViewProps) {
  const examples = activity.activityExamples.filter((line) => line.trim());

  return (
    <div className="space-y-4">
      {activity.keyActivity.trim() ? (
        <section>
          <h4 className="text-sm font-bold text-emphasis">핵심 활동</h4>
          <p className="mt-1.5 whitespace-pre-wrap text-sm font-bold leading-relaxed text-foreground">
            {activity.keyActivity}
          </p>
        </section>
      ) : null}

      {examples.length > 0 ? (
        <section>
          <h4 className="text-sm font-bold text-emphasis">활동 예시</h4>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground">
            {examples.map((line, i) => (
              <li key={i} className="whitespace-pre-wrap">
                {line}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {activity.purpose.trim() ? (
        <section>
          <h4 className="text-sm font-bold text-emphasis">활동 목적</h4>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {activity.purpose}
          </p>
        </section>
      ) : null}

      {activity.timeTip.trim() ? (
        <section>
          <h4 className="text-sm font-bold text-emphasis">시간 운영 팁</h4>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {activity.timeTip}
          </p>
        </section>
      ) : null}
    </div>
  );
}
