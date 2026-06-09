import { handleGeneratePptOutlinePost } from "@/lib/lesson/handle-generate-image";

export const maxDuration = 60;

export async function POST(request: Request) {
  return handleGeneratePptOutlinePost(request);
}
