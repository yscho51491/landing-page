import StudioCtaButton from "@/components/auth/StudioCtaButton";
import Section, { SectionHeader } from "@/components/ui/Section";
import ExampleImageGallery from "@/components/sections/ExampleImageGallery";

const exampleInputs = [
  { label: "주제", value: "호국보훈" },
  { label: "대상 연령", value: "초등학교 3~4학년" },
  { label: "수업 시간", value: "60분" },
  {
    label: "필수 반영사항",
    value: "피난민의 모습, 평화의 메시지",
  },
];

export default function InputExampleSection() {
  return (
    <Section id="input-example">
      <SectionHeader emoji="📝" title="이렇게 입력하면 됩니다." />

      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
          <div className="bg-primary px-6 py-4">
            <p className="font-semibold text-primary-foreground">수업 정보 입력</p>
          </div>
          <div className="divide-y divide-border">
            {exampleInputs.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="shrink-0 text-sm font-medium text-muted">
                  {item.label}
                </span>
                <span className="text-left font-medium text-foreground sm:text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-surface-alt px-6 py-4 text-center">
            <StudioCtaButton size="md">생성하기</StudioCtaButton>
          </div>
        </div>

        <p className="mt-8 text-center text-base leading-relaxed text-muted md:text-lg">
          입력 후 생성 버튼을 누르면
          <br />
          <strong className="text-foreground">
            수업 계획서, 활동지, 도안, 예시작품, PPT, 교사 대본까지 끝.
          </strong>
          <br />
          <span className="text-sm text-emphasis">(단계별 생성)</span>
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <ExampleImageGallery intro="👇 생성되는 수업자료 미리보기" />
      </div>
    </Section>
  );
}
