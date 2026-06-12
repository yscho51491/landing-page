/** 한글·숫자·허용 구두점 외 문자(키릴·아랍 등) 감지 */
const FOREIGN_SCRIPT_RE =
  /[\u0400-\u04FF\u0500-\u052F\u0600-\u06FF\u0900-\u097F\u0E00-\u0E7F]/;

/** 미술 수업 맥락에서 자주 섞이는 키릴 단어 → 한국어 */
const CYRILLIC_REPLACEMENTS: [RegExp, string][] = [
  [/кисточкой을/gi, "붓을"],
  [/кисточкой/gi, "붓으로"],
  [/кисточк[а-яё]+/gi, "붓"],
  [/кисть/gi, "붓"],
  [/краск[а-яё]+/gi, "물감"],
  [/бумаг[а-яё]+/gi, "종이"],
  [/цвет[а-яё]+/gi, "색"],
];

export function containsForeignScript(text: string): boolean {
  return FOREIGN_SCRIPT_RE.test(text);
}

/** 키릴 등 외국 문자를 한국어로 치환·제거 */
export function sanitizeKoreanText(text: string): string {
  let result = text;
  for (const [pattern, replacement] of CYRILLIC_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  result = result.replace(/[\u0400-\u04FF]+/g, "");
  return result.replace(/\s+/g, " ").trim();
}

export function sanitizeKoreanTexts(texts: string[]): string[] {
  return texts.map(sanitizeKoreanText).filter(Boolean);
}
