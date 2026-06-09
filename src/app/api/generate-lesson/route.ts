import { handleGenerateLessonPost } from "@/lib/lesson/handle-generate-lesson";

export async function POST(request: Request) {
  return handleGenerateLessonPost(request);
}
