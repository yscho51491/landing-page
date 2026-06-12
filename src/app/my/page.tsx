import LoginGate from "@/components/auth/LoginGate";
import Header from "@/components/layout/Header";
import MyPageContent from "@/components/my/MyPageContent";
import { getMyLabLessons } from "@/lib/my/get-my-lab-lessons";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "마이페이지 | 아트티쳐랩",
  description: "내가 만든 수업과 완성작을 모아보세요.",
};

export const dynamic = "force-dynamic";

export default async function MyPage() {
  let isLoggedIn = false;
  let lessons: Awaited<ReturnType<typeof getMyLabLessons>> = [];

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
    if (user) {
      lessons = await getMyLabLessons(user.id);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-4.25rem)] w-full bg-[#f7f4ef]">
        {isLoggedIn ? <MyPageContent lessons={lessons} /> : <LoginGate redirectPath="/my" />}
      </main>
    </>
  );
}
