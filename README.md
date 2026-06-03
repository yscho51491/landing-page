# 아트티쳐랩 랜딩 페이지

AI 미술 수업자료 생성 서비스 **아트티쳐랩**의 랜딩 페이지입니다.

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase Auth (Google / Kakao)

## 시작하기

```bash
cd artteacherlab-landing
npm install
cp .env.example .env.local
# .env.local 에 Supabase URL·anon key 입력 후
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 프로젝트 구조

```
src/
├── middleware.ts         # Supabase 세션 갱신
├── lib/supabase/         # Supabase 클라이언트 (browser / server)
├── app/
│   ├── page.tsx          # 메인 페이지
│   ├── login/page.tsx    # 소셜 로그인
│   └── auth/callback/    # OAuth 리다이렉트 처리
└── components/
    ├── auth/             # LoginButtons, HeaderAuth
    ├── layout/           # Header, Footer
    └── sections/         # 랜딩 섹션
```

## 소셜 로그인 (Supabase)

1. Supabase 대시보드 → Authentication → URL Configuration  
   - Site URL: `http://localhost:3000`  
   - Redirect URLs: `http://localhost:3000/**`
2. Providers에서 Google, Kakao 활성화
3. 카카오/구글 Redirect URI: `https://[프로젝트ID].supabase.co/auth/v1/callback`
4. `/login` 에서 로그인 테스트

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
