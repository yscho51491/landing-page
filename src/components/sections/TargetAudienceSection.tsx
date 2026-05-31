import Section, { SectionHeader } from "@/components/ui/Section";

const audiences = [
  {
    title: "유치원 선생님",
    description:
      "매달 새로운 주제와 행사 수업을 준비해야 하는 선생님께 적합합니다.",
    icon: "🎨",
  },
  {
    title: "초등학교 선생님",
    description:
      "교과 연계 미술 활동, 계기교육, 창의적 체험활동 자료를 빠르게 만들 수 있습니다.",
    icon: "📚",
  },
  {
    title: "미술학원 원장님",
    description:
      "월별 커리큘럼, 시즌 수업, 특강 수업을 기획할 때 활용할 수 있습니다.",
    icon: "🏫",
  },
  {
    title: "방과후 강사",
    description:
      "여러 학교를 이동하며 수업하는 강사님이 수업 자료를 빠르게 준비할 수 있습니다.",
    icon: "🚌",
  },
  {
    title: "공방 운영자",
    description:
      "키즈 클래스, 원데이 클래스, 시즌 클래스 자료를 손쉽게 구성할 수 있습니다.",
    icon: "✂️",
  },
  {
    title: "키즈 클래스 강사",
    description:
      "홍보용 수업 이미지, 수업 흐름, 준비물 안내까지 한 번에 준비할 수 있습니다.",
    icon: "👩‍🏫",
  },
];

export default function TargetAudienceSection() {
  return (
    <Section id="audience">
      <SectionHeader emoji="👩‍🏫" title="이런 분들에게 필요합니다." />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {audiences.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-3xl">{item.icon}</span>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
