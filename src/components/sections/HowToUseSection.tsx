import Section, { SectionHeader } from "@/components/ui/Section";

const steps = [
  {
    step: "Step 1",
    emoji: "✍️",
    title: "수업 정보 입력",
    description: "주제, 대상 연령, 수업 시간, 필수 반영사항을 입력합니다.",
  },
  {
    step: "Step 2",
    emoji: "🤖",
    title: "AI 자료 생성",
    description:
      "아트티쳐랩 AI가 수업 계획서와 자료 패키지를 자동으로 구성합니다.",
  },
  {
    step: "Step 3",
    emoji: "👀",
    title: "자료 확인 및 수정",
    description: "생성된 내용을 확인하고 필요한 부분만 간단히 수정합니다.",
  },
  {
    step: "Step 4",
    emoji: "🎉",
    title: "바로 수업에 활용",
    description: "PPT, 활동지, 도안, 교사대본을 활용해 수업을 진행합니다.",
  },
];

export default function HowToUseSection() {
  return (
    <Section id="how-to-use" alt>
      <SectionHeader emoji="📱" title="사용 방법은 간단합니다." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((item, index) => (
          <div key={item.step} className="relative">
            {index < steps.length - 1 && (
              <div className="absolute top-8 left-full hidden h-0.5 w-full -translate-x-1/2 bg-border lg:block" />
            )}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-transform hover:-translate-y-1">
              <span className="text-3xl">{item.emoji}</span>
              <span className="mt-2 block text-xs font-bold tracking-wider text-emphasis uppercase">
                {item.step}
              </span>
              <h3 className="mt-2 text-lg font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
