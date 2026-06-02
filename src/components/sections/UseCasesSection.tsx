import Section, { SectionHeader } from "@/components/ui/Section";

const useCases = [
  "내일 당장 수업이 있는데 자료가 부족할 때",
  "계절별 미술 수업 아이디어가 필요할 때",
  "어린이날, 어버이날, 지구의 날, 현충일 등 행사 수업을 준비할 때",
  "유치원, 초등학교 연령에 맞는 수업 흐름이 필요할 때",
  "공방 키즈 클래스를 새롭게 열고 싶을 때",
  "학부모에게 보여줄 예시작품 이미지가 필요할 때",
  "방과후 수업 제안서나 커리큘럼을 빠르게 구성해야 할 때",
];

export default function UseCasesSection() {
  return (
    <Section id="use-cases">
      <SectionHeader emoji="💡" title="이럴 때 바로 사용할 수 있습니다." />

      <div className="mx-auto grid max-w-3xl gap-3">
        {useCases.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm"
          >
            <span className="mt-0.5 text-emphasis">💡</span>
            <span className="text-sm text-foreground md:text-base">{item}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
