import ReferralCoinAnimation from "@/components/service/ReferralCoinAnimation";
import BetaCoinPouchAnimation from "@/components/service/BetaCoinPouchAnimation";
import MixingLessonCarousel from "@/components/service/MixingLessonCarousel";
import ServiceHowItWorks from "@/components/service/ServiceHowItWorks";
import ServiceFaq from "@/components/service/ServiceFaq";
import RailBackground from "@/components/lab/RailBackground";
import { COIN_CARDS, HOME_SCREEN_PREVIEW } from "@/data/service-page-content";
import { BETA_TALLY_URL } from "@/lib/service/links";
import Image from "next/image";
import Link from "next/link";

type ServicePageContentProps = {
  isLoggedIn: boolean;
};

function SectionShell({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`px-4 py-16 md:px-6 md:py-24 ${className}`}
    >
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
      {children}
    </h2>
  );
}

function PrimaryButton({
  href,
  children,
  external,
  className: classNameProp,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const className = [
    "inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark md:text-base",
    classNameProp,
  ]
    .filter(Boolean)
    .join(" ");

  if (external) {
    const opensNewTab = href.startsWith("http");
    return (
      <a
        href={href}
        target={opensNewTab ? "_blank" : undefined}
        rel={opensNewTab ? "noopener noreferrer" : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function OutlineButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-surface px-8 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground md:text-base"
    >
      {children}
    </Link>
  );
}

export default function ServicePageContent({
  isLoggedIn,
}: ServicePageContentProps) {
  const referralHref = isLoggedIn ? "/my" : "/login?next=/service";

  return (
    <>
      {/* 1. Hero */}
      <section className="relative min-h-[calc(100dvh-4.25rem)] overflow-hidden">
        <RailBackground />
        <div className="absolute inset-0 bg-white/78 backdrop-blur-[2px]" />

        <div className="relative z-10 flex min-h-[calc(100dvh-4.25rem)] flex-col items-center justify-center px-4 py-16 md:px-6">
          <div className="w-full max-w-2xl rounded-3xl border border-border/80 bg-white/92 px-6 py-10 text-center shadow-xl backdrop-blur-md md:px-10 md:py-12">
            <p className="text-xs font-bold tracking-wide text-emphasis md:text-sm">
              🎨 아트티쳐랩
            </p>
            <h1 className="mt-4 text-xl font-bold leading-snug text-foreground md:text-3xl">
              수업 아이디어 얻기 위해
              <br />
              오늘도 서칭중이신가요? 🔍
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
              기껏 찾은 수업도
              <br />
              저작권 때문에 활용 못 하고… 😢
              <br />
              수업 기획안 작성하려면
              <br />
              또 한 세월… ⏳
            </p>
            <div className="my-8 h-px w-full bg-border/70" aria-hidden />
            <p className="text-base font-semibold leading-relaxed text-foreground md:text-xl">
              ✨ 단어 두 개만 입력하세요.
              <br />
              <span className="text-emphasis">
                미술수업 계획서
              </span>
              와
              <br />
              <span className="text-emphasis">
                완성작 예시 이미지
              </span>
              를 만들어드립니다!
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              🧪 두 개의 수업 아이디어를 섞어
              <br />
              새로운 미술수업 계획서와
              <br />
              완성작 예시 이미지 1장을 생성해요.
            </p>
            <div className="mt-9">
              <PrimaryButton href="/lab">
                🎲 수업 아이디어 믹싱해보기
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mixing Lab */}
      <section id="mixing-lab">
        <MixingLessonCarousel />
        <div className="bg-surface px-4 py-12 text-center md:px-6 md:py-16">
          <PrimaryButton
            href="/lab"
            className="px-10 py-4 text-base shadow-md md:px-14 md:py-5 md:text-lg"
          >
            🎲 랜덤 아이디어 뽑아보기
          </PrimaryButton>
        </div>
      </section>

      {/* 3. How it works */}
      <ServiceHowItWorks />

      {/* 4. Coins */}
      <SectionShell className="bg-surface-alt/40">
        <SectionTitle>완성작 예시 이미지는 아트랩코인으로 생성해요</SectionTitle>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted md:text-base">
          회원가입 시 아트랩코인 3개가 제공됩니다. 수업 계획서에 어울리는
          완성작 예시 이미지를 생성할 때 코인이 사용됩니다. 처음 생성한 이미지가
          마음에 들지 않는다면, 보유한 코인만큼 다시 생성해 더 마음에 드는
          예시작을 선택할 수 있습니다.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COIN_CARDS.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-border bg-surface p-5 text-center shadow-sm"
            >
              <p className="text-sm font-bold text-emphasis">{card.title}</p>
              <p className="mt-2 text-sm text-foreground">{card.body}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      {/* 6. Home feed */}
      <SectionShell className="bg-surface">
        <SectionTitle>다양한 수업 아이디어, 한 눈에 볼 수 있어요</SectionTitle>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted md:text-base">
          홈 화면에서는 다른 유저들이 만든 수업 아이디어와 완성작 예시 이미지를
          볼 수 있습니다. 많은 선생님들이 사용할수록 아트티쳐랩은 더 풍성한
          미술수업 아이디어 라이브러리가 됩니다.
        </p>
        <div className="mt-10 text-center">
          <OutlineButton href="/">홈 화면 둘러보기</OutlineButton>
        </div>
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-border bg-surface-alt/30 p-3 shadow-lg md:mt-12 md:p-4">
          <Image
            src={HOME_SCREEN_PREVIEW.src}
            alt={HOME_SCREEN_PREVIEW.alt}
            width={1200}
            height={800}
            unoptimized
            className="h-auto w-full rounded-2xl object-cover"
          />
        </div>
      </SectionShell>

      {/* 7. Referral */}
      <SectionShell className="bg-surface">
        <SectionTitle>🤝 아트티쳐랩을 추천하고 코인을 받으세요!</SectionTitle>
        <div className="mx-auto mt-6 max-w-2xl space-y-3 text-center text-sm leading-relaxed text-muted md:text-base">
          <p>
            👋 새로 가입한 유저가 추천인 ID에
            <br />
            내 이메일 주소를 입력하면
          </p>
          <p className="font-semibold text-foreground">
            🪙 추천한 선생님과 새로 가입한 선생님 모두에게
            <br />
            아트랩코인 5개를 추가로 드립니다.
          </p>
        </div>
        <ReferralCoinAnimation />
        <div className="text-center">
          <PrimaryButton href={referralHref}>
            아트티쳐랩 추천하기
          </PrimaryButton>
          <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-muted">
            💡 내 추천인 ID는 가입 이메일 주소입니다.
            <br />
            ( abc123@abc.com 으로 완전한 이메일 형식을 입력해주셔야 합니다.)
          </p>
        </div>
      </SectionShell>

      {/* 9. Beta */}
      <SectionShell className="bg-surface-alt/50">
        <SectionTitle>🧪 지금은 아트티쳐랩 베타 테스트 기간입니다</SectionTitle>
        <div className="mx-auto mt-6 max-w-2xl space-y-3 text-center text-sm leading-relaxed text-muted md:text-base">
          <p>
            ✨ 아트티쳐랩을 먼저 체험하고
            <br />
            의견을 남겨주세요.
          </p>
          <p className="font-semibold text-foreground">
            🪙 베타 테스터로 선정되신 분께는
            <br />
            수업 아이디어와 완성작 예시 이미지를
            <br />
            충분히 만들어볼 수 있도록
            <br />
            아트랩코인 30개를 드립니다.
          </p>
        </div>
        <BetaCoinPouchAnimation />
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryButton href={BETA_TALLY_URL} external>
            체험하고 아트랩코인 30개 받기
          </PrimaryButton>
          <OutlineButton href="/lab">먼저 수업 아이디어 만들어보기</OutlineButton>
        </div>
      </SectionShell>

      {/* 10. FAQ */}
      <SectionShell className="bg-surface">
        <SectionTitle>자주 묻는 질문</SectionTitle>
        <ServiceFaq />
      </SectionShell>

      {/* 11. Final CTA */}
      <SectionShell className="bg-primary/15">
        <SectionTitle>오늘의 수업 아이디어, 두 단어를 섞어 시작해보세요</SectionTitle>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted md:text-base">
          생각지 못한 조합이 만드는 흥미로운 미술 수업, 지금 만들어보세요!
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryButton href="/lab">지금 수업 아이디어 믹싱해보기</PrimaryButton>
          <PrimaryButton href={BETA_TALLY_URL} external>
            베타 테스터 신청하기
          </PrimaryButton>
        </div>
      </SectionShell>
    </>
  );
}
