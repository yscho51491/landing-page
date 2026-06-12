import { createClient } from "@/lib/supabase/server";

const PREVIEW_COST = 1;

export { PREVIEW_COST };

export async function spendArtlabCoins(
  amount: number,
): Promise<{ ok: true; balance: number } | { ok: false; code: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("spend_artlab_coins", {
    amount,
  });

  if (error) {
    const code = error.message.includes("INSUFFICIENT_COINS")
      ? "INSUFFICIENT_COINS"
      : "SPEND_FAILED";
    return { ok: false, code };
  }

  return { ok: true, balance: typeof data === "number" ? data : 0 };
}

export async function refundArtlabCoins(
  amount: number,
): Promise<{ ok: true; balance: number } | { ok: false; code: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("refund_artlab_coins", {
    amount,
  });

  if (error) {
    return { ok: false, code: "REFUND_FAILED" };
  }

  return { ok: true, balance: typeof data === "number" ? data : 0 };
}
