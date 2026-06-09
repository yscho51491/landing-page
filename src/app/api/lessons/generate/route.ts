import { handleGenerateLessonPost } from "@/lib/lesson/handle-generate-lesson";

/** @deprecated /api/generate-lesson 사용 권장 */
export async function POST(request: Request) {
  return handleGenerateLessonPost(request);
}
