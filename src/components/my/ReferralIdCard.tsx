"use client";

import ReferralShareModal from "@/components/my/ReferralShareModal";
import { useEffect, useRef, useState } from "react";

const BORDER_RADIUS = 16;
const STROKE_WIDTH = 2.5;
const TRACE_MS = 1300;
const POP_MS = 450;

function roundedRectPerimeter(width: number, height: number, radius: number): number {
  const w = Math.max(width - STROKE_WIDTH, 0);
  const h = Math.max(height - STROKE_WIDTH, 0);
  const r = Math.min(radius, w / 2, h / 2);
  return 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;
}

type ReferralIdCardProps = {
  userEmail: string;
};

export default function ReferralIdCard({ userEmail }: ReferralIdCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [draw, setDraw] = useState(false);
  const [pop, setPop] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const updateSize = () => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);

    const startDraw = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setDraw(true));
    });

    const popTimer = window.setTimeout(() => setPop(true), TRACE_MS);
    const popEndTimer = window.setTimeout(() => setPop(false), TRACE_MS + POP_MS);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(startDraw);
      window.clearTimeout(popTimer);
      window.clearTimeout(popEndTimer);
    };
  }, []);

  const perimeter =
    size.w > 0 && size.h > 0
      ? roundedRectPerimeter(size.w, size.h, BORDER_RADIUS)
      : 0;

  return (
    <>
      <div
        ref={wrapRef}
        className={`referral-id-card-wrap relative mt-5 ${pop ? "referral-id-pop" : ""}`}
      >
        {perimeter > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <rect
              x={STROKE_WIDTH / 2}
              y={STROKE_WIDTH / 2}
              width={size.w - STROKE_WIDTH}
              height={size.h - STROKE_WIDTH}
              rx={BORDER_RADIUS}
              ry={BORDER_RADIUS}
              fill="none"
              stroke="#FFD93D"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={perimeter}
              strokeDashoffset={draw ? 0 : perimeter}
              className="referral-id-trace"
            />
          </svg>
        )}

        <div className="relative rounded-2xl bg-primary/5 px-6 py-5 md:px-7 md:py-6">
          <p className="text-sm font-bold text-foreground md:text-base">
            내 추천인 ID
          </p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="break-all text-lg font-bold text-emphasis md:text-xl">
              {userEmail}
            </p>
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark sm:px-6 sm:py-3 sm:text-base"
            >
              📤 추천 공유하기
            </button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            친구가 가입할 때 이 이메일을 추천인 ID로 입력하면, 둘 다
            아트랩코인 5개를 받아요.
          </p>
        </div>
      </div>

      {shareOpen && (
        <ReferralShareModal
          userEmail={userEmail}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}
