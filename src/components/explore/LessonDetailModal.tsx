"use client";

import type { LessonExample } from "@/data/lessonExamples";
import { getLessonExampleImageSrc } from "@/data/lessonExamples";
import type { LabLessonIdea } from "@/types/lab";
import Image from "next/image";
import { useEffect } from "react";

type LessonDetailModalProps = {
  item: LessonExample;
  detail: LabLessonIdea | null;
  onClose: () => void;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-bold text-foreground">{children}</h3>
  );
}

export default function LessonDetailModal({
  item,
  detail,
  onClose,
}: LessonDetailModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={detail?.title ?? item.title}
    >
      <div
        className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 이미지 영역 */}
        <div className="flex max-h-[40vh] shrink-0 items-center justify-center bg-[#111] md:max-h-none md:w-1/2">
          <Image
            src={getLessonExampleImageSrc(item.imageSrc)}
            alt={item.imageAlt}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
            className="h-auto max-h-[40vh] w-auto max-w-full object-contain md:max-h-[85vh]"
          />
        </div>

        {/* 상세 영역 */}
        <div className="relative flex-1 overflow-y-auto p-6 md:max-h-[85vh] md:p-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-emphasis hover:text-emphasis"
          >
            ✕
          </button>

          <h2 className="pr-10 text-xl font-bold text-foreground md:text-2xl">
            {detail?.title ?? item.title}
          </h2>

          {detail ? (
            <div className="mt-6 space-y-7">
              <section>
                <SectionTitle>📌 수업 개요</SectionTitle>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted">
                  {detail.overview}
                </p>
              </section>

              {detail.goals.length > 0 && (
                <section>
                  <SectionTitle>🎯 학습 목표</SectionTitle>
                  <ul className="mt-2 space-y-1.5">
                    {detail.goals.map((goal, i) => (
                      <li key={i} className="text-sm leading-relaxed text-muted">
                        ✔️ {goal}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {detail.materials.length > 0 && (
                <section>
                  <SectionTitle>🧰 준비물</SectionTitle>
                  <div className="mt-2 overflow-hidden rounded-xl border border-border">
                    {detail.materials.map((group, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 px-4 py-2.5 text-sm ${
                          i % 2 === 0 ? "bg-surface-alt/60" : "bg-surface"
                        }`}
                      >
                        <span className="w-20 shrink-0 font-semibold text-foreground">
                          {group.category}
                        </span>
                        <span className="text-muted">
                          {group.items.join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {detail.process.length > 0 && (
                <section>
                  <SectionTitle>⏳ 수업 과정</SectionTitle>
                  <div className="mt-2 space-y-4">
                    {detail.process.map((step, i) => (
                      <div key={i}>
                        <p className="text-sm font-semibold text-foreground">
                          {step.title}
                        </p>
                        <ul className="mt-1 space-y-1 pl-1">
                          {step.points.map((point, j) => (
                            <li
                              key={j}
                              className="text-sm leading-relaxed text-muted"
                            >
                              · {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {detail.expectedEffects.length > 0 && (
                <section>
                  <SectionTitle>✨ 기대 효과</SectionTitle>
                  <ul className="mt-2 space-y-1.5">
                    {detail.expectedEffects.map((effect, i) => (
                      <li key={i} className="text-sm leading-relaxed text-muted">
                        ✔️ {effect}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">
              이 작품의 수업 상세가 아직 등록되지 않았어요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
