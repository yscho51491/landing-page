import { handleGenerateImagePost } from "@/lib/lesson/handle-generate-image";

export const maxDuration = 120;

export async function POST(request: Request) {
  return handleGenerateImagePost(request);
}
