import MarketingLayout from "@/components/layout/MarketingLayout";
import ServicePageContent from "@/components/service/ServicePageContent";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "서비스 소개 | 아트티쳐랩",
  description:
    "두 개의 수업 아이디어를 섞어 미술수업 계획서와 완성작 예시 이미지를 만드는 AI 미술수업 아이디어 플랫폼, 아트티쳐랩.",
};

export const dynamic = "force-dynamic";

export default async function ServicePage() {
  let isLoggedIn = false;

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = Boolean(user);
  }

  return (
    <MarketingLayout>
      <ServicePageContent isLoggedIn={isLoggedIn} />
    </MarketingLayout>
  );
}
