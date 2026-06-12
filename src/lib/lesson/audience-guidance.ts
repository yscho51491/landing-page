import type { LessonInput } from "@/types/lesson";

export function buildAudienceGuidance(input: LessonInput): string {
  const audience = input.audience.trim();
  const duration = input.duration.trim();

  return [
    `이번 수업의 targetAge(대상)는 반드시 「${audience}」이다.`,
    `수업 시간(duration)은 「${duration}」이다.`,
    "유치부·초등부·중고등·청소년센터·미술학원·방과후 등 기관 특성에 맞는 재료·활동 난이도·완성도를 적용한다.",
    "targetAge와 duration이 바뀌면 수업 목표, 어휘, 활동 난이도, 대화 예시, 준비물, 작품 감상 방식, 신체·인지 부담까지 전부 그 연령·시간에 맞게 달라져야 한다.",
    "유아·초등용 표현(아동, 학생, 아이들)을 쓰지 말고 「수강자」「대상자」로 통일한다.",
    audience.includes("시니어") || audience.includes("성인")
      ? "시니어·성인 대상: 추상 비교보다 구체적 작품명·화면 자료·천천히 대화·손·눈 피로 고려, 아이스브레이킹은 가벼운 인사·추억 공유 수준."
      : "",
    audience.includes("유아") || audience.includes("유치")
      ? "유아·유치원: 짧은 문장, 감각·신체 활동, 안전한 재료, 반복·칭찬 중심."
      : "",
    audience.includes("초등")
      ? "초등: 또래 대화, 단계별 지도, 작품명은 쉬운 말로 풀어 설명."
      : "",
    audience.includes("청소년")
      ? "청소년: 작가·시대 맥락, 비교·토론, 자기표현 활동."
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}
