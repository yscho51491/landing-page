export function hasSupabaseEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      anonKey &&
      !url.includes("your-project-id") &&
      anonKey !== "your-anon-key",
  );
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasSupabaseEnv()) {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다.\n\n" +
        "1. artteacherlab-landing 폴더의 .env.local 파일을 열어주세요.\n" +
        "2. Supabase 대시보드 → Settings → API 에서\n" +
        "   Project URL → NEXT_PUBLIC_SUPABASE_URL\n" +
        "   anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
        "3. Vercel 배포 시: Project → Settings → Environment Variables 에도 동일하게 추가하세요.\n" +
        "4. 저장 후 개발 서버를 재시작하거나 Vercel에서 Redeploy 하세요.",
    );
  }

  return { url: url!, anonKey: anonKey! };
}
