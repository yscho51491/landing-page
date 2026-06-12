import Section, { SectionHeader } from "@/components/ui/Section";

const benefits = [
  {
    title: "미술 수업에 특화된 AI",
    description:
      "일반적인 글쓰기 AI가 아니라 미술 수업의 구조, 재료, 활동 흐름에 맞춰 자료를 생성합니다.",
  },
  {
    title: "연령별 맞춤 구성",
    description:
      "유아, 초등 저학년, 초등 고학년 등 대상 연령에 맞는 언어와 활동 난이도를 반영합니다.",
  },
  {
    title: "실제 수업 흐름 중심",
    description:
      "단순 아이디어가 아니라 도입, 전개, 마무리까지 실제 수업에서 사용할 수 있는 흐름으로 제공합니다.",
  },
  {
    title: "자료 패키지형 제공",
    description:
      "계획서만 제공하지 않습니다. 활동지, 도안, 예시작품, 교사대본까지 함께 구성합니다.",
  },
  {
    title: "수업 준비 시간 단축",
    description:
      "반복적인 자료 제작 시간을 줄이고 선생님이 수업의 본질에 더 집중할 수 있도록 돕습니다.",
  },
];

export default function BenefitsSection() {
  return (
    <Section id="benefits">
      <SectionHeader emoji="⭐" title="아트티쳐랩이 특별한 이유" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((item, index) => (
          <div
            key={item.title}
            className={`rounded-2xl border border-border bg-surface p-6 shadow-sm ${
              index === benefits.length - 1 && benefits.length % 3 !== 0
                ? "md:col-span-2 lg:col-span-1"
                : ""
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
              {index + 1}
            </span>
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
