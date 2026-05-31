"use client";

import { exampleGalleryImages } from "@/data/exampleGalleryImages";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type ExampleImageGalleryProps = {
  intro?: string;
  showIntro?: boolean;
};

export default function ExampleImageGallery({
  intro = "👇 실제 AI 생성 결과물 예시",
  showIntro = true,
}: ExampleImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeItem =
    activeIndex !== null ? exampleGalleryImages[activeIndex] : null;

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current - 1 + exampleGalleryImages.length) %
          exampleGalleryImages.length,
    );
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current + 1) % exampleGalleryImages.length,
    );
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showNext, showPrev]);

  return (
    <>
      {showIntro && (
        <p className="mb-5 text-sm font-medium text-muted">
          {intro}{" "}
          <span className="text-xs text-muted/80">
            (클릭하면 크게 볼 수 있어요)
          </span>
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {exampleGalleryImages.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label={`${item.label} 크게 보기`}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-surface-alt">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                unoptimized={item.id === "ppt"}
                className={`transition-transform duration-500 group-hover:scale-[1.02] ${
                  item.thumbFit === "contain"
                    ? "object-contain object-center p-1"
                    : "object-cover object-top"
                }`}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <span className="absolute right-2 bottom-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                🔍 확대
              </span>
            </div>
            <p className="px-2 py-2.5 text-xs font-semibold text-foreground md:text-sm">
              {item.label}
            </p>
          </button>
        ))}
      </div>

      {activeItem && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.label} 미리보기`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={close}
            aria-label="배경 클릭하여 닫기"
          />

          <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col">
            <div className="mb-3 flex items-center justify-center px-1">
              <p className="text-sm font-semibold text-white md:text-base">
                {activeItem.label}
              </p>
            </div>

            <div className="relative h-[70vh] min-h-[320px] w-full overflow-hidden rounded-2xl bg-white shadow-2xl md:h-[78vh]">
              <button
                type="button"
                onClick={close}
                className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg text-white shadow-md transition-colors hover:bg-black/80"
                aria-label="닫기"
              >
                ✕
              </button>
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                unoptimized={activeItem.id === "ppt"}
                className="object-contain p-2 md:p-4"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={showPrev}
                className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
              >
                ← 이전
              </button>
              <span className="text-sm text-white/80">
                {activeIndex + 1} / {exampleGalleryImages.length}
              </span>
              <button
                type="button"
                onClick={showNext}
                className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
              >
                다음 →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
