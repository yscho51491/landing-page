"use client";

import StudioCtaButton from "@/components/auth/StudioCtaButton";
import Section, { SectionHeader } from "@/components/ui/Section";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const inputValues = [
  { label: "주제", value: "부모참여 수업" },
  { label: "대상", value: "5세 아동" },
  { label: "수업 시간", value: "50분" },
  {
    label: "필수 반영사항",
    value: [
      "부모와 아동 모두 만족하는 수업",
      "멋진 결과물",
      "재료비는 5천원 이내",
      "시간 내 완성 필수",
    ],
  },
];

const results = [
  "수업 계획서",
  "꽃액자 도안",
  "예시 완성작 이미지",
  "교사 진행 대본",
];

const galleryImages = [
  {
    src: "/images/parent-class/sample-1.png",
    alt: "우리 가족 꽃액자 도안",
    label: "꽃액자 도안",
  },
  {
    src: "/images/parent-class/sample-2.png",
    alt: "가족 꽃액자 색칠 활동지",
    label: "활동지",
  },
  {
    src: "/images/parent-class/design-1.png",
    alt: "우리 가족 꽃액자 예시 완성작",
    label: "예시 완성작",
  },
  {
    src: "/images/parent-class/design-2.png",
    alt: "가족 집 모양 꽃액자 예시 완성작",
    label: "예시 완성작",
  },
];

export default function GenerationExampleSection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxItem =
    lightboxIndex !== null ? galleryImages[lightboxIndex] : null;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

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

  return (
    <Section id="generation-example" alt>
      <SectionHeader
        emoji="🧑‍🏫"
        title="예를 들어, '부모참여' 수업을 입력하면"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
          <h3 className="mb-4 font-bold text-foreground">입력값</h3>
          <div className="space-y-3">
            {inputValues.map((item) => (
              <div key={item.label} className="text-sm md:text-base">
                <span className="font-medium text-muted">{item.label}:</span>{" "}
                {Array.isArray(item.value) ? (
                  <ul className="mt-1 space-y-0.5 text-foreground">
                    {item.value.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-foreground">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-primary/30 bg-surface p-6 shadow-sm md:p-8">
          <h3 className="mb-2 font-bold text-foreground">생성 결과 예시</h3>
          <p className="text-sm font-medium text-muted">수업명:</p>
          <p className="mt-1 text-lg font-bold text-emphasis">
            엄마 아빠와 함께 만드는 우리 가족 꽃액자
          </p>
          <p className="mt-4 text-sm font-medium text-muted">수업개요:</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground md:text-base">
            가족의 얼굴과 마음을 담은 입체 꽃액자 제작 수업. 결과물이 선명하고
            예쁘게 보이며, 부모와 아이가 함께 만든 추억 작품으로 가져갈 수 있어
            만족도가 높습니다.
          </p>
          <p className="mt-4 text-sm font-medium text-muted">제공 자료:</p>
          <ul className="mt-2 space-y-1">
            {results.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-foreground md:text-base"
              >
                <span className="text-emphasis">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <p className="mb-4 text-center text-sm font-medium text-muted">
          👇 AI가 생성한 수업자료 예시
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {galleryImages.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-md transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-emphasis focus-visible:outline-none"
              aria-label={`${item.label} 크게 보기`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-surface-alt">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  unoptimized
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <span className="absolute right-2 bottom-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  🔍
                </span>
              </div>
              <p className="px-2 py-2 text-center text-xs font-semibold text-foreground">
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <StudioCtaButton>내 주제로 수업자료 생성해보기</StudioCtaButton>
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
            <p className="mb-3 text-center text-sm font-semibold text-white">
              {lightboxItem.label}
            </p>
            <div className="relative h-[70vh] min-h-[320px] w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg text-white shadow-md hover:bg-black/80"
                aria-label="닫기"
              >
                ✕
              </button>
              <Image
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                fill
                unoptimized
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
