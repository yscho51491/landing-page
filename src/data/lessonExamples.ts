export type LessonExampleAspect = "4:5" | "9:16" | "2:3";

export type LessonExample = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  aspect: LessonExampleAspect;
};

/** public/images/explore/ 폴더 이미지 (실제 파일과 동기화) */
export const lessonExamples: LessonExample[] = [
  {
    id: "space-floating",
    imageSrc: "/images/explore/우주공간으로 둥둥.jpg",
    imageAlt: "우주공간으로 둥둥 수업 완성작",
    title: "우주공간으로 둥둥!",
    aspect: "4:5",
  },
  {
    id: "my-canned-goods",
    imageSrc: "/images/explore/내가 만든 통조림.png",
    imageAlt: "내가 만든 통조림 수업 완성작",
    title: "내가 만든 통조림",
    aspect: "4:5",
  },
  {
    id: "castle-in-sky",
    imageSrc: "/images/explore/하늘위의 성.jpg",
    imageAlt: "하늘위의 성 수업 완성작",
    title: "하늘위의 성",
    aspect: "4:5",
  },
  {
    id: "clay-rainbow-fish",
    imageSrc: "/images/explore/클레이 무지개 생선.png",
    imageAlt: "클레이 무지개 생선 수업 완성작",
    title: "클레이 무지개 생선",
    aspect: "4:5",
  },
  {
    id: "flashlight-nightscape",
    imageSrc: "/images/explore/빛으로 비추는 밤풍경.jpg",
    imageAlt: "빛으로 비추는 밤풍경 수업 완성작",
    title: "빛으로 비추는 밤풍경",
    aspect: "4:5",
  },
  {
    id: "little-mermaid",
    imageSrc: "/images/explore/🧜‍♀️인어공주의 뒷모습🐚.png",
    imageAlt: "인어공주를 좋아하시나요 수업 완성작",
    title: "인어공주를 좋아하시나요?",
    aspect: "4:5",
  },
  {
    id: "robot-collage",
    imageSrc: "/images/explore/삐리리리- 로봇을 본 적 있나요.jpg",
    imageAlt: "재활용 재료 로봇 콜라주 수업 완성작",
    title: "삐리리리- 로봇을 본 적 있나요?",
    aspect: "4:5",
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
