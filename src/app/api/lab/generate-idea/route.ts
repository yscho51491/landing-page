import { handleGenerateIdeaPost } from "@/lib/lab/handle-generate-idea";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  return handleGenerateIdeaPost(request);
}
