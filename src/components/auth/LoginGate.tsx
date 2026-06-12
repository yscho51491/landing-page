import LoginButtons from "@/components/auth/LoginButtons";
import RailBackground from "@/components/lab/RailBackground";
import Image from "next/image";

/**
 * 공용 로그인 게이트.
 * Pinterest 스타일 — 이미지 레일이 위/아래로 흐르는 배경 + 어두운 오버레이 + 로그인 카드.
 * 로그인이 필요한 모든 페이지에서 사용합니다.
 */

type LoginGateProps = {
  /** 로그인 성공 후 돌아올 경로 */
  redirectPath: string;
  title?: string;
  subtitle?: string;
  errorMessage?: string | null;
};

export default function LoginGate({
  redirectPath,
  title = "아트티쳐랩에 오신 것을 환영해요!",
  subtitle = "새로운 수업 아이디어를 탐험해보세요!",
  errorMessage,
}: LoginGateProps) {
  return (
    <section className="relative h-[calc(100dvh-4.25rem)] w-full overflow-hidden bg-[#1a1a1a]">
      <RailBackground />

      {/* 가독성용 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/55" />

      {/* 환영 + 로그인 카드 */}
      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="w-full max-w-md rounded-3xl bg-surface/95 p-8 text-center shadow-2xl backdrop-blur-sm md:p-10">
          <Image
            src="/images/logo.png"
            alt="아트티쳐랩"
            width={56}
            height={56}
            className="mx-auto h-14 w-14 rounded-full object-cover"
          />
          <h1 className="mt-5 text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted md:text-base">{subtitle}</p>

          {errorMessage && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <div className="mt-7 flex justify-center">
            <LoginButtons redirectPath={redirectPath} />
          </div>
        </div>
      </div>
    </section>
  );
}
