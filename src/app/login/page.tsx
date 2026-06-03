import LoginButtons from "@/components/auth/LoginButtons";
import Image from "next/image";
import Link from "next/link";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params.error === "auth";
  const nextPath = params.next ?? "/";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-lg md:p-10">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="아트티쳐랩"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-foreground">아트티쳐랩</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">로그인</h1>
          <p className="mt-2 text-sm text-muted">
            구글 또는 카카오 계정으로 간편하게 시작하세요.
          </p>
        </div>

        {hasError && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            로그인에 실패했습니다. 다시 시도해 주세요.
          </p>
        )}

        <div className="flex justify-center">
          <LoginButtons redirectPath={nextPath} />
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          로그인 시{" "}
          <Link href="/" className="text-emphasis hover:underline">
            서비스 이용 안내
          </Link>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>

      <Link
        href="/"
        className="mt-6 text-sm font-medium text-muted transition-colors hover:text-emphasis"
      >
        ← 홈으로 돌아가기
      </Link>
    </main>
  );
}
