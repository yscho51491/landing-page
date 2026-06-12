import LessonExploreGrid from "@/components/explore/LessonExploreGrid";
import Header from "@/components/layout/Header";
import { lessonExamples, type LessonExample } from "@/data/lessonExamples";
import { getPublishedLessonExamples } from "@/lib/explore/get-published-lessons";

export const dynamic = "force-dynamic";

function shuffle(items: LessonExample[]): LessonExample[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default async function Home() {
  const published = await getPublishedLessonExamples();
  // 공개 수업은 최신순 유지, 정적 예시만 셔플
  const items = [...published.items, ...shuffle(lessonExamples)];

  return (
    <>
      <Header />
      <main className="w-full">
        <LessonExploreGrid items={items} details={published.details} />
      </main>
    </>
  );
}
