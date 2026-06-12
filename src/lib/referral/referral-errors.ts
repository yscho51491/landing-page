const REFERRAL_ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "로그인이 필요합니다.",
  INVALID_EMAIL: "올바른 추천인 이메일을 입력해 주세요.",
  SELF_REFERRAL: "본인 이메일은 추천인 ID로 사용할 수 없습니다.",
  REFERRER_NOT_FOUND: "해당 이메일로 가입한 회원을 찾을 수 없습니다.",
  ALREADY_CLAIMED: "이미 추천인 보너스를 받으셨습니다.",
  NOT_NEW_USER: "신규 가입 후 24시간 이내에만 추천인 보너스를 받을 수 있습니다.",
};

export function mapReferralError(message: string): string {
  for (const [code, text] of Object.entries(REFERRAL_ERROR_MESSAGES)) {
    if (message.includes(code)) {
      return text;
    }
  }
  return "추천인 보너스 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.";
}

export const PENDING_REFERRER_STORAGE_KEY = "artlab_pending_referrer_email";
