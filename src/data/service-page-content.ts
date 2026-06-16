export const SERVICE_HOW_IT_WORKS = [
  {
    title: "아이디어가 순식간에",
    body: "주제 2개만 입력하면 학습 목표부터 수업과정, 준비물, 기대효과까지 한번에 제작됩니다.",
    bgColor: "#F5C842",
    animation: "idea",
  },
  {
    title: "완성작도 한번에",
    body: "이 수업을 하면 어떤 결과물이 나올까? 예시작까지 한 번에 확인하세요.",
    bgColor: "#4A7FD4",
    animation: "artwork",
  },
  {
    title: "수정과 제안도 손쉽게",
    body: "수업 계획안 제출이 필요하신가요? 완성된 계획안은 WORD로 저장됩니다. 간편하게 수정하고 바로 제출하세요!",
    bgColor: "#E8843A",
    animation: "word",
  },
] as const;

export const MIXING_EXAMPLES = [
  {
    words: "향수 + 기차",
    result: "향기를 싣고 달리는 기억 기차",
  },
  {
    words: "우주 + 우체국",
    result: "외계 친구에게 보내는 별빛 편지함",
  },
  {
    words: "공룡 + 꽃",
    result: "공룡 시대에 피어난 상상 식물원",
  },
] as const;

/** 서비스 소개 — 믹싱 랩 완성작 캐러셀 (홈 그리드 이미지 + 수업 상세 연동) */
export const MIXING_LESSON_SHOWCASE = [
  {
    lessonExampleId: "robot-collage",
    bgColor: "#F5C842",
    words: "재활용 재료 × 로봇",
  },
  {
    lessonExampleId: "batik-no-wax-1",
    bgColor: "#4A7FD4",
    words: "여름 × 바틱",
  },
  {
    lessonExampleId: "colorful-jellyfish",
    bgColor: "#E8843A",
    words: "바다 × 해파리",
  },
] as const;

export const HOME_SCREEN_PREVIEW = {
  src: "/images/service/home-screen-preview.png",
  alt: "아트티쳐랩 홈 화면 — 다양한 수업 완성작 그리드",
} as const;

export const COIN_CARDS = [
  { title: "가입 즉시", body: "아트랩코인 3개 제공" },
  { title: "이미지 재생성", body: "보유한 코인으로 다시 생성 가능" },
  { title: "베타 테스터", body: "신청 시 아트랩코인 30개 제공" },
  { title: "추천인 이벤트", body: "나와 친구 모두 코인 5개 추가 지급" },
] as const;

export const SERVICE_FAQ = [
  {
    q: "아트티쳐랩은 무엇을 만들어주나요?",
    a: "두 개의 단어를 바탕으로 수업 개요, 학습 목표, 준비물, 수업 과정, 기대 효과가 포함된 수업 계획서를 만들어드립니다. 생성된 수업 계획안을 바탕으로 완성작 예시 이미지도 확인할 수 있습니다.",
  },
  {
    q: "PPT, 활동지, 도안도 제공되나요?",
    a: "현재 베타 버전에서는 수업 계획서와 완성작 예시 이미지 생성에 집중하고 있습니다. 활동지, 도안, PPT 기능은 추후 업데이트 예정입니다.",
  },
  {
    q: "생성한 수업 계획서는 수정할 수 있나요?",
    a: "네. 수업 계획서는 Word 파일로 다운로드할 수 있어, 다운받은 뒤 원하는 부분을 자유롭게 수정할 수 있습니다.",
  },
  {
    q: "완성작 이미지가 마음에 들지 않으면 어떻게 하나요?",
    a: "보유한 아트랩코인을 사용해 이미지를 다시 생성할 수 있습니다. 회원가입 시 아트랩코인 3개가 제공됩니다.",
  },
  {
    q: "다른 사람이 만든 수업 아이디어도 볼 수 있나요?",
    a: "네. 홈 화면에서 다른 유저들이 생성한 수업 아이디어와 완성작 예시 이미지를 확인할 수 있습니다.",
  },
  {
    q: "추천인 이벤트는 어떻게 참여하나요?",
    a: "새로 가입하는 유저가 추천인 ID에 내 이메일 주소를 입력하면, 추천한 유저와 새로 가입한 유저 모두에게 아트랩코인 5개가 지급됩니다.",
  },
  {
    q: "베타 테스터 혜택은 무엇인가요?",
    a: "베타 테스터 신청 시 아트랩코인 30개를 받을 수 있습니다. 체험 후 의견을 남겨주시면 서비스 개선에 큰 도움이 됩니다.",
  },
] as const;
