import { handleClaimReferralPost } from "@/lib/referral/handle-claim-referral";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleClaimReferralPost(request);
}
