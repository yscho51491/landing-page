/**
 * 완성작 미술 수업 — 제품 사진 스타일 공통 프롬프트
 * 인물 없음, 실제 제작물 클로즈업·스튜디오 촬영
 */

/** 촬영·조명·구도 (모든 완성작 이미지 공통) */
export const CRAFT_PHOTO_CORE = [
  "Professional product photography of a single finished student art project.",
  "Macro craft shot or studio still life — sharp focus on the artwork object.",
  "NO people, NO human figures, NO faces, NO hands, NO body parts in frame.",
  "Soft studio lighting with natural daylight quality and even highlights.",
  "Gentle shadows that reveal depth and material texture.",
  "Centered composition: the complete artwork fully visible with comfortable margins on all sides.",
  "Portrait 2:3 aspect ratio framing.",
  "High-resolution photographic realism of a physical handmade object.",
].join("\n");

/** 다양한 수업에 맞는 중립 배경 (특정 예시 이미지에 한정되지 않음) */
export const CRAFT_PHOTO_BACKGROUNDS = [
  "Background: clean warm off-white seamless studio backdrop with subtle paper texture.",
  "Background: light natural oak wood table surface, craft blog product-shot style.",
  "Background: soft cream curved studio sweep, museum display presentation.",
  "Background: matte charcoal gray backdrop with subtle vignette, artwork pops forward.",
  "Background: soft neutral bokeh, shallow depth of field behind the object.",
] as const;

/** 재료·질감 — 수업 주제에 맞게 AI가 선택하도록 유도 */
export const CRAFT_PHOTO_TEXTURE = [
  "Show authentic handmade material textures appropriate to the lesson:",
  "visible paper or cardboard grain, layered collage edges, paint brushstrokes,",
  "fabric weave, ribbon folds, clay or modeling material volume,",
  "glue layers, mixed-media depth — whatever matches the described project.",
  "Tactile, dimensional, clearly physical — NOT flat cartoon or generic digital illustration.",
].join(" ");

/** 금지 사항 */
export const CRAFT_PHOTO_NEGATIVE = [
  "FORBIDDEN: watermark, logo, text, letters, numbers, captions, labels.",
  "FORBIDDEN: blurry, low-resolution, flat cartoon, clip-art, vague children's book illustration.",
  "FORBIDDEN: photorealistic people, students, teachers, crowd scenes.",
].join("\n");

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** 수업마다 일관된 배경 선택 (같은 수업은 같은 배경) */
export function pickCraftPhotoBackground(seed: string): string {
  const idx = hashSeed(seed) % CRAFT_PHOTO_BACKGROUNDS.length;
  return CRAFT_PHOTO_BACKGROUNDS[idx];
}

export function buildCraftPhotoPromptBlock(seed: string): string {
  return [CRAFT_PHOTO_CORE, pickCraftPhotoBackground(seed), CRAFT_PHOTO_TEXTURE, CRAFT_PHOTO_NEGATIVE].join(
    "\n",
  );
}
