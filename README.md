# 아트티쳐랩 랜딩 페이지

AI 미술 수업자료 생성 서비스 **아트티쳐랩**의 랜딩 페이지입니다.

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4

## 시작하기

```bash
cd artteacherlab-landing
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 메인 페이지 (섹션 조립)
│   ├── layout.tsx        # 레이아웃, 메타데이터, 한글 폰트
│   └── globals.css       # 전역 스타일, 색상 변수
└── components/
    ├── layout/           # Header, Footer
    ├── sections/         # 15개 랜딩 섹션
    └── ui/               # Button, Section 공통 컴포넌트
```

## 섹션 목록

1. Hero (메인 히어로)
2. Problem (문제 공감)
3. ServiceIntro (서비스 소개)
4. InputExample (입력 예시)
5. Deliverables (제공 결과물)
6. TargetAudience (사용 대상)
7. Comparison (기존 방식 비교)
8. UseCases (활용 상황)
9. GenerationExample (실제 생성 예시)
10. Benefits (핵심 장점)
11. HowToUse (사용 방법)
12. Trust (신뢰·후기)
13. PreRegister (베타 신청 폼)
14. FAQ
15. FinalCTA

## 배포

[Vercel](https://vercel.com)에 GitHub 저장소를 연결하면 자동 배포됩니다.

```bash
npm run build
npm run start
```
