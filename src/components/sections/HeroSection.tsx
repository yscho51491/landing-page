import Button from "@/components/ui/Button";
import HeroImageGallery from "@/components/sections/HeroImageGallery";

const deliverableTags = [
  { emoji: "📋", label: "수업 계획서" },
  { emoji: "📝", label: "활동지" },
  { emoji: "✂️", label: "도안" },
  { emoji: "🖼️", label: "예시작품" },
  { emoji: "📊", label: "PPT" },
  { emoji: "🎤", label: "교사대본" },
];

const floatingEmojis = [
  { emoji: "🎨", className: "top-16 left-[8%] animate-float delay-0" },
  { emoji: "✏️", className: "top-28 right-[10%] animate-float delay-float-300" },
  { emoji: "📋", className: "bottom-40 left-[6%] animate-float delay-float-500" },
  { emoji: "🖌️", className: "bottom-32 right-[8%] animate-float delay-float-700" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-surface-alt via-background to-orange-50 pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      {floatingEmojis.map((item) => (
        <span
          key={item.emoji}
          className={`pointer-events-none absolute hidden text-3xl opacity-40 select-none md:block ${item.className}`}
          aria-hidden
        >
          {item.emoji}
        </span>
      ))}

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
            <span aria-hidden>✨</span>
            AI 수업자료 생성 서비스
          </span>

          <h1 className="animate-fade-in-up mt-8 text-3xl leading-snug font-extrabold text-emphasis delay-100 md:text-5xl lg:text-[3.25rem] lg:leading-tight">
            잠깐! 선생님 설마
            <br />
            수업 계획서 짜려고 PPT 켜셨나요?
          </h1>

          <p className="animate-fade-in-up mt-5 text-xl leading-snug font-bold text-foreground delay-200 md:text-2xl lg:text-3xl">
            수업 준비, 이제{" "}
            <span className="text-emphasis">3분</span>이면 충분합니다.
          </p>

          <p className="animate-fade-in-up mt-8 text-base leading-relaxed text-muted delay-300 md:text-lg">
            주제와 대상만 입력하면
            <br />
            수업 계획서부터 활동지, 도안, 예시작품,
            <br />
            PPT, 교사대본까지
            <br />
            <strong className="font-semibold text-foreground">
              AI가 한 번에 만들어드립니다. ✨
            </strong>
          </p>

          <div className="animate-fade-in-up mt-10 delay-400">
            <HeroImageGallery />
          </div>

          <p className="animate-fade-in-up mt-10 text-sm leading-relaxed text-muted delay-500 md:text-base">
            🏫 유치원, 초등학교, 미술학원, 방과후 수업,
            <br />
            공방 클래스, 키즈 클래스까지.
            <br />
            <span className="mt-2 inline-block">
              매번 새 수업을 고민하는 선생님을 위한
              <br />
              AI 수업자료 생성 서비스,
              <br />
              <strong className="text-foreground">아트티쳐랩</strong>
              입니다. 🎨
            </span>
          </p>

          <div className="animate-fade-in-up mt-10 delay-600">
            <Button>🚀 무료로 수업자료 만들어보기</Button>
          </div>

          <div className="animate-fade-in-up mt-12 flex flex-wrap items-center justify-center gap-3 delay-700">
            {deliverableTags.map((item) => (
              <span
                key={item.label}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-transform hover:scale-105"
              >
                {item.emoji} {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
