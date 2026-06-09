export type LessonInput = {
  topic: string;
  audience: string;
  duration: string;
  requirements: string;
};

/** 수업 계획서 활동 1건 (구조화 JSON) */
export type LessonPlanActivity = {
  keyActivity: string;
  /** 교사 발문·수강자 반응·연결 멘트 등 2~4문장 */
  activityExamples: string[];
  purpose: string;
  timeTip: string;
};

export type LessonProcessPhase = {
  duration: string;
  activities: LessonPlanActivity[];
};

export type StructuredLessonPlan = {
  title: string;
  overview: string;
  goals: string[];
  materials: string[];
  process: {
    intro: LessonProcessPhase;
    main: LessonProcessPhase;
    closing: LessonProcessPhase;
  };
  expectedEffects: string[];
  evaluationPoints: string[];
};

export type TeacherScriptSection = {
  script: string;
};

export type TeacherScript = {
  intro: TeacherScriptSection;
  main: TeacherScriptSection;
  closing: TeacherScriptSection;
};

/** OpenAI · API 공통 응답 (LessonResult) */
export type LessonResult = {
  lessonPlan: StructuredLessonPlan;
  teacherScript: TeacherScript;
};

export type LessonTextOutput = LessonResult;

export type ResultTabId = "lessonPlan" | "teacherScript";

export type ImageAssetKind = "worksheet" | "sampleArt" | "ppt";

export type ImageAssetStatus = "idle" | "loading" | "ready";

export type ImageAssetState = {
  status: ImageAssetStatus;
  /** @deprecated 단일 미리보기 — images 사용 */
  previewSrc?: string;
  /** 생성된 이미지 data URL 목록 (활동지·예시 3장, PPT 10장) */
  images?: string[];
  label: string;
  progressLabel?: string;
  progressCompleted?: number;
  progressTotal?: number;
};
