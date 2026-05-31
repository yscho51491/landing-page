import Section, { SectionHeader } from "@/components/ui/Section";

const comparisons = [
  { before: "주제 검색부터 시작", after: "주제 입력 후 자동 생성" },
  {
    before: "블로그, 핀터레스트, 유튜브를 오가며 자료 수집",
    after: "한 화면에서 수업자료 패키지 완성",
  },
  {
    before: "계획서, 도안, PPT를 따로 제작",
    after: "계획서, 도안, PPT, 대본까지 한 번에 제공",
  },
  {
    before: "연령에 맞게 직접 수정",
    after: "대상 연령에 맞춰 자동 구성",
  },
  {
    before: "수업 전날 밤까지 자료 준비",
    after: "빠르게 생성하고 바로 수업 준비",
  },
];

export default function ComparisonSection() {
  return (
    <Section id="comparison" alt>
      <SectionHeader emoji="🔄" title="수업 준비 방식이 달라집니다." />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
        <div className="grid grid-cols-2 bg-foreground text-sm font-semibold text-white md:text-base">
          <div className="px-4 py-4 text-center md:px-6">기존 수업 준비</div>
          <div className="bg-primary px-4 py-4 text-center md:px-6">
            아트티쳐랩 사용 후
          </div>
        </div>
        {comparisons.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-2 border-t border-border text-sm md:text-base"
          >
            <div className="flex items-center px-4 py-4 text-muted md:px-6">
              <span className="mr-2 text-red-400">✕</span>
              {row.before}
            </div>
            <div className="flex items-center bg-primary/5 px-4 py-4 font-medium text-foreground md:px-6">
              <span className="mr-2 text-primary">✓</span>
              {row.after}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-base font-semibold text-primary md:text-lg">
        자료를 찾는 시간은 줄이고, 아이들을 만나는 수업의 질은 높이세요.
      </p>
    </Section>
  );
}
