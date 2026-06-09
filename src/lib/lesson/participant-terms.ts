/** 생성·표시 텍스트에서 아동/학생 표현을 수강자 중심으로 정리 */

const REPLACEMENTS: [RegExp, string][] = [
  [/【예상\s*아동\s*반응】/g, "【예상 수강자 반응】"],
  [/【예상\s*학생\s*반응】/g, "【예상 수강자 반응】"],
  [/예상\s*아동\s*반응/g, "예상 수강자 반응"],
  [/예상\s*학생\s*반응/g, "예상 수강자 반응"],
  [/아동\s*반응/g, "수강자 반응"],
  [/학생\s*반응/g, "수강자 반응"],
  [/아이들이\s*할\s*법한/g, "수강자가 할 법한"],
  [/아이들의\s*반응/g, "수강자의 반응"],
  [/아이들의/g, "수강자의"],
  [/아이들이/g, "수강자가"],
  [/유아\s*및\s*아동/g, "대상자"],
  [/교사\/학생/g, "교사/수강자"],
  [/학생\s*준비물/g, "수강자 준비물"],
  [/학생\s*용/g, "수강자용"],
];

export function sanitizeParticipantTerms(text: string): string {
  let out = text;
  for (const [pattern, replacement] of REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}
