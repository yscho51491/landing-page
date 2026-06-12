import { createClient } from "@/lib/supabase/server";

/** 현재 로그인 유저의 아트랩 코인 잔액 (profiles 없으면 0) */
export async function getCurrentUserCoins(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("coins")
    .eq("id", userId)
    .maybeSingle();

  const coins = data?.coins;
  return typeof coins === "number" && coins >= 0 ? coins : 0;
}
