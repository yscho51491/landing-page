import { createClient } from "@/lib/supabase/server";
import { parseUserPlan, type UserPlan } from "@/types/profile";

/** 현재 로그인 유저의 플랜 조회 (profiles 행이 없으면 free) */
export async function getCurrentUserPlan(userId: string): Promise<UserPlan> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle();

  return parseUserPlan(data?.plan);
}
