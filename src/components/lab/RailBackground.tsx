import Image from "next/image";

/**
 * 위/아래로 흐르는 이미지 레일 배경 (1·3열 위로, 2·4열 아래로).
 * 로그인 게이트와 수업 아이디어 실험실에서 공용으로 사용합니다.
 */

export const RAIL_IMAGES = [
  "/images/lab/lab-jellyfish.png",
  "/images/lab/lab-robot.png",
  "/images/lab/lab-bottle.png",
  "/images/lab/lab-clay-beach.png",
  "/images/lab/lab-kids-paintings.png",
  "/images/lab/lab-classroom.png",
  "/images/lab/lab-watermelon.png",
  "/images/lab/lab-flower-frame.png",
  "/images/explore/%EC%BB%AC%EB%9F%AC%ED%92%80%20%ED%95%B4%ED%8C%8C%EB%A6%AC.png",
  "/images/explore/%EC%96%91%EC%B4%88%20%EC%97%86%EC%9D%B4%20%EB%B0%94%ED%8B%B1%EC%88%98%EC%97%85%20(1).png",
  "/images/explore/%EC%96%91%EC%B4%88%20%EC%97%86%EC%9D%B4%20%EB%B0%94%ED%8B%B1%EC%88%98%EC%97%85%20(2).png",
  "/images/explore/%EB%82%B4%EA%B0%80%20%EB%A7%8C%EB%93%9C%EB%8A%94%20%EB%B3%84%EC%9E%90%EB%A6%AC.png",
  "/images/explore/%EB%9D%BC%EC%9D%B8%ED%81%B4%EB%A0%88%EC%9D%B4%EC%95%84%ED%8A%B8.png",
  "/images/explore/parent-class-design-2.png",
];

function railImages(railIndex: number): string[] {
  return RAIL_IMAGES.filter((_, i) => i % 4 === railIndex);
}

function Rail({
  railIndex,
  direction,
}: {
  railIndex: number;
  direction: "up" | "down";
}) {
  const images = railImages(railIndex);
  // 끊김 없는 루프를 위해 이미지 목록을 2배로 이어붙임
  const looped = [...images, ...images];

  return (
    <div
      className={`flex flex-col gap-3 ${
        direction === "up" ? "lab-rail-up" : "lab-rail-down"
      }`}
    >
      {looped.map((src, i) => (
        <div key={i} className="overflow-hidden rounded-xl">
          <Image
            src={src}
            alt=""
            aria-hidden
            width={0}
            height={0}
            sizes="25vw"
            unoptimized
            className="h-auto w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default function RailBackground() {
  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-3 px-3 md:grid-cols-4">
      <Rail railIndex={0} direction="up" />
      <Rail railIndex={1} direction="down" />
      <div className="hidden md:block">
        <Rail railIndex={2} direction="up" />
      </div>
      <div className="hidden md:block">
        <Rail railIndex={3} direction="down" />
      </div>
    </div>
  );
}
