import type { ImageAssetKind } from "@/types/lesson";

export const WORKSHEET_IMAGE_COUNT = 3;
export const SAMPLE_ART_IMAGE_COUNT = 3;

export type ImageQuality = "low" | "medium" | "high";

export type ImageGenSettings = {
  model: "gpt-image-1-mini" | "gpt-image-1";
  quality: ImageQuality;
  size: "1024x1536";
  count: number;
};

export const IMAGE_GEN_SETTINGS: Record<ImageAssetKind, ImageGenSettings> = {
  worksheet: {
    model: "gpt-image-1-mini",
    quality: "low",
    size: "1024x1536",
    count: WORKSHEET_IMAGE_COUNT,
  },
  sampleArt: {
    model: "gpt-image-1",
    quality: "medium",
    size: "1024x1536",
    count: SAMPLE_ART_IMAGE_COUNT,
  },
};
