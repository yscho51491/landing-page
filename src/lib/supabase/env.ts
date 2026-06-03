export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes("your-project-id") || anonKey === "your-anon-key") {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다.\n\n" +
        "1. artteacherlab-landing 폴더의 .env.local 파일을 열어주세요.\n" +
        "2. Supabase 대시보드 → Settings → API 에서\n" +
        "   Project URL → NEXT_PUBLIC_SUPABASE_URL\n" +
        "   anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
        "3. 저장 후 터미널에서 Ctrl+C 로 서버를 끄고 npm run dev 를 다시 실행하세요.",
    );
  }

  return { url, anonKey };
}
