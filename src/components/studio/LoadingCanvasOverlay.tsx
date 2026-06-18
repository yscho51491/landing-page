"use client";

import CanvasFillAnimation from "@/components/studio/CanvasFillAnimation";

type LoadingCanvasOverlayProps = {
  message: string;
  submessage?: string;
  className?: string;
};

/** 캔버스 채우기 애니메이션 + 로딩 문구 (전체 화면 오버레이) */
export default function LoadingCanvasOverlay({
  message,
  submessage,
  className = "fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5 backdrop-blur-[2px]",
}: LoadingCanvasOverlayProps) {
  return (
    <div className={className} role="status" aria-live="polite" aria-busy="true">
      <div className="w-full max-w-md rounded-2xl bg-surface px-8 py-10 text-center shadow-xl">
        <CanvasFillAnimation />

        <p className="mt-6 text-base font-semibold text-foreground">{message}</p>

        {submessage ? (
          <p className="mt-2 text-sm text-muted">{submessage}</p>
        ) : null}
      </div>
    </div>
  );
}

type CanvasLoadingBlockProps = {
  message: string;
  detail?: string;
  size?: "sm" | "md";
};

/** 패널 안 인라인 로딩 (이미지 생성 중 등) */
export function CanvasLoadingBlock({
  message,
  detail,
  size = "sm",
}: CanvasLoadingBlockProps) {
  return (
    <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-border bg-surface px-4 py-6 text-center">
      <CanvasFillAnimation size={size} />
      <p className="mt-4 text-sm font-medium text-foreground">{message}</p>
      {detail ? <p className="mt-2 text-xs text-muted">{detail}</p> : null}
    </div>
  );
}
