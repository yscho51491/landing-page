"use client";

import { downloadLabLessonDocx } from "@/lib/export/export-lab-lesson-docx";
import { fetchPreviewArtwork } from "@/lib/lab/fetch-preview-artwork";
import type { LabLessonIdea } from "@/types/lab";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type LabIdeaResultProps = {
  idea: LabLessonIdea;
  words: [string, string];
  lessonId?: string;
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
  lessonId,
  coins,
  onCoinsChange,
  onReset,
}: LabIdeaResultProps) {
  const [showCoinNotice, setShowCoinNotice] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [publishedToMain, setPublishedToMain] = useState(false);

  const handlePreviewClick = () => {
    if (isPreviewing) return;
    setPreviewError(null);
    setPublishedToMain(false);
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
      const result = await fetchPreviewArtwork(idea, words, lessonId);
      setPreviewImage(result.imageDataUrl);
      setPreviewNotice(result.notice);
      setPublishedToMain(Boolean(result.publishedToMain));
      onCoinsChange(result.coins);
      if (result.publishError) {
        setPreviewError(
          `메인 화면 공개에 실패했습니다: ${result.publishError}`,
        );
      }
    } catch (err) {
      setPublishedToMain(false);
      setPreviewNotice(null);
      setPreviewError(
        err instanceof Error ? err.message : "완성작 미리보기에 실패했습니다.",
      );
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleWordExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await downloadLabLessonDocx(idea, words);
    } finally {
      setIsExporting(false);
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
        <div className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-center text-sm font-medium text-foreground">
          <p>{previewNotice}</p>
          {previewNotice.includes("차감") && (
            <span className="mt-1 block text-xs text-muted">
              남은 코인 {coins}개
            </span>
          )}
          {publishedToMain && (
            <Link
              href="/"
              className="mt-3 inline-block rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              홈에서 완성작 보기
            </Link>
          )}
        </div>
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

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
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
          onClick={() => void handleWordExport()}
          disabled={isPreviewing || isExporting}
          className="rounded-full border-2 border-border bg-surface px-7 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? "Word 저장 중..." : "Word 파일로 저장"}
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
