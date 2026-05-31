export type GalleryItem = {
  id: string;
  src: string;
  label: string;
  alt: string;
  thumbFit: "cover" | "contain";
};

export const exampleGalleryImages: GalleryItem[] = [
  {
    id: "lesson-plan",
    src: "/images/lesson-plan.png",
    label: "📋 수업 계획서",
    alt: "호국보훈 미술 수업 계획안 예시",
    thumbFit: "cover",
  },
  {
    id: "worksheet",
    src: "/images/worksheet.png",
    label: "✏️ 활동지 · 도안",
    alt: "수업 활동지 및 도안 예시",
    thumbFit: "cover",
  },
  {
    id: "ppt",
    src: "/images/ppt-vertical.png",
    label: "📊 수업용 PPT",
    alt: "호국보훈 미술 수업 PPT 슬라이드 예시 (세로형)",
    thumbFit: "contain",
  },
  {
    id: "sample-work",
    src: "/images/sample-work.png",
    label: "🎨 예시 완성작",
    alt: "수업 예시 완성작 이미지",
    thumbFit: "cover",
  },
];
