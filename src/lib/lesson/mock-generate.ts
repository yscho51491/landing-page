import type { ImageAssetKind } from "@/types/lesson";

export const IMAGE_ASSET_META: Record<
  ImageAssetKind,
  { label: string; readyNote: string; imageCount: number }
> = {
  worksheet: {
    label: "활동지 / 도안",
    imageCount: 3,
    readyNote: "AI 생성 선화 활동지 3종",
  },
  sampleArt: {
    label: "예시 작품",
    imageCount: 3,
    readyNote: "AI 생성 예시 작품 3종",
  },
};
