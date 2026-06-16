import { REFERRAL_SHARE_URL } from "@/lib/service/links";

export function buildReferralShareText(userEmail: string): string {
  return [
    "🎨 아트티쳐랩 — 미술 수업 아이디어를 두 단어로!",
    REFERRAL_SHARE_URL,
    "",
    `추천인 ID: ${userEmail}`,
    "",
    "가입 시 추천인 ID에 위 이메일을 입력하면 서로 아트랩코인 5개를 받을 수 있어요.",
  ].join("\n");
}

export function buildReferralMailSubject(): string {
  return "아트티쳐랩 추천 — 미술 수업 아이디어 서비스";
}
