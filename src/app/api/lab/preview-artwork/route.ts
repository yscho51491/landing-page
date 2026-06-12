import { handlePreviewArtworkPost } from "@/lib/lab/handle-preview-artwork";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  return handlePreviewArtworkPost(request);
}
