"use client";

import LessonPlanView from "@/components/studio/LessonPlanView";
import TeacherScriptView from "@/components/studio/TeacherScriptView";
import { downloadImagesAsZip } from "@/lib/lesson/download-image-zip";
import { IMAGE_ASSET_META } from "@/lib/lesson/mock-generate";
import type {
  ImageAssetKind,
  ImageAssetState,
  LessonInput,
  LessonTextOutput,
  ResultTabId,
} from "@/types/lesson";
import Image from "next/image";
import { useState } from "react";

const TEXT_TABS: { id: ResultTabId; label: string }[] = [
  { id: "lessonPlan", label: "수업 계획서" },
  { id: "teacherScript", label: "수업 대본" },
];

type LessonResultsPanelProps = {
  input: LessonInput;
  output: LessonTextOutput;
  imageAssets: Record<ImageAssetKind, ImageAssetState>;
  onRequestImage: (kind: ImageAssetKind) => void;
  onReset: () => void;
};

function ImageAssetPreview({
  kind,
  state,
}: {
  kind: ImageAssetKind;
  state: ImageAssetState;
}) {
  const meta = IMAGE_ASSET_META[kind];
  const images = state.images ?? [];

  if (state.status === "loading") {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-border bg-surface px-4 py-6 text-center">
        <p className="text-sm font-medium text-foreground">{meta.label} 생성 중...</p>
        {state.progressTotal ? (
          <p className="mt-2 text-xs text-muted">
            {state.progressCompleted ?? 0}/{state.progressTotal}
            {state.progressLabel ? ` · ${state.progressLabel}` : ""}
          </p>
        ) : null}
      </div>
    );
  }

  if (state.status !== "ready" || images.length === 0) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-surface px-4 text-center text-xs text-muted">
        {meta.label} 대기
      </div>
    );
  }

  if (kind === "ppt") {
    return (
      <div className="rounded-xl border border-border bg-surface">
        <div className="max-h-[min(70vh,640px)] space-y-3 overflow-y-auto p-3">
          {images.map((src, index) => (
            <figure
              key={index}
              className="overflow-hidden rounded-lg border border-border/80 bg-surface-alt"
            >
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px]">
                <Image
                  src={src}
                  alt={`PPT 슬라이드 ${index + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <figcaption className="px-3 py-2 text-center text-xs text-muted">
                슬라이드 {index + 1}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="border-t border-border px-3 py-3">
          <button
            type="button"
            onClick={() =>
              downloadImagesAsZip(
                images,
                "수업용-ppt-slides.zip",
                "slide",
              )
            }
            className="w-full rounded-full border border-emphasis bg-surface px-4 py-2 text-sm font-semibold text-emphasis transition-colors hover:bg-emphasis/5"
          >
            ZIP 파일로 다운로드
          </button>
          <p className="mt-2 text-center text-xs text-muted">{meta.readyNote}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="grid gap-3">
        {images.map((src, index) => (
          <figure
            key={index}
            className="overflow-hidden rounded-lg border border-border/80 bg-surface-alt"
          >
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={src}
                alt={`${meta.label} ${index + 1}`}
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
            <figcaption className="px-2 py-1.5 text-center text-xs text-muted">
              {index + 1}번
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted">{meta.readyNote}</p>
    </div>
  );
}

export default function LessonResultsPanel({
  input,
  output,
  imageAssets,
  onRequestImage,
  onReset,
}: LessonResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<ResultTabId>("lessonPlan");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">생성 결과</h2>
          <p className="mt-1 text-sm text-muted">
            <span className="font-medium text-foreground">
              {output.lessonPlan.title || input.topic}
            </span>{" "}
            · {input.audience} · {input.duration}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-emphasis hover:text-emphasis"
        >
          새 수업 만들기
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
        <div
          className="flex gap-1 border-b border-border bg-surface-alt p-2"
          role="tablist"
        >
          {TEXT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-h-[min(70vh,720px)] overflow-y-auto p-6 md:p-8">
          {activeTab === "lessonPlan" ? (
            <LessonPlanView plan={output.lessonPlan} />
          ) : (
            <TeacherScriptView script={output.teacherScript} />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-surface-alt/60 p-5">
        <p className="text-sm font-semibold text-foreground">
          이미지 자료 (2차 생성)
        </p>
        <p className="mt-1 text-xs text-muted">
          버튼을 누르면 AI가 이미지를 생성합니다. 활동지·예시작품은 각 3장, PPT는
          슬라이드 10장입니다.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {(Object.keys(IMAGE_ASSET_META) as ImageAssetKind[]).map((kind) => {
            const meta = IMAGE_ASSET_META[kind];
            const state = imageAssets[kind];
            const isLoading = state.status === "loading";

            return (
              <button
                key={kind}
                type="button"
                onClick={() => onRequestImage(kind)}
                disabled={isLoading || state.status === "ready"}
                className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-emphasis hover:text-emphasis disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading
                  ? `${meta.label} 만드는 중...`
                  : state.status === "ready"
                    ? `✓ ${meta.label} 완료`
                    : `[${meta.label} 만들기]`}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {(Object.keys(IMAGE_ASSET_META) as ImageAssetKind[]).map((kind) => (
            <ImageAssetPreview
              key={kind}
              kind={kind}
              state={imageAssets[kind]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
