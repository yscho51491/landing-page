import StudioCtaButton from "@/components/auth/StudioCtaButton";

export default function FinalCTASection() {
  return (
    <section className="bg-foreground py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <span className="mb-4 inline-block text-5xl animate-float" aria-hidden>
          ⏱️
        </span>
        <h2 className="text-2xl font-bold text-white md:text-4xl">
          3분이면 끝나는 수업 준비
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-300 md:text-lg">
          주제 하나면 충분해요.
          <br />
          수업계획서, 활동지, 도안, 예시작품,
          <br />
          교사대본까지 한 번에 완성해드립니다. ✨
        </p>
        <div className="mt-8">
          <StudioCtaButton>지금 수업자료 생성해보기</StudioCtaButton>
        </div>
      </div>
    </section>
  );
}
