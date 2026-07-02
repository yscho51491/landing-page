/**
 * 완성작 미술 수업 — 교실 책상 위 실물 콜라주 사진 스타일
 * (ChatGPT에 수업계획 붙여 넣었을 때 나오는 ‘안정된’ 완성작 느낌을 목표)
 */

/** 촬영·조명·구도 (모든 완성작 이미지 공통) */
export const CRAFT_PHOTO_CORE = [
  "Authentic DSLR photograph of ONE finished elementary art class project — NOT a digital illustration or AI painting.",
  "The artwork lies flat on a real light wooden art classroom table, shot from a slight overhead angle (craft tutorial / Pinterest art-class photo style).",
  "Physical mixed-media craft: cut construction paper, glue layers, pom-poms, crayon and colored pencil strokes, glitter stickers, fabric scraps, clay — with visible paper thickness and tactile depth.",
  "Sharp focus across the entire piece; soft natural daylight; gentle shadows under raised collage elements.",
  "Portrait 2:3 framing. The complete artwork is fully visible with a comfortable margin.",
  "Optional: a few real craft supplies at the table edges (glue stick, scissors, marker, pom-pom tray, paper scraps) for context — supplies stay secondary, artwork is the hero.",
  "If the lesson includes a drawn or collage face ON the artwork paper, show it as stylized child art on the project — never a photorealistic living child in the scene.",
].join("\n");

/** 교실·책상 배경 (회색 스튜디오 void 지양) */
export const CRAFT_PHOTO_BACKGROUNDS = [
  "Setting: warm oak elementary art table, soft window daylight, scattered colorful paper scraps at corners.",
  "Setting: light birch craft desk flat lay, natural classroom ambiance, a glue stick and scissors partly visible at one edge.",
  "Setting: cream art paper on wooden table, after-school art room mood, pom-pom bowl and markers softly blurred at the side.",
] as const;

/** 재료·질감 */
export const CRAFT_PHOTO_TEXTURE = [
  "Show authentic handmade textures matching the lesson materials:",
  "torn paper edges, layered collage, visible glue shine, fuzzy pom-poms, glitter specks,",
  "brushstrokes, pipe cleaners, yarn, clay volume — clearly a physical object photographed,",
  "NOT flat cartoon, NOT vector, NOT Procreate-style digital drawing on grey void.",
].join(" ");

/** 금지 사항 */
export const CRAFT_PHOTO_NEGATIVE = [
  "FORBIDDEN: watermark, logo, readable text, letters, numbers, captions, labels.",
  "FORBIDDEN: grey empty void, dark studio backdrop, floating object with no table, clip-art, children's book illustration, anime, vector art.",
  "FORBIDDEN: blurry, low-resolution, oversaturated AI-art look.",
  "FORBIDDEN: photorealistic children standing in frame, hands holding the work, classroom group photos.",
].join("\n");

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function pickCraftPhotoBackground(seed: string): string {
  const idx = hashSeed(seed) % CRAFT_PHOTO_BACKGROUNDS.length;
  return CRAFT_PHOTO_BACKGROUNDS[idx];
}

export function buildCraftPhotoPromptBlock(seed: string): string {
  return [
    CRAFT_PHOTO_CORE,
    pickCraftPhotoBackground(seed),
    CRAFT_PHOTO_TEXTURE,
    CRAFT_PHOTO_NEGATIVE,
  ].join("\n");
}
