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

export default function CanvasFillAnimation() {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % FRAMES.length);
    }, FRAME_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const frame = FRAMES[frameIndex];

  return (
    <div className="relative mx-auto h-44 w-44 shrink-0">
      <Image
        key={frame.src}
        src={frame.src}
        alt={frame.alt}
        width={176}
        height={176}
        className="h-44 w-44 object-contain"
        priority
        unoptimized
      />
    </div>
  );
}
