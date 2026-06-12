/**
 * '수업 아이디어 실험실' 결과물 JSON 양식.
 * 메인 그리드의 이미지 클릭 상세 모달에도 같은 양식을 사용합니다.
 */

/** 준비물 한 분류 (예: 기본재료 / 재활용 / 꾸미기 / 기타) */
export type LabLessonMaterialGroup = {
  category: string;
  items: string[];
};

/** 수업 과정 한 단계 (예: "1️⃣ 도입 – 로봇 이야기 나누기") */
export type LabLessonProcessStep = {
  title: string;
  points: string[];
};

export type LabLessonIdea = {
  title: string;
  /** 📌 수업 개요 */
  overview: string;
  /** 🎯 학습 목표 */
  goals: string[];
  /** 🧰 준비물 */
  materials: LabLessonMaterialGroup[];
  /** ⏳ 수업 과정 */
  process: LabLessonProcessStep[];
  /** ✨ 기대 효과 */
  expectedEffects: string[];
};
