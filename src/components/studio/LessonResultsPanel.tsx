"use client";

import LessonPlanView from "@/components/studio/LessonPlanView";
import type { PublishStatus } from "@/components/studio/StudioWorkspace";
import TeacherScriptView from "@/components/studio/TeacherScriptView";
import { IMAGE_ASSET_META } from "@/lib/lesson/mock-generate";
import type {
  ImageAssetKind,
  ImageAssetState,
  LessonInput,
  LessonTextOutput,
  ResultTabId,
} from "@/types/lesson";
import type { UserPlan } from "@/types/profile";
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
  plan: UserPlan;
  publishStatus: PublishStatus;
  publishError: string | null;
  onRequestPublish: () => void;
};

function PublishSection({
  plan,
  publishStatus,
  publishError,
  canPublish,
  onRequestPublish,
}: {
  plan: UserPlan;
  publishStatus: PublishStatus;
  publishError: string | null;
  canPublish: boolean;
  onRequestPublish: () => void;
}) {
  if (publishStatus === "published") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
        이 수업이 메인 페이지 <strong>수업 아이디어</strong>에 공개되었습니다.
      </div>
    );
  }

  if (plan === "free") {
    return (
      <div className="rounded-2xl border border-border bg-surface-alt/60 px-5 py-4 text-sm text-muted">
        {publishStatus === "publishing" ? (
          <span>메인 페이지에 공개하는 중...</span>
        ) : publishStatus === "error" ? (
          <span className="text-red-600">
            자동 공개에 실패했습니다. {publishError}
          </span>
        ) : (
          <span>
            <strong className="text-foreground">무료 플랜</strong> · 예시작품이
            완성되면 이 수업이 메인 페이지에 자동으로 공개됩니다.
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-alt/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted">
        {publishStatus === "error" ? (
          <span className="text-red-600">공개에 실패했습니다. {publishError}</span>
        ) : canPublish ? (
          <span>이 수업을 메인 페이지 수업 아이디어에 공개할 수 있습니다.</span>
        ) : (
          <span>예시작품을 먼저 생성하면 메인 페이지에 공개할 수 있습니다.</span>
        )}
      </div>
      <button
        type="button"
        onClick={onRequestPublish}
        disabled={!canPublish || publishStatus === "publishing"}
        className="shrink-0 rounded-full bg-emphasis px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {publishStatus === "publishing" ? "공개하는 중..." : "메인에 공개하기"}
      </button>
    </div>
  );
}

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
  plan,
  publishStatus,
  publishError,
  onRequestPublish,
}: LessonResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<ResultTabId>("lessonPlan");
  const canPublish =
    imageAssets.sampleArt.status === "ready" &&
    (imageAssets.sampleArt.images?.length ?? 0) > 0;

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
          버튼을 누르면 AI가 이미지를 생성합니다. 활동지·예시작품은 각 3장입니다.
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

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {(Object.keys(IMAGE_ASSET_META) as ImageAssetKind[]).map((kind) => (
            <ImageAssetPreview
              key={kind}
              kind={kind}
              state={imageAssets[kind]}
            />
          ))}
        </div>
      </div>

      <PublishSection
        plan={plan}
        publishStatus={publishStatus}
        publishError={publishError}
        canPublish={canPublish}
        onRequestPublish={onRequestPublish}
      />
    </div>
  );
}
