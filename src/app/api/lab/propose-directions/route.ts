import { handleProposeDirectionsPost } from "@/lib/lab/handle-propose-directions";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return handleProposeDirectionsPost(request);
}
