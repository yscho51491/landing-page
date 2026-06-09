"use client";

import CanvasFillAnimation from "@/components/studio/CanvasFillAnimation";
import { useEffect, useState } from "react";

const ROTATING_MESSAGES = [
  "지금 수업계획서를 만들고 있어요.",
  "수업 대본을 함께 작성하고 있어요.",
  "기대효과와 수업 목표를 생각하고 있어요.",
  "대상자의 반응을 고려하고 있어요.",
] as const;

const MESSAGE_INTERVAL_MS = 2800;

export default function LessonGeneratingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-md rounded-2xl bg-surface px-8 py-10 text-center shadow-xl">
        <CanvasFillAnimation />

        <p className="mt-6 min-h-[1.75rem] text-base font-semibold text-foreground transition-opacity duration-300">
          {ROTATING_MESSAGES[messageIndex]}
        </p>

        <p className="mt-3 text-sm font-medium text-emphasis">
          완성까지 약 1~2분이 소요됩니다.
        </p>

        <p className="mt-2 text-xs text-muted">
          창을 닫지 말고 잠시만 기다려 주세요.
        </p>
      </div>
    </div>
  );
}
