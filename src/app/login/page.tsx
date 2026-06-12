import LoginGate from "@/components/auth/LoginGate";
import Header from "@/components/layout/Header";

export const metadata = {
  title: "로그인 | 아트티쳐랩",
  description: "구글 또는 카카오 계정으로 간편하게 시작하세요.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params.error === "auth";
  const nextPath = params.next ?? "/";

  return (
    <>
      <Header />
      <main className="w-full">
        <LoginGate
          redirectPath={nextPath}
          errorMessage={
            hasError ? "로그인에 실패했습니다. 다시 시도해 주세요." : null
          }
        />
      </main>
    </>
  );
}
