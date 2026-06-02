import Section, { SectionHeader } from "@/components/ui/Section";

const concerns = [
  "기관에서 요구하는 수업 계획서에 작성할 내용",
  "수업 대상자가 공감할 수 있는 설명",
  "시간 안에 완성 가능한 활동",
  "수업 흐름에 맞는 자료",
  "선생님이 바로 말할 수 있는 대본",
];

const testimonials = [
  {
    role: "7년차 미술학원 원장",
    quote:
      "매달 새로운 커리큘럼을 짜는 게 제일 큰 부담이었어요. 아트티쳐랩은 주제와 연령만 넣어도 수업 흐름, 준비물, 예시작품까지 한 번에 정리해줘서 커리큘럼 회의 시간이 확 줄었습니다. 특히 시즌 특강이나 원데이 클래스 기획할 때 바로 활용하기 좋아요.",
  },
  {
    role: "5년차 유아미술강사",
    quote:
      "유아 수업은 아이들이 이해할 수 있는 말로 설명하는 게 정말 중요하잖아요. 아트티쳐랩은 활동 난이도와 설명 방식이 연령에 맞게 나와서 좋았어요. 도입 질문과 교사대본까지 있어서 수업 전에 머릿속으로 흐름을 잡기 훨씬 쉬웠습니다.",
  },
  {
    role: "청소년센터 담당자",
    quote:
      "센터 프로그램은 결과보고서와 수업계획서가 꼭 필요한데, 매번 양식을 채우는 데 시간이 많이 걸렸어요. 아트티쳐랩으로 주제와 시간을 입력하니 학습 목표, 기대 효과, 활동 과정이 정리되어 나와서 행정 준비가 훨씬 수월했습니다. 강사님과 공유하기도 편하고, 프로그램 기획안 초안으로 쓰기 좋았습니다.",
  },
];

export default function TrustSection() {
  return (
    <Section id="trust">
      <SectionHeader emoji="💬" title="2,000명 수업 노하우를 담은 서비스" />

      <div className="mx-auto max-w-3xl">
        <p className="text-center text-base leading-relaxed text-muted md:text-lg">
          유아부터 시니어까지, 다양한 대상자를 수업하며 느낀점들을 바탕으로
          실제 교육 현장의 문제를 해결하기 위해 만들었습니다.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {concerns.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted"
            >
              {item}
            </span>
          ))}
        </div>

        <p className="mt-8 text-center text-base font-medium text-foreground md:text-lg">
          선생님은 수업에만 집중하실 수 있도록,
          <br />
          <span className="text-emphasis">이 모든 것들은 아트티쳐랩이 고민할게요.</span>
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <div
            key={item.role}
            className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
          >
            <p className="text-sm leading-relaxed text-muted italic">
              &ldquo;{item.quote}&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold text-foreground">
              — {item.role}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
