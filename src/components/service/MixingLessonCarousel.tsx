"use client";

import LessonDetailModal from "@/components/explore/LessonDetailModal";
import { lessonExampleDetails } from "@/data/lessonExampleDetails";
import {
  getLessonExampleImageSrc,
  lessonExamples,
  type LessonExample,
} from "@/data/lessonExamples";
import { MIXING_LESSON_SHOWCASE } from "@/data/service-page-content";
import type { LabLessonIdea } from "@/types/lab";
import Image from "next/image";
import { useMemo, useState } from "react";

type ShowcaseItem = {
  example: LessonExample;
  detail: LabLessonIdea | null;
  bgColor: string;
  words: string;
};

function buildShowcaseItems(): ShowcaseItem[] {
  return MIXING_LESSON_SHOWCASE.map((entry) => {
    const example = lessonExamples.find((e) => e.id === entry.lessonExampleId);
    if (!example) {
      throw new Error(`Missing lesson example: ${entry.lessonExampleId}`);
    }

    return {
      example,
      detail: lessonExampleDetails[entry.lessonExampleId] ?? null,
      bgColor: entry.bgColor,
      words: entry.words,
    };
  });
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "이전 예시" : "다음 예시"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-lg text-white transition-colors hover:bg-white/15"
    >
      {direction === "prev" ? "←" : "→"}
    </button>
  );
}

export default function MixingLessonCarousel() {
  const items = useMemo(() => buildShowcaseItems(), []);
  const [index, setIndex] = useState(0);
  const [modalItem, setModalItem] = useState<ShowcaseItem | null>(null);

  const current = items[index];

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  const handleSlideClick = (slideIndex: number) => {
    if (slideIndex === index) {
      setModalItem(current);
      return;
    }
    setIndex(slideIndex);
  };

  return (
    <>
      <div
        className="transition-colors duration-500 ease-out"
        style={{ backgroundColor: current.bgColor }}
      >
        <div className="relative mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-md space-y-3 text-white">
              <h2 className="text-xl font-bold leading-snug md:text-2xl">
                좋은 아이디어는
                <br />
                엉뚱한 조합에서 시작됩니다. 💡
              </h2>
              <p className="text-sm leading-relaxed text-white/90 md:text-base">
                매번 비슷한 주제만 떠오른다면, 두 개의 단어를 섞어보세요.
                <br />
                어울리지 않아 보이는 조합도 새로운 미술 수업이 됩니다.
              </p>
            </div>

            <div className="flex shrink-0 gap-2 pt-1">
              <CarouselArrow direction="prev" onClick={goPrev} />
              <CarouselArrow direction="next" onClick={goNext} />
            </div>
          </div>

          <div className="relative mx-auto mt-8 h-[340px] max-w-4xl sm:h-[400px] md:mt-10 md:h-[440px]">
            {items.map((item, i) => {
              const offset = i - index;
              if (Math.abs(offset) > 1) return null;

              const isActive = offset === 0;

              return (
                <button
                  key={item.example.id}
                  type="button"
                  onClick={() => handleSlideClick(i)}
                  aria-label={
                    isActive
                      ? `${item.example.title} 수업 상세 보기`
                      : `${item.example.title} 예시로 이동`
                  }
                  className="absolute top-1/2 left-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 ease-out"
                  style={{
                    width: isActive
                      ? "min(72vw, 320px)"
                      : "min(48vw, 220px)",
                    transform: `translate(calc(-50% + ${offset * 58}%), -50%) scale(${isActive ? 1 : 0.82})`,
                    opacity: isActive ? 1 : 0.55,
                    zIndex: isActive ? 20 : 10 - Math.abs(offset),
                  }}
                >
                  <Image
                    src={getLessonExampleImageSrc(item.example.imageSrc)}
                    alt={item.example.imageAlt}
                    width={640}
                    height={800}
                    unoptimized
                    className="aspect-[4/5] h-auto w-full object-cover"
                    priority={i === 0}
                  />
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3 text-left text-xs font-medium text-white">
                      탭하여 수업 계획 보기
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-center text-white">
            <p className="text-sm font-semibold text-white/80">{current.words}</p>
            <p className="mt-1 text-lg font-bold md:text-xl">{current.example.title}</p>
          </div>
        </div>
      </div>

      {modalItem && (
        <LessonDetailModal
          item={modalItem.example}
          detail={modalItem.detail}
          onClose={() => setModalItem(null)}
        />
      )}
    </>
  );
}
