"use client";

import type { MyLabLesson } from "@/lib/my/get-my-lab-lessons";
import type { LabLessonIdea } from "@/types/lab";

type MyLessonDetailProps = {
  lesson: MyLabLesson;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold text-foreground">{children}</h3>;
}

function LessonSections({ idea }: { idea: LabLessonIdea }) {
  return (
    <div className="space-y-6">
      <section>
        <SectionTitle>📌 수업 개요</SectionTitle>
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted">
          {idea.overview}
        </p>
      </section>

      <section>
        <SectionTitle>🎯 학습 목표</SectionTitle>
        <ul className="mt-2 space-y-1.5">
          {idea.goals.map((goal, i) => (
            <li key={i} className="text-sm leading-relaxed text-muted">
              ✔️ {goal}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle>🧰 준비물</SectionTitle>
        <div className="mt-2 overflow-hidden rounded-xl border border-border">
          {idea.materials.map((group, i) => (
            <div
              key={i}
              className={`flex gap-3 px-4 py-2.5 text-sm ${
                i % 2 === 0 ? "bg-surface-alt/60" : "bg-surface"
              }`}
            >
              <span className="w-20 shrink-0 font-semibold text-foreground">
                {group.category}
              </span>
              <span className="text-muted">{group.items.join(", ")}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>⏳ 수업 과정</SectionTitle>
        <div className="mt-2 space-y-4">
          {idea.process.map((step, i) => (
            <div key={i}>
              <p className="text-sm font-semibold text-foreground">
                {step.title}
              </p>
              <ul className="mt-1 space-y-1 pl-1">
                {step.points.map((point, j) => (
                  <li key={j} className="text-sm leading-relaxed text-muted">
                    · {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>✨ 기대 효과</SectionTitle>
        <ul className="mt-2 space-y-1.5">
          {idea.expectedEffects.map((effect, i) => (
            <li key={i} className="text-sm leading-relaxed text-muted">
              ✔️ {effect}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function MyLessonDetail({ lesson }: MyLessonDetailProps) {
  return (
    <div className="text-left">
      <p className="text-xs font-semibold tracking-wide text-emphasis">
        {lesson.words[0]} × {lesson.words[1]}
      </p>
      <h2 className="mt-2 text-xl font-bold text-foreground md:text-2xl">
        {lesson.idea.title}
      </h2>
      <p className="mt-1 text-xs text-muted">
        {new Date(lesson.createdAt).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <div className="mt-6">
        <LessonSections idea={lesson.idea} />
      </div>
    </div>
  );
}
