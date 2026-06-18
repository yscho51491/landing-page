import { lessonExamples, type LessonExample } from "@/data/lessonExamples";
import fs from "node:fs";
import path from "node:path";

const EXPLORE_DIR = path.join(process.cwd(), "public", "images", "explore");

function getExploreFilenames(): Set<string> {
  if (!fs.existsSync(EXPLORE_DIR)) {
    return new Set();
  }
  return new Set(fs.readdirSync(EXPLORE_DIR));
}

/** explore 폴더에 실제 파일이 있는 항목만 반환 (삭제된 이미지 제외) */
export function filterLessonExamplesByExistingFiles(
  items: LessonExample[] = lessonExamples,
): LessonExample[] {
  const files = getExploreFilenames();

  return items.filter((item) => {
    if (!item.imageSrc.startsWith("/images/explore/")) {
      return true;
    }
    const filename = item.imageSrc.slice("/images/explore/".length);
    return files.has(filename);
  });
}
