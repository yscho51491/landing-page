import { handlePublishLessonPost } from "@/lib/lesson/handle-publish-lesson";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  return handlePublishLessonPost(request);
}
