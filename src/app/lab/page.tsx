import LoginGate from "@/components/auth/LoginGate";
import LabIdeaLab from "@/components/lab/LabIdeaLab";
import Header from "@/components/layout/Header";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "수업 아이디어 실험실 | 아트티쳐랩",
  description: "새로운 미술 수업 아이디어를 실험하고 발견하는 공간입니다.",
};

export default async function LabPage() {
  let isLoggedIn = false;

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
  }

  return (
    <>
      <Header />
      <main className="w-full">
        {isLoggedIn ? <LabIdeaLab /> : <LoginGate redirectPath="/lab" />}
      </main>
    </>
  );
}
