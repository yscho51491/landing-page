export type LessonExampleAspect = "4:5" | "9:16" | "2:3";

export type LessonExample = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  aspect: LessonExampleAspect;
};

/** public/images/explore/ 폴더 이미지 12개 */
export const lessonExamples: LessonExample[] = [
  {
    id: "constellation",
    imageSrc: "/images/explore/내가 만드는 별자리.png",
    imageAlt: "내가 만드는 별자리 수업 완성작",
    title: "내가 만드는 별자리",
    aspect: "4:5",
  },
  {
    id: "line-clay-art",
    imageSrc: "/images/explore/라인클레이아트.png",
    imageAlt: "라인클레이아트 수업 완성작",
    title: "라인클레이아트",
    aspect: "9:16",
  },
  {
    id: "robot-collage",
    imageSrc: "/images/explore/삐리리리- 로봇을 본 적 있나요.jpg",
    imageAlt: "재활용 재료 로봇 콜라주 수업 완성작",
    title: "삐리리리- 로봇을 본 적 있나요?",
    aspect: "4:5",
  },
  {
    id: "shot-2025-07-30-170705",
    imageSrc: "/images/explore/스크린샷 2025-07-30 170705.png",
    imageAlt: "수업 완성작 예시 수업 완성작",
    title: "수업 완성작 예시",
    aspect: "9:16",
  },
  {
    id: "shot-2026-03-06-004553",
    imageSrc: "/images/explore/스크린샷 2026-03-06 004553.png",
    imageAlt: "수업 완성작 예시 수업 완성작",
    title: "수업 완성작 예시",
    aspect: "4:5",
  },
  {
    id: "shot-2026-03-10-040909",
    imageSrc: "/images/explore/스크린샷 2026-03-10 040909.png",
    imageAlt: "수업 완성작 예시 수업 완성작",
    title: "수업 완성작 예시",
    aspect: "9:16",
  },
  {
    id: "shot-2026-03-10-040942",
    imageSrc: "/images/explore/스크린샷 2026-03-10 040942.png",
    imageAlt: "수업 완성작 예시 수업 완성작",
    title: "수업 완성작 예시",
    aspect: "4:5",
  },
  {
    id: "shot-2026-03-10-043449",
    imageSrc: "/images/explore/스크린샷 2026-03-10 043449.png",
    imageAlt: "수업 완성작 예시 수업 완성작",
    title: "수업 완성작 예시",
    aspect: "9:16",
  },
  {
    id: "batik-no-wax-1",
    imageSrc: "/images/explore/양초 없이 바틱수업 (1).png",
    imageAlt: "노왁스 바틱 기법 수업 완성작",
    title: "양초를 쓰지 않고 만드는 '바틱' 수업",
    aspect: "4:5",
  },
  {
    id: "batik-no-wax-2",
    imageSrc: "/images/explore/양초 없이 바틱수업 (2).png",
    imageAlt: "노왁스 바틱 기법 수업 완성작",
    title: "양초를 쓰지 않고 만드는 '바틱' 수업",
    aspect: "4:5",
  },
  {
    id: "colorful-jellyfish",
    imageSrc: "/images/explore/컬러풀 해파리.png",
    imageAlt: "종이 접시 해파리 조형 수업 완성작",
    title: "컬러풀 해파리",
    aspect: "4:5",
  },
  {
    id: "parent-class-design-2",
    imageSrc: "/images/explore/parent-class-design-2.png",
    imageAlt: "꽃액자 디자인 예시",
    title: "꽃액자 디자인",
    aspect: "4:5",
  },
];

const aspectClassMap: Record<LessonExampleAspect, string> = {
  "4:5": "aspect-[4/5]",
  "9:16": "aspect-[9/16]",
  "2:3": "aspect-[2/3]",
};

export function getLessonExampleAspectClass(aspect: LessonExampleAspect): string {
  return aspectClassMap[aspect];
}

/** 파일명 공백·한글 URL 인코딩 (외부 URL은 그대로 사용) */
export function getLessonExampleImageSrc(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  const slash = src.lastIndexOf("/");
  if (slash === -1) {
    return encodeURI(src);
  }
  return src.slice(0, slash + 1) + encodeURIComponent(src.slice(slash + 1));
}
