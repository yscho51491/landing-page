export type BracketSection = {
  label: string;
  content: string;
  emoji?: string;
};

const BRACKET_PATTERN = /【([^】]+)】/g;

const PLAN_LABELS = new Set([
  "활동 목적",
  "핵심 활동",
  "교사 자료·설명",
  "교사 자료",
  "교사용 발문",
  "교사의 발문",
  "교사 발문",
  "예상 수강자 반응",
  "예상 아동 반응",
  "교사 연결 멘트",
  "시간 운영 팁",
  "교사용 진행 팁",
]);

const SCRIPT_LABEL_EMOJI: Record<string, string> = {
  "교사 멘트": "👩‍🏫",
  "예상 수강자 반응": "👤",
  "예상 아동 반응": "👤",
  "교사 후속 멘트": "👩‍🏫",
};

function normalizeContent(text: string): string {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function emojiForScriptLabel(label: string): string | undefined {
  if (SCRIPT_LABEL_EMOJI[label]) {
    return SCRIPT_LABEL_EMOJI[label];
  }
  if (/반응|수강자|대상자/.test(label)) {
    return "👤";
  }
  if (/교사|멘트|발문/.test(label)) {
    return "👩‍🏫";
  }
  return undefined;
}

export type ScriptLineBlock = {
  role: "teacher" | "student";
  content: string;
};

/** 【】 없이 한 덩어리로 온 대본용 (괄호 반응·문단 분리) */
export function parseScriptPlainBlocks(text: string): ScriptLineBlock[] {
  const trimmed = text.trim();
  if (!trimmed) {
    return [];
  }

  const blocks: ScriptLineBlock[] = [];
  const parenPattern = /[（(][^）)]*[）)]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = parenPattern.exec(trimmed)) !== null) {
    const before = trimmed.slice(lastIndex, match.index).trim();
    if (before) {
      blocks.push({ role: "teacher", content: before });
    }
    blocks.push({ role: "student", content: match[0].trim() });
    lastIndex = match.index + match[0].length;
  }

  const tail = trimmed.slice(lastIndex).trim();
  if (tail) {
    blocks.push({ role: "teacher", content: tail });
  }

  if (blocks.length === 0) {
    return trimmed
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((content) => ({ role: "teacher" as const, content }));
  }

  return blocks;
}

export function parseBracketSections(text: string): BracketSection[] {
  const trimmed = text.trim();
  if (!trimmed) {
    return [];
  }

  if (!trimmed.includes("【")) {
    return [{ label: "", content: trimmed }];
  }

  const parts = trimmed.split(/(?=【[^】]+】)/).filter((p) => p.trim());
  const sections: BracketSection[] = [];

  for (const part of parts) {
    const match = part.match(/^【([^】]+)】\s*([\s\S]*)/);
    if (match) {
      const label = match[1].trim();
      const content = normalizeContent(match[2]);
      if (content || label) {
        sections.push({
          label,
          content,
          emoji: emojiForScriptLabel(label),
        });
      }
    } else {
      const content = normalizeContent(part);
      if (content) {
        sections.push({ label: "", content });
      }
    }
  }

  return sections.length > 0 ? sections : [{ label: "", content: trimmed }];
}

export function isStructuredPlanActivity(text: string): boolean {
  return /【[^】]+】/.test(text);
}

export function isStructuredScript(text: string): boolean {
  return /【[^】]+】/.test(text);
}

export { PLAN_LABELS };
