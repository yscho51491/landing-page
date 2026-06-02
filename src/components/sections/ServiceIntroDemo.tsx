"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const inputFields = [
  { step: "1", label: "수업 주제", value: "여름 수박" },
  { step: "2", label: "수업 대상 연령", value: "5~6세 아동" },
  { step: "3", label: "수업 시간", value: "30분" },
  { step: "4", label: "필수 반영사항 (선택)", value: "푸드 아트 수업으로 기획" },
];

type ImageFit = "cover-top" | "contain-center" | "cover-center";

type OutputItem = {
  label: string;
  image: string;
  alt: string;
  fit: ImageFit;
};

const outputItems: OutputItem[] = [
  {
    label: "수업 계획서",
    image: "/images/summer-demo/lesson-plan.png",
    alt: "여름 수박 푸드 아트 수업 계획서",
    fit: "cover-top",
  },
  {
    label: "활동지",
    image: "/images/summer-demo/worksheet.png",
    alt: "수박 활동지 예시",
    fit: "cover-top",
  },
  {
    label: "도안",
    image: "/images/summer-demo/design.png",
    alt: "수박 도안 예시",
    fit: "contain-center",
  },
  {
    label: "예시작품",
    image: "/images/summer-demo/sample-1.png",
    alt: "수박 푸드 아트 예시작품",
    fit: "cover-center",
  },
  {
    label: "PPT",
    image: "/images/summer-demo/ppt-1.png",
    alt: "수업용 PPT 슬라이드",
    fit: "cover-top",
  },
  {
    label: "교사대본",
    image: "/images/summer-demo/teacher-script.png",
    alt: "교사 진행 대본 예시",
    fit: "cover-top",
  },
];

const imageFitClass: Record<ImageFit, string> = {
  "cover-top": "object-cover object-top",
  "contain-center": "object-contain object-center",
  "cover-center": "object-cover object-center",
};

const CHAR_DELAY = 70;
const FIELD_PAUSE = 600;
const BOX_INTERVAL = 2400;
const RESET_PAUSE = 700;

type Phase = "typing" | "outputs" | "resetting";

export default function ServiceIntroDemo() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [fieldIndex, setFieldIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayValues, setDisplayValues] = useState<string[]>(
    inputFields.map(() => ""),
  );
  const [activeOutputIndex, setActiveOutputIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    if (phase !== "typing") return;

    const currentValue = inputFields[fieldIndex].value;

    if (charIndex < currentValue.length) {
      const timer = setTimeout(() => {
        setDisplayValues((prev) => {
          const next = [...prev];
          next[fieldIndex] = currentValue.slice(0, charIndex + 1);
          return next;
        });
        setCharIndex((c) => c + 1);
      }, CHAR_DELAY);
      return () => clearTimeout(timer);
    }

    if (fieldIndex < inputFields.length - 1) {
      const timer = setTimeout(() => {
        setFieldIndex((f) => f + 1);
        setCharIndex(0);
      }, FIELD_PAUSE);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setActiveOutputIndex(0);
      setPhase("outputs");
    }, FIELD_PAUSE);
    return () => clearTimeout(timer);
  }, [phase, fieldIndex, charIndex]);

  useEffect(() => {
    if (phase !== "outputs") return;

    const interval = setInterval(() => {
      setActiveOutputIndex((i) => {
        if (i >= outputItems.length - 1) {
          setPhase("resetting");
          return 0;
        }
        return i + 1;
      });
    }, BOX_INTERVAL);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "resetting") return;
    const timer = setTimeout(() => {
      setDisplayValues(inputFields.map(() => ""));
      setFieldIndex(0);
      setCharIndex(0);
      setActiveOutputIndex(0);
      setPhase("typing");
    }, RESET_PAUSE);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, closeLightbox]);

  const showOutputs = phase === "outputs" || phase === "resetting";
  const isResetting = phase === "resetting";
  const lightboxItem =
    lightboxIndex !== null ? outputItems[lightboxIndex] : null;

  return (
    <>
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <div>
          <p className="mb-6 text-base font-medium text-foreground">
            선생님이 입력하는 정보는 간단합니다.
          </p>
          <div className="space-y-4">
            {inputFields.map((item, index) => {
              const isActive =
                phase === "typing" &&
                index === fieldIndex &&
                charIndex < item.value.length;
              const hasValue = displayValues[index].length > 0;

              return (
                <div
                  key={item.step}
                  className={`flex items-center gap-4 rounded-xl border bg-surface p-4 shadow-sm transition-all duration-300 ${
                    phase === "typing" && index === fieldIndex
                      ? "border-accent/50 ring-2 ring-accent/20"
                      : hasValue
                        ? "border-primary/30"
                        : "border-border"
                  } ${isResetting ? "opacity-40" : "opacity-100"}`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted">
                      {item.label}
                    </p>
                    <p className="mt-0.5 min-h-[1.5rem] font-semibold text-foreground">
                      {hasValue ? (
                        <>
                          <span className="text-emphasis">
                            {displayValues[index]}
                          </span>
                          {isActive && (
                            <span className="typing-cursor ml-0.5 inline-block w-0.5 animate-pulse bg-emphasis">
                              |
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-muted/40">입력 대기...</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`rounded-2xl border border-border bg-surface p-6 shadow-lg transition-opacity duration-500 md:p-8 ${
            isResetting ? "opacity-50" : "opacity-100"
          }`}
        >
          <p className="text-center text-lg leading-relaxed text-muted">
            이 정보를 입력하면
            <br />
            <strong className="text-foreground">
              AI가 실제 수업에 바로 활용할 수 있는
            </strong>
            <br />
            <span className="text-xl font-bold text-emphasis">자료 패키지</span>
            를 생성합니다.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {outputItems.map((item, index) => {
              const isHighlighted =
                phase === "outputs" && index === activeOutputIndex;
              const hasShown =
                phase === "outputs" && index <= activeOutputIndex;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (phase === "outputs") setLightboxIndex(index);
                  }}
                  disabled={phase !== "outputs"}
                  className={`relative min-h-[5.5rem] overflow-hidden rounded-lg bg-surface-alt text-left transition-all duration-500 ${
                    isHighlighted
                      ? "ring-2 ring-primary shadow-md"
                      : "ring-1 ring-transparent"
                  } ${phase === "outputs" ? "cursor-zoom-in" : "cursor-default"}`}
                  aria-label={`${item.label} 크게 보기`}
                >
                  <span
                    className={`absolute inset-0 flex items-center justify-center px-2 text-center text-sm font-medium transition-opacity duration-500 ${
                      isHighlighted ? "opacity-20" : "opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>

                  {showOutputs && !isResetting && (
                    <div
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        isHighlighted
                          ? "opacity-100"
                          : hasShown
                            ? "opacity-0"
                            : "opacity-0"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        unoptimized
                        className={imageFitClass[item.fit]}
                        sizes="(max-width: 768px) 45vw, 200px"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                        <p className="text-center text-[10px] font-semibold text-white md:text-xs">
                          {item.label}
                        </p>
                      </div>
                      {isHighlighted && (
                        <span className="absolute top-1.5 right-1.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[9px] text-white">
                          🔍
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {phase === "outputs" && (
            <p className="mt-4 animate-pulse-soft text-center text-xs font-medium text-emphasis">
              ✨ {outputItems[activeOutputIndex].label} 생성 중... (클릭하면
              크게 볼 수 있어요)
            </p>
          )}
        </div>
      </div>

      {lightboxItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxItem.label} 미리보기`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeLightbox}
            aria-label="배경 클릭하여 닫기"
          />

          <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col">
            <p className="mb-3 text-center text-sm font-semibold text-white md:text-base">
              {lightboxItem.label}
            </p>

            <div className="relative h-[70vh] min-h-[320px] w-full overflow-hidden rounded-2xl bg-white shadow-2xl md:h-[78vh]">
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg text-white shadow-md transition-colors hover:bg-black/80"
                aria-label="닫기"
              >
                ✕
              </button>
              <Image
                src={lightboxItem.image}
                alt={lightboxItem.alt}
                fill
                unoptimized
                className={`p-2 md:p-4 ${imageFitClass[lightboxItem.fit]}`}
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
