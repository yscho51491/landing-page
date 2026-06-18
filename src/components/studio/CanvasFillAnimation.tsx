"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FRAMES = [
  { src: "/studio/canvas-fill/01-empty.png", alt: "빈 캔버스" },
  { src: "/studio/canvas-fill/02-yellow.png", alt: "캔버스에 노란색 채우기" },
  { src: "/studio/canvas-fill/03-yellow-pink.png", alt: "캔버스에 핑크색 추가" },
  { src: "/studio/canvas-fill/04-yellow-pink-mint.png", alt: "캔버스에 민트색 추가" },
  { src: "/studio/canvas-fill/05-yellow-pink-mint-coral.png", alt: "캔버스에 코랄색 추가" },
  { src: "/studio/canvas-fill/06-full.png", alt: "캔버스 채우기 완료" },
] as const;

const FRAME_INTERVAL_MS = 480;

type CanvasFillAnimationProps = {
  size?: "sm" | "md";
};

const SIZE_CLASS = {
  sm: "h-28 w-28",
  md: "h-44 w-44",
} as const;

export default function CanvasFillAnimation({
  size = "md",
}: CanvasFillAnimationProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const sizeClass = SIZE_CLASS[size];
  const dimension = size === "sm" ? 112 : 176;

  useEffect(() => {
    const id = window.setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % FRAMES.length);
    }, FRAME_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const frame = FRAMES[frameIndex];

  return (
    <div className={`relative mx-auto shrink-0 ${sizeClass}`}>
      <Image
        key={frame.src}
        src={frame.src}
        alt={frame.alt}
        width={dimension}
        height={dimension}
        className={`${sizeClass} object-contain`}
        priority
        unoptimized
      />
    </div>
  );
}
