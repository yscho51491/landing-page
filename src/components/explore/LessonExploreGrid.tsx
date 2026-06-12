"use client";

import LessonDetailModal from "@/components/explore/LessonDetailModal";
import { lessonExampleDetails } from "@/data/lessonExampleDetails";
import {
  getLessonExampleImageSrc,
  lessonExamples,
  type LessonExample,
} from "@/data/lessonExamples";
import type { LabLessonIdea } from "@/types/lab";
import Image from "next/image";
import { useState } from "react";

type LessonExploreGridProps = {
  items?: LessonExample[];
  /** 공개 수업 등 외부에서 주입하는 상세 (id 키) */
  details?: Record<string, LabLessonIdea>;
};

export default function LessonExploreGrid({
  items,
  details,
}: LessonExploreGridProps) {
  const displayItems = items ?? lessonExamples;
  const [selected, setSelected] = useState<LessonExample | null>(null);

  const detailFor = (item: LessonExample): LabLessonIdea | null =>
    details?.[item.id] ?? lessonExampleDetails[item.id] ?? null;

  return (
    <section className="min-h-[calc(100dvh-4.25rem)] w-full bg-[#f7f4ef] px-3 pb-6 pt-3 md:px-4 md:pt-4">
      <div className="columns-2 gap-3 sm:columns-3 md:columns-4 lg:columns-5 [column-fill:_balance]">
        {displayItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item)}
            className="group relative mb-3 block w-full overflow-hidden rounded-xl bg-surface transition-transform duration-200 [break-inside:avoid] hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`${item.title} 자세히 보기`}
          >
            <Image
              src={getLessonExampleImageSrc(item.imageSrc)}
              alt={item.imageAlt}
              width={0}
              height={0}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              unoptimized
              className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <p className="absolute right-0 bottom-0 left-0 px-3 py-2.5 text-left text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {item.title}
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <LessonDetailModal
          item={selected}
          detail={detailFor(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
