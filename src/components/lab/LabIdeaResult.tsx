"use client";

import { fetchPreviewArtwork } from "@/lib/lab/fetch-preview-artwork";
import type { LabLessonIdea } from "@/types/lab";
import Image from "next/image";
import { useState } from "react";

type LabIdeaResultProps = {
  idea: LabLessonIdea;
  words: [string, string];
  coins: number;
  onCoinsChange: (coins: number) => void;
  onReset: () => void;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold text-foreground">{children}</h3>;
}

export default function LabIdeaResult({
  idea,
  words,
  coins,
  onCoinsChange,
  onReset,
}: LabIdeaResultProps) {
  const [showCoinNotice, setShowCoinNotice] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handlePreviewClick = () => {
    if (isPreviewing) return;
    setPreviewError(null);
    setShowCoinNotice(true);
  };

  const handlePreviewCancel = () => {
    setShowCoinNotice(false);
  };

  const handlePreviewConfirm = async () => {
    if (isPreviewing) return;
    setShowCoinNotice(false);
    setIsPreviewing(true);
    setPreviewError(null);
    setPreviewNotice("아트랩코인 1개가 차감됩니다.");

    try {
      const result = await fetchPreviewArtwork(idea, words);
      setPreviewImage(result.imageDataUrl);
      setPreviewNotice(result.notice);
      onCoinsChange(result.coins);
    } catch (err) {
      setPreviewNotice(null);
      setPreviewError(
        err instanceof Error ? err.message : "완성작 미리보기에 실패했습니다.",
      );
    } finally {
      setIsPreviewing(false);
    }
  };

  return (
    <div className="text-left">
      <p className="text-center text-xs font-semibold tracking-wide text-emphasis">
        {words[0]} × {words[1]}
      </p>
      <h2
        id="lab-idea-result-title"
        className="mt-2 text-center text-xl font-bold text-foreground md:text-2xl"
      >
        {idea.title}
      </h2>
      <p className="mt-2 text-center text-xs font-medium text-muted">
        보유 아트랩코인 {coins}개
      </p>

      <div className="mt-6 space-y-6">
        <section>
          <SectionTitle>📌 수업 개요</SectionTitle>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted">
            {idea.overview}
          </p>
        </section>

        <section>
          <SectionTitle>🎯 학습 목표</SectionTitle>
          <ul className="mt-2 space-y-1.5">
            {idea.goals.map((goal, i) => (
              <li key={i} className="text-sm leading-relaxed text-muted">
                ✔️ {goal}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle>🧰 준비물</SectionTitle>
          <div className="mt-2 overflow-hidden rounded-xl border border-border">
            {idea.materials.map((group, i) => (
              <div
                key={i}
                className={`flex gap-3 px-4 py-2.5 text-sm ${
                  i % 2 === 0 ? "bg-surface-alt/60" : "bg-surface"
                }`}
              >
                <span className="w-20 shrink-0 font-semibold text-foreground">
                  {group.category}
                </span>
                <span className="text-muted">{group.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>⏳ 수업 과정</SectionTitle>
          <div className="mt-2 space-y-4">
            {idea.process.map((step, i) => (
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

        <section>
          <SectionTitle>✨ 기대 효과</SectionTitle>
          <ul className="mt-2 space-y-1.5">
            {idea.expectedEffects.map((effect, i) => (
              <li key={i} className="text-sm leading-relaxed text-muted">
                ✔️ {effect}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {showCoinNotice && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4 text-center">
          <p className="text-sm font-semibold text-foreground">
            아트랩코인 1개가 차감됩니다.
          </p>
          <p className="mt-1 text-xs text-muted">
            완성작 미리보기를 생성하시겠습니까?
          </p>
          <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handlePreviewConfirm}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              확인
            </button>
            <button
              type="button"
              onClick={handlePreviewCancel}
              className="rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-bold text-muted transition-colors hover:border-emphasis hover:text-emphasis"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {previewNotice && (
        <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-center text-sm font-medium text-foreground">
          {previewNotice}
          {previewNotice.includes("차감") && (
            <span className="mt-1 block text-xs text-muted">
              남은 코인 {coins}개
            </span>
          )}
        </p>
      )}

      {previewError && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
          {previewError}
        </p>
      )}

      {previewImage && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface-alt/40 p-3">
          <p className="mb-3 text-center text-sm font-semibold text-foreground">
            완성작 미리보기
          </p>
          <Image
            src={previewImage}
            alt={`${idea.title} 완성작 미리보기`}
            width={1024}
            height={1536}
            unoptimized
            className="mx-auto h-auto w-full max-w-md rounded-xl shadow-md"
          />
        </div>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          disabled={isPreviewing}
          className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          새로운 아이디어 만들기
        </button>
        <button
          type="button"
          onClick={handlePreviewClick}
          disabled={isPreviewing || coins < 1 || showCoinNotice}
          className="rounded-full border-2 border-primary bg-surface px-7 py-3 text-sm font-bold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPreviewing ? "미리보기 생성 중..." : "이 수업 완성작 미리보기"}
        </button>
      </div>
    </div>
  );
}
