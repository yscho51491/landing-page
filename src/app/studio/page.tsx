import StudioWorkspace from "@/components/studio/StudioWorkspace";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "수업 만들기 | 아트티쳐랩",
  description: "수업 주제와 대상을 입력하고 AI 수업자료를 생성하세요.",
};

export default async function StudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/studio");
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-background px-5 py-10 md:py-14">
      <StudioWorkspace />
    </main>
  );
}
