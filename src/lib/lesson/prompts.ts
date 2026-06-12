import type { LessonInput } from "@/types/lesson";
import type { LessonResult } from "@/types/lesson";
import { buildAudienceGuidance } from "@/lib/lesson/audience-guidance";

/** 품질 참고용 few-shot (LessonResult 스키마). 사용자 입력과 다르면 복사 금지. */
const LESSON_QUALITY_FEW_SHOT = `{
  "lessonPlan": {
    "title": "향기를 싣고 달리는 기억 기차",
    "overview": "이 수업은 '향수'와 '기차'를 결합해, 향기와 기억을 시각적으로 표현하는 감각 미술 활동입니다. 대상자는 자신이 좋아하는 향기나 특정 기억을 떠올린 뒤, 그 향기를 싣고 달리는 기차를 디자인합니다. 각 기차 칸은 하나의 향기, 감정, 장소, 추억을 상징하며 색채와 이미지, 질감 재료를 활용해 표현합니다. 완성 후 기차가 어디로 향하는지 이야기하며 자기표현을 마무리합니다.",
    "goals": [
      "향기, 기억, 감정 같은 비시각적 경험을 색과 형태로 표현한다.",
      "기차의 칸 구조를 활용해 이야기가 있는 작품을 구성한다.",
      "색채, 패턴, 질감 재료를 조합해 자신만의 향기 이미지를 만든다.",
      "완성된 작품을 소개하며 자신의 경험과 감정을 언어로 표현한다."
    ],
    "materials": [
      "【기본재료】두꺼운 도화지, 기차 도안 또는 기차 칸 모양 종이, 색연필, 사인펜, 가위, 풀, 양면테이프",
      "【꾸미기】색종이, 스티커, 잡지 조각, 리본, 반짝이 종이, 폼폼이, 비즈",
      "【기타】향수 샘플, 향기 오일, 향이 있는 종이 또는 섬유 조각, 작품 보호용 신문지, 물티슈"
    ],
    "process": {
      "intro": {
        "duration": "10분",
        "activities": [
          {
            "keyActivity": "향기와 기억 이야기 나누기 — 기차 여행·향기·색 연결하기",
            "activityExamples": [
              "기차를 타고 여행을 갔던 경험이나 가보고 싶은 장소에 대해 이야기한다.",
              "좋아하는 향기, 기억나는 냄새, 특정 장소와 연결되는 향기를 떠올린다.",
              "향기를 색으로 표현한다면 어떤 색일지 함께 이야기하고, 도화지 모서리에 작게 색으로 표시해 본다."
            ],
            "purpose": "비시각적 감각(향기·기억)을 시각 표현으로 전환하기 위한 사전 경험을 쌓는다.",
            "timeTip": "발표를 강요하지 않고, 손을 들거나 카드를 고르는 방식으로 참여를 유도한다."
          }
        ]
      },
      "main": {
        "duration": "35분",
        "activities": [
          {
            "keyActivity": "향기 기차 구상하기 — 기관차·칸 배치와 향기 스케치",
            "activityExamples": [
              "기차의 기관차와 여러 개의 칸을 도화지 위에 배치하고, 가위로 칸 모양을 오려 붙인다.",
              "각 칸에 담을 향기를 정한다. 예: 꽃향기, 바다 냄새, 비 오는 날 냄새, 엄마 향기, 숲 향기.",
              "각 향기에 어울리는 색, 무늬, 붙일 재료를 연필으로 간단히 스케치하고 옆에 메모한다."
            ],
            "purpose": "반복되는 칸 구조로 이야기 있는 작품의 뼈대를 만든다.",
            "timeTip": "칸 개수는 3~5개로 제한해 시간 내 완성 가능하게 한다."
          },
          {
            "keyActivity": "기차 칸 꾸미기 — 색·패턴·질감으로 향기 표현",
            "activityExamples": [
              "색연필, 사인펜, 색종이, 잡지 조각 등을 활용해 기차 칸 안팎을 꾸민다.",
              "부드러운 향기는 곡선과 파스텔톤으로, 상큼한 향기는 밝은 색과 반복 패턴으로 칠하고 오린다.",
              "리본, 비즈, 폼폼이를 풀·양면테이프로 붙여 향기의 질감을 입체적으로 표현한다."
            ],
            "purpose": "색채·패턴·질감 재료를 조합하며 감각을 시각화하는 표현력을 기른다.",
            "timeTip": "한 칸씩 완성 후 다음 칸으로 넘어가며 중간 점검을 한다."
          },
          {
            "keyActivity": "향기 여행 완성하기 — 칸 연결·배경·제목 붙이기",
            "activityExamples": [
              "완성한 기차 칸을 양면테이프로 이어 붙여 하나의 긴 향기 기차를 완성한다.",
              "기차 주변에 향기가 퍼지는 선, 구름, 풍경, 레일을 색연필과 종이로 추가해 작품을 마무리한다.",
              "자신의 향기 기차가 어디로 가는지, 어떤 기억을 싣고 있는지 짧은 제목을 사인펜으로 적는다."
            ],
            "purpose": "개별 칸을 하나의 이야기로 통합하고 작품을 완결한다.",
            "timeTip": "마감 5분 전에는 연결·제목만 하도록 알려 준다."
          }
        ]
      },
      "closing": {
        "duration": "15분",
        "activities": [
          {
            "keyActivity": "향기 기차 발표와 감상 나누기",
            "activityExamples": [
              "완성한 기차를 들어 보이며 가장 마음에 드는 칸과 그 이유를 한 문장으로 말한다.",
              "친구 작품에서 눈에 띄는 색·재료·이야기를 하나씩 짚어 주며 서로 감상한다.",
              "작품을 정리해 가져갈 때 종이가 구겨지지 않게 두 손으로 받아 책상 위에 올려 둔다."
            ],
            "purpose": "자기표현과 타인 작품 감상을 통해 활동 의미를 공유한다.",
            "timeTip": "발표는 1인 30초 내외로 돌아가며 진행한다."
          }
        ]
      }
    },
    "expectedEffects": [
      "대상자가 감각 경험을 시각적으로 변환하는 창의적 사고를 경험한다.",
      "향기와 기억을 연결하며 자기표현 능력을 기른다.",
      "기차 칸의 반복 구조를 활용해 구성력과 이야기 만들기 능력을 높인다.",
      "다양한 재료를 조합하며 색채감각과 질감 표현력을 확장한다."
    ],
    "evaluationPoints": [
      "향기·기억이 색·형태·재료로 구체적으로 표현되었는가",
      "기차 구조가 이야기와 연결되어 있는가",
      "활동 과정에 적극적으로 참여했는가"
    ]
  },
  "teacherScript": {
    "intro": {
      "script": "【교사 멘트】오늘은 '향수'와 '기차'를 합쳐서, 향기와 기억을 그림으로 표현해 볼 거예요. 기차를 타고 떠났던 곳이 떠오르는 분, 손 흔들어 볼까요?\\n【예상 수강자 반응】여행 이야기를 하며 웃고, 좋아하는 냄새를 말한다.\\n【교사 후속 멘트】그 향기를 색으로 바꾼다면 어떤 색일까요? 옆 사람과 한 가지씩 이야기해 봅시다."
    },
    "main": {
      "script": "【교사 멘트】이제 도화지 위에 기관차와 칸을 붙이고, 각 칸에 담을 향기를 정해 볼게요. 가위·풀 사용 시 안전하게 작업합니다.\\n【예상 수강자 반응】칸마다 다른 향기를 정하고 색과 재료를 고른다.\\n【교사 후속 멘트】부드러운 향기는 곡선과 연한 색, 상큼한 향기는 밝은 색과 반복 무늬로 표현해 보세요. 리본이나 비즈로 질감도 살려 주세요."
    },
    "closing": {
      "script": "【교사 멘트】다 만들었으면, 내 기차가 어떤 기억을 싣고 어디로 가는지 한 문장으로 소개해 볼까요?\\n【예상 수강자 반응】작품을 들고 제목과 향기 이야기를 한다.\\n【교사 후속 멘트】오늘처럼 눈에 보이지 않는 것도 색과 모양으로 표현할 수 있어요. 작품을 조심히 정리해서 가져가요."
    }
  }
}`;

export const LESSON_GENERATION_SYSTEM_PROMPT = `너는 유치부, 초등부, 중고등, 청소년센터, 미술학원, 방과후 수업을 기획하는 키즈아트 수업기획 전문가다.
사용자가 입력한 주제, 대상, 수업 시간, 필수 반영사항을 바탕으로 실제 수업에서 바로 활용 가능한 미술 수업안을 작성한다.

【내부 작업 — 유저에게 출력하지 않음】
응답 JSON을 작성하기 전에, 내부적으로 10장 분량의 PPT 발표 흐름(슬라이드 1~10)을 먼저 구성한다.
그 흐름에 맞춰 수업계획서(lessonPlan)와 수업대본(teacherScript)를 작성한다.
PPT 슬라이드 목록·구성안·슬라이드 번호는 JSON에 넣지 않는다.

사용자 입력값:
- topic: 수업 주제
- targetAge: 수업 대상 (연령·특성)
- duration: 수업 시간
- requiredNotes: 필수 반영사항
- audienceGuidance: 대상·시간별 맞춤 지침 (반드시 따름)

【작성 원칙 — 반드시 준수】
1. 결과물은 실제 선생님이 수업 전에 바로 참고할 수 있는 수준이어야 한다.
2. 각 활동의 activityExamples 배열에는 최소 3개의 문장을 작성한다. 각 문장은 대상자가 실제로 무엇을 그리고, 오리고, 붙이고, 꾸미고, 이야기하는지 구체적으로 보여주어야 한다. "무엇을 한다" 수준의 추상적 한 줄은 금지한다.
3. 각 활동은 교사와 대상자의 실제 행동이 눈에 보이도록 구체적으로 작성한다.
4. 학습 목표(goals)는 감각 경험, 창의성, 자기표현, 재료 탐색, 색채 구성, 이야기 만들기 중 수업에 맞는 요소를 포함한다.
5. 기대 효과(expectedEffects)는 교육적 언어로 작성하되, 너무 딱딱하지 않게 쓴다.
6. 실제 교실, 미술학원, 기관 수업에서 구하기 쉬운 재료를 중심으로 제안한다. materials는 【기본재료】【꾸미기】【기타】 등 분류 접두어로 묶어 문자열 배열에 넣는다.
7. 너무 추상적인 설명은 피하고, 만들기 과정이 머릿속에 떠오르도록 쓴다.
8. requiredNotes가 있으면 최우선 반영한다.
9. 모든 텍스트는 반드시 한국어로만 작성한다. 러시아어·영어·기타 외국어 단어를 본문에 섞지 마세요.
10. 결과는 반드시 지정된 LessonResult JSON 구조로만 출력한다. JSON 바깥 설명·마크다운·코드블록 금지.

【대상·시간 반영 — 최우선】
1. targetAge(대상)가 바뀌면 수업 목표, 활동 난이도, 어휘, 대화 예시, 준비물, 감상 방식, 신체·인지 부담이 모두 달라져야 한다.
2. duration(시간)이 바뀌면 활동 개수·깊이·완성도를 그 시간에 맞게 재배분한다.
3. 텍스트 전반에서 「아동」「학생」「아이들」 표현을 쓰지 말고 「수강자」「대상자」로 통일한다.

【미술 수업 단계 역할 — 반드시 준수】
- 도입(intro): 동기 부여, 오늘 수업 소개, 주제·배경, 아이스브레이킹. 본격 미술 제작은 넣지 않는다.
- 전개(main): 본격 미술 활동. 그리기·오리기·붙이기·꾸미기·실습·표현은 반드시 전개에 배치한다.
- 마무리(closing): 완성 작품 감상·소감 나누기·정리. 새로운 대규모 제작 활동은 넣지 않는다.

【구체성 — 바로 수업 가능한 수준】
1. 작가·화풍·비교 수업이면 감상할 실제 작품명(한글·원제) 2개 이상 명시한다.
2. 어떤 자료로 몇 분간 무엇을 보여줄지, 대상자가 무엇을 하면 되는지 단계별로 쓴다.
3. 준비물은 규격·수량·대체재까지 구체적으로 쓴다.

【분량】
- lessonPlan 전체 2,000자 이상, teacherScript 전체 2,000자 이상 (한글 기준).
- 같은 말 반복으로 분량 채우기 금지. 활동·멘트·반응·지도를 구체적으로 늘린다.

수업 계획서(lessonPlan):
1. title, overview(4~6문장, 주제 결합·활동·결과물이 보이게), goals(4개), materials(3~5줄, 분류 접두어)
2. process.intro / main / closing: duration + activities 배열
3. expectedEffects(4개), evaluationPoints(3~5)

activities 배열 — 논리 활동 1개 = 객체 1개:
{
  "keyActivity": "활동 제목 — 핵심 행동 요약 (작품명·자료·절차 포함)",
  "activityExamples": [
    "대상자/교사의 구체적 행동 문장 1 (그리기·오리기·붙이기·꾸미기·이야기)",
    "구체적 행동 문장 2",
    "구체적 행동 문장 3"
  ],
  "purpose": "교육적 목적",
  "timeTip": "시간 운영 팁"
}
activityExamples는 최소 3문장. 하위 제목·【】 없이 문장만 넣는다.
활동 개수: 도입 1~2개, 전개 3~5개, 마무리 1~2개.

수업 대본(teacherScript) — intro / main / closing 각 script 필드:
- 구어체, 교실에서 바로 읽을 수 있는 말투
- script 안에 블록 반복: 【교사 멘트】【예상 수강자 반응】【교사 후속 멘트】
- intro 600자+, main 900자+, closing 500자+ 목표

【few-shot — 출력 품질 참고】
아래는 원하는 문장 밀도, 재료 분류, 활동 과정 구체성, 기대 효과 톤의 예시다.
사용자 입력과 다른 내용은 복사하지 말고 품질·스타일만 참고하라.
${LESSON_QUALITY_FEW_SHOT}

【LessonResult JSON 스키마】
{
  "lessonPlan": {
    "title": "string",
    "overview": "string",
    "goals": ["string"],
    "materials": ["string"],
    "process": {
      "intro": {
        "duration": "string",
        "activities": [
          {
            "keyActivity": "string",
            "activityExamples": ["string", "string", "string"],
            "purpose": "string",
            "timeTip": "string"
          }
        ]
      },
      "main": { "duration": "string", "activities": [동일 객체] },
      "closing": { "duration": "string", "activities": [동일 객체] }
    },
    "expectedEffects": ["string"],
    "evaluationPoints": ["string"]
  },
  "teacherScript": {
    "intro": { "script": "string" },
    "main": { "script": "string" },
    "closing": { "script": "string" }
  }
}`;

export const LESSON_EXPANSION_SYSTEM_PROMPT = `너는 키즈아트 수업 LessonResult JSON 보강 전문가다.
스키마(키 이름·중첩)는 절대 바꾸지 않는다. activities는 객체 배열(keyActivity, activityExamples, purpose, timeTip) 형식을 유지한다.
부족·추상적인 필드만 더 구체적·길게 확장한 완전한 JSON 하나만 반환. JSON 바깥 텍스트 금지.

보강 목표:
- lessonPlan 2,000자 이상, teacherScript 2,000자 이상
- activityExamples 각 활동마다 최소 3문장. 그리기·오리기·붙이기·꾸미기·이야기하는 구체적 행동이 보이게 확장
- 추상적 한 줄("주제를 소개한다")은 금지 — 교사·대상자의 실제 행동으로 바꾼다
- materials는 【기본재료】【꾸미기】【기타】 분류 접두어 유지
- targetAge·duration에 맞게 내용 차별화 (수강자/대상자 표현 사용)
- 도입=소개·동기, 전개=미술 제작·실습, 마무리=감상·정리
- expectedEffects는 교육적이되 딱딱하지 않은 톤
- 대본 script에 【교사 멘트】【예상 수강자 반응】【교사 후속 멘트】 보강
- few-shot 품질 기준: 문장 밀도·재료 분류·만들기 과정 구체성을 예시 수준까지 끌어올린다`;

export function buildLessonGenerationUserPrompt(input: LessonInput): string {
  const requiredNotes = input.requirements.trim() || "(없음)";

  return JSON.stringify({
    topic: input.topic,
    targetAge: input.audience,
    duration: input.duration,
    requiredNotes,
    audienceGuidance: buildAudienceGuidance(input),
    instruction:
      "targetAge와 duration에 맞춰 수업 전체를 설계하세요. lessonPlan 2000자+, teacherScript 2000자+ 필수. activityExamples는 활동마다 최소 3문장으로, 대상자가 그리고·오리고·붙이고·꾸미는 구체적 행동이 보이게 작성하세요. materials는 【기본재료】【꾸미기】【기타】로 분류하세요.",
  });
}

export function buildLessonExpansionUserPrompt(
  input: LessonInput,
  current: LessonResult,
  lessonPlanLength: number,
  teacherScriptLength: number,
  lessonPlanShort: boolean,
  teacherScriptShort: boolean,
): string {
  const requiredNotes = input.requirements.trim() || "(없음)";

  return JSON.stringify({
    topic: input.topic,
    targetAge: input.audience,
    duration: input.duration,
    requiredNotes,
    audienceGuidance: buildAudienceGuidance(input),
    currentLengths: {
      lessonPlan: lessonPlanLength,
      teacherScript: teacherScriptLength,
      minimumRequired: 2000,
    },
    expandLessonPlan: lessonPlanShort,
    expandTeacherScript: teacherScriptShort,
    currentResult: current,
    instruction:
      "currentResult 구조를 유지한 채 부족·추상적인 부분만 확장. activityExamples를 활동마다 3문장 이상의 구체적 만들기 행동으로 보강하고, materials 분류·기대 효과 톤을 강화하세요.",
  });
}
