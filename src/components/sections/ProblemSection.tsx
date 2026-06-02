import Section from "@/components/ui/Section";

const tasks = [
  { emoji: "💡", text: "아이들이 흥미를 가질 만한 주제 선정" },
  { emoji: "📐", text: "연령에 맞는 수업 흐름 구성" },
  { emoji: "❓", text: "도입 질문과 설명 자료 준비" },
  { emoji: "✂️", text: "활동지와 도안 제작" },
  { emoji: "🖼️", text: "예시 완성작 이미지 준비" },
  { emoji: "📊", text: "PPT 제작" },
  { emoji: "🎤", text: "교사용 멘트와 진행 대본 작성" },
];

export default function ProblemSection() {
  return (
    <Section id="problem">
      <div className="mb-12 text-center md:mb-16">
        <span className="mb-3 inline-block text-4xl" aria-hidden>
          😩
        </span>
        <h2 className="text-2xl font-bold leading-snug text-foreground md:text-4xl">
          수업준비에 주말반납?
          <br />
          이제 그만!
        </h2>
      </div>

      <div className="mx-auto max-w-3xl">
        <p className="text-center text-base leading-relaxed text-muted md:text-lg">
          1시간 수업을 위해 필요한 것...
          <br />
          한두가지가 아니죠?
        </p>

        <ul className="mt-8 space-y-3">
          {tasks.map((task) => (
            <li
              key={task.text}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm transition-transform hover:scale-[1.01]"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base">
                {task.emoji}
              </span>
              <span className="text-sm text-foreground md:text-base">
                {task.text}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-base leading-relaxed text-muted md:text-lg">
          수업 1시간을 위해
          <br />
          몇 시간씩 자료를 찾고, 만들고, 수정해야 했던 날들,
        </p>
        <p className="mt-3 text-center text-3xl font-extrabold text-foreground md:text-4xl">
          이제 그만! 🙅‍♀️
        </p>

        <div className="mt-8 rounded-2xl bg-primary/30 p-6 text-center md:p-8">
          <p className="text-base font-semibold text-emphasis md:text-xl">
            준비 시간을 혁신적으로 줄여드립니다.
          </p>
        </div>
      </div>
    </Section>
  );
}
