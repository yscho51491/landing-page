import { mapReferralError } from "@/lib/referral/referral-errors";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type ClaimBody = {
  referrerEmail?: unknown;
};

function parseReferrerEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > 254) return null;
  return email;
}

export async function handleClaimReferralPost(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문을 읽을 수 없습니다." },
      { status: 400 },
    );
  }

  const referrerEmail = parseReferrerEmail(
    (rawBody as ClaimBody)?.referrerEmail,
  );
  if (!referrerEmail) {
    return NextResponse.json(
      { error: "올바른 추천인 이메일을 입력해 주세요." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("claim_referral_bonus", {
    p_referrer_email: referrerEmail,
  });

  if (error) {
    return NextResponse.json(
      { error: mapReferralError(error.message) },
      { status: 400 },
    );
  }

  const coins =
    data && typeof data === "object" && "coins" in data
      ? Number((data as { coins: unknown }).coins)
      : undefined;

  return NextResponse.json({
    ok: true,
    coins: Number.isFinite(coins) ? coins : undefined,
    message:
      "추천인 보너스가 지급되었습니다! 나와 추천인에게 아트랩코인 5개가 추가되었어요.",
  });
}
