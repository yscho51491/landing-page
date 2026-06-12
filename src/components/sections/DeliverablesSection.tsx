import { SectionHeader } from "@/components/ui/Section";
import Image from "next/image";

const deliverables = [
  {
    number: "1",
    title: "수업 계획서",
    description:
      "수업명, 수업개요, 학습 목표, 준비물, 수업과정, 기대 효과까지 포함된 체계적인 수업 계획서를 제공합니다.",
    items: [
      "수업명",
      "수업개요",
      "학습 목표",
      "준비물",
      "도입, 전개, 마무리 활동",
      "단계별 소요 시간",
      "기대 효과",
    ],
  },
  {
    number: "2",
    title: "활동지 및 도안",
    description:
      "수업 흐름에 맞는 활동지와 도안을 함께 제공합니다.",
    items: [
      "색칠 도안",
      "오리기 도안",
      "글쓰기 활동지",
      "감상 활동지",
      "아이디어 스케치지",
      "완성작 꾸미기 도안",
    ],
  },
  {
    number: "3",
    title: "예시 완성작 이미지",
    description:
      "아이들이 어떤 결과물을 만들 수 있는지 참고할 수 있도록 수업 주제에 맞는 예시 완성작 이미지를 제공합니다.",
    items: [
      "수업 도입 시 참고 이미지",
      "학부모 안내용 이미지",
      "클래스 홍보용 샘플 이미지",
      "교사용 제작 가이드",
    ],
  },
{
    number: "4",
    title: "교사대본",
    description:
      "수업을 처음 진행하는 선생님도 자연스럽게 말할 수 있도록 도입, 전개, 마무리 단계별 교사용 멘트를 제공합니다.",
    items: [
      "오늘은 우리가 감사한 마음을 그림으로 표현해볼 거예요.",
      "이 모양을 보면서 어떤 장면이 떠오르나요?",
      "친구들의 작품에서 가장 인상 깊은 부분을 찾아볼까요?",
    ],
    isQuote: true,
  },
];

export default function DeliverablesSection() {
  return (
    <section id="deliverables" className="relative py-16 md:py-24">
      <div className="absolute inset-0">
        <Image
          src="/images/deliverables-bg.png"
          alt=""
          fill
          className="object-cover opacity-70"
          sizes="100vw"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#fffdf5]/88 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeader
          emoji="📦"
          title="한 번의 입력으로 제공되는 수업자료 패키지"
        />

        <div className="mx-auto max-w-2xl space-y-6">
          {deliverables.map((item) => (
            <div
              key={item.number}
              className="rounded-2xl border border-border bg-white/95 p-6 shadow-sm backdrop-blur-sm md:p-7"
            >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                {item.number}
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                  {item.description}
                </p>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-foreground">
                    {item.isQuote ? "예시:" : "포함 내용:"}
                  </p>
                  <ul className="space-y-2">
                    {item.items.map((subItem) => (
                      <li
                        key={subItem}
                        className={`flex items-start gap-2 text-sm text-muted md:text-base ${
                          item.isQuote ? "italic" : ""
                        }`}
                      >
                        {!item.isQuote && (
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                        {item.isQuote && (
                          <span className="text-emphasis">&ldquo;</span>
                        )}
                        {subItem}
                        {item.isQuote && (
                          <span className="text-emphasis">&rdquo;</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}
