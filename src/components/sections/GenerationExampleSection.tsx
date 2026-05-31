import Button from "@/components/ui/Button";
import Section, { SectionHeader } from "@/components/ui/Section";

const inputValues = [
  { label: "주제", value: "호국보훈" },
  { label: "대상", value: "초등학교 3~4학년" },
  { label: "수업 시간", value: "60분" },
  { label: "필수 반영사항", value: "태극기, 무궁화, 감사 메시지 포함" },
];

const results = [
  "수업 계획서",
  "태극기와 무궁화 도안",
  "감사 메시지 활동지",
  "예시 완성작 이미지",
  "수업용 PPT",
  "교사 진행 대본",
];

export default function GenerationExampleSection() {
  return (
    <Section id="generation-example" alt>
      <SectionHeader emoji="🇰🇷" title="예를 들어, '호국보훈' 수업을 입력하면" />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <h3 className="mb-4 font-bold text-foreground">입력값</h3>
          <div className="space-y-3">
            {inputValues.map((item) => (
              <div key={item.label} className="flex gap-2 text-sm md:text-base">
                <span className="shrink-0 font-medium text-muted">
                  {item.label}:
                </span>
                <span className="text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-primary/30 bg-surface p-6 shadow-sm md:p-8">
          <h3 className="mb-2 font-bold text-foreground">생성 결과 예시</h3>
          <p className="text-sm font-medium text-muted">수업명:</p>
          <p className="mt-1 text-lg font-bold text-primary">
            고마움을 담은 나라사랑 감사 카드 만들기
          </p>
          <p className="mt-4 text-sm font-medium text-muted">수업개요:</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground md:text-base">
            호국보훈의 의미를 이해하고, 나라를 지켜주신 분들께 감사하는 마음을
            카드 디자인으로 표현하는 수업입니다.
          </p>
          <p className="mt-4 text-sm font-medium text-muted">제공 자료:</p>
          <ul className="mt-2 space-y-1">
            {results.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-foreground md:text-base"
              >
                <span className="text-primary">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Button>내 주제로 수업자료 생성해보기</Button>
      </div>
    </Section>
  );
}
