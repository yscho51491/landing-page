"use client";

import LessonGeneratingOverlay from "@/components/studio/LessonGeneratingOverlay";
import LessonInputForm from "@/components/studio/LessonInputForm";
import LessonResultsPanel from "@/components/studio/LessonResultsPanel";
import { fetchGenerateLesson } from "@/lib/lesson/fetch-generate";
import { fetchImageAssetSet } from "@/lib/lesson/fetch-generate-images";
import { fetchPublishLesson } from "@/lib/lesson/fetch-publish";
import { IMAGE_ASSET_META } from "@/lib/lesson/mock-generate";
import type {
  ImageAssetKind,
  ImageAssetState,
  LessonInput,
  LessonTextOutput,
} from "@/types/lesson";
import type { UserPlan } from "@/types/profile";
import { useCallback, useEffect, useRef, useState } from "react";

export type PublishStatus = "idle" | "publishing" | "published" | "error";

function initialImageAssets(): Record<ImageAssetKind, ImageAssetState> {
  return {
    worksheet: {
      status: "idle",
      label: IMAGE_ASSET_META.worksheet.label,
    },
    sampleArt: {
      status: "idle",
      label: IMAGE_ASSET_META.sampleArt.label,
    },
  };
}

type StudioWorkspaceProps = {
  plan: UserPlan;
};

export default function StudioWorkspace({ plan }: StudioWorkspaceProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [input, setInput] = useState<LessonInput | null>(null);
  const [output, setOutput] = useState<LessonTextOutput | null>(null);
  const [imageAssets, setImageAssets] = useState(initialImageAssets);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageErrorMessage, setImageErrorMessage] = useState<string | null>(
    null,
  );
  const [openaiConfigured, setOpenaiConfigured] = useState<boolean | null>(
    null,
  );
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("idle");
  const [publishError, setPublishError] = useState<string | null>(null);
  const publishRequestedRef = useRef(false);

  const handlePublish = useCallback(
    async (
      lessonInput: LessonInput,
      lessonOutput: LessonTextOutput,
      coverImageDataUrl: string,
    ) => {
      if (publishRequestedRef.current) {
        return;
      }
      publishRequestedRef.current = true;
      setPublishStatus("publishing");
      setPublishError(null);

      try {
        await fetchPublishLesson(lessonInput, lessonOutput, coverImageDataUrl);
        setPublishStatus("published");
      } catch (err) {
        publishRequestedRef.current = false;
        setPublishStatus("error");
        setPublishError(
          err instanceof Error ? err.message : "수업 공개에 실패했습니다.",
        );
      }
    },
    [],
  );

  useEffect(() => {
    fetch("/api/lessons/health")
      .then((res) => res.json())
      .then((data: { openaiConfigured?: boolean }) => {
        setOpenaiConfigured(Boolean(data.openaiConfigured));
      })
      .catch(() => setOpenaiConfigured(null));
  }, []);

  const handleSubmit = async (lessonInput: LessonInput) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setImageErrorMessage(null);
    setInput(lessonInput);
    setOutput(null);
    setImageAssets(initialImageAssets());

    try {
      const result = await fetchGenerateLesson(lessonInput);
      setOutput(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "수업자료 생성에 실패했습니다.";
      setErrorMessage(message);
      setInput(null);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRequestImage = useCallback(
    async (kind: ImageAssetKind) => {
      if (!input || !output) {
        return;
      }

      setImageErrorMessage(null);
      setImageAssets((prev) => ({
        ...prev,
        [kind]: {
          ...prev[kind],
          status: "loading",
          progressCompleted: 0,
          progressTotal: IMAGE_ASSET_META[kind].imageCount,
          progressLabel: "준비 중...",
        },
      }));

      try {
        const { images } = await fetchImageAssetSet(
          kind,
          input,
          output,
          (progress) => {
            setImageAssets((prev) => ({
              ...prev,
              [kind]: {
                ...prev[kind],
                status: "loading",
                progressCompleted: progress.completed,
                progressTotal: progress.total,
                progressLabel: progress.label,
              },
            }));
          },
        );

        setImageAssets((prev) => ({
          ...prev,
          [kind]: {
            ...prev[kind],
            status: "ready",
            images,
            previewSrc: images[0],
            progressLabel: undefined,
          },
        }));

        // 무료 플랜: 예시작품 완성 시 메인 페이지에 자동 공개
        if (kind === "sampleArt" && plan === "free" && images[0]) {
          void handlePublish(input, output, images[0]);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "이미지 생성에 실패했습니다.";
        setImageErrorMessage(message);
        setImageAssets((prev) => ({
          ...prev,
          [kind]: {
            ...prev[kind],
            status: "idle",
            progressLabel: undefined,
            progressCompleted: undefined,
            progressTotal: undefined,
          },
        }));
      }
    },
    [input, output, plan, handlePublish],
  );

  const handleReset = () => {
    setInput(null);
    setOutput(null);
    setImageAssets(initialImageAssets());
    setErrorMessage(null);
    setImageErrorMessage(null);
    setPublishStatus("idle");
    setPublishError(null);
    publishRequestedRef.current = false;
  };

  const handleRequestPublish = useCallback(() => {
    const cover = imageAssets.sampleArt.images?.[0];
    if (!input || !output || !cover) {
      return;
    }
    void handlePublish(input, output, cover);
  }, [input, output, imageAssets.sampleArt.images, handlePublish]);

  const showResults = Boolean(input && output);

  return (
    <div className="relative mx-auto max-w-5xl">
      {isGenerating && <LessonGeneratingOverlay />}

      {!showResults && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              오늘 수업, <span className="text-emphasis">3분</span> 만에 준비해
              보세요
            </h1>
            <p className="mt-2 text-sm text-muted md:text-base">
              1차: 수업 계획서 · 대본 · 2차: 활동지, 예시작품 (버튼별 생성)
            </p>
          </div>

          {openaiConfigured === false && (
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <strong>OpenAI API 키가 서버에 없습니다.</strong>
              <br />
              프로젝트 폴더의 <code className="text-xs">.env.local</code>에{" "}
              <code className="text-xs">OPENAI_API_KEY=sk-...</code> 를 추가하고
              개발 서버를 재시작해 주세요. (Vercel 배포 시 Environment Variables에도
              추가)
            </div>
          )}

          {errorMessage && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <LessonInputForm
            onSubmit={handleSubmit}
            isSubmitting={isGenerating}
          />
        </>
      )}

      {showResults && input && output && (
        <>
          {imageErrorMessage && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {imageErrorMessage}
            </p>
          )}
          <LessonResultsPanel
            input={input}
            output={output}
            imageAssets={imageAssets}
            onRequestImage={handleRequestImage}
            onReset={handleReset}
            plan={plan}
            publishStatus={publishStatus}
            publishError={publishError}
            onRequestPublish={handleRequestPublish}
          />
        </>
      )}
    </div>
  );
}
