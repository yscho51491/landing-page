import { getCurrentUserCoins } from "@/lib/coins/get-coins";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function handleGetCoinsGet() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const coins = await getCurrentUserCoins(user.id);
  return NextResponse.json({ coins });
}
