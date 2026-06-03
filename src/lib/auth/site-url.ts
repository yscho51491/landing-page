const AUTH_CALLBACK_PATH = "/auth/callback";
const SUPABASE_OAUTH_CALLBACK_PATH = "/auth/v1/callback";

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

/**
 * 배포 환경(Vercel 등)에서 설정한 공개 사이트 URL.
 * 로컬에서는 비워 두고 브라우저 origin을 사용합니다.
 */
export function getConfiguredSiteOrigin(): string | null {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return normalizeOrigin(explicit);
  }

  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (vercelUrl) {
    const host = vercelUrl.replace(/^https?:\/\//, "");
    return normalizeOrigin(`https://${host}`);
  }

  return null;
}

/**
 * 클라이언트: 현재 접속 origin 우선 (localhost:3000 / 3001, Vercel 도메인 등).
 * SSR/빌드 시에는 NEXT_PUBLIC_SITE_URL → VERCEL URL 순으로 fallback.
 */
export function getClientSiteOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return normalizeOrigin(window.location.origin);
  }

  const configured = getConfiguredSiteOrigin();
  if (configured) {
    return configured;
  }

  return "http://localhost:3000";
}

/**
 * Supabase OAuth 완료 후 돌아올 앱 콜백 URL (redirectTo).
 * Google/Kakao 콘솔에는 Supabase 프로젝트 URL(.../auth/v1/callback)만 등록합니다.
 */
/**
 * Google·카카오 개발자 콘솔에 등록해야 하는 Redirect URI (Supabase 전용).
 * localhost가 아닌 Supabase 프로젝트 URL입니다.
 */
export function getSupabaseProviderRedirectUri(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw || raw.includes("your-project-id")) {
    return null;
  }

  try {
    const base = normalizeOrigin(new URL(raw).origin);
    return `${base}${SUPABASE_OAUTH_CALLBACK_PATH}`;
  } catch {
    return null;
  }
}

export function buildAuthCallbackUrl(nextPath = "/"): string {
  const origin = getClientSiteOrigin();
  const safeNext =
    nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";
  const params = new URLSearchParams({ next: safeNext });
  return `${origin}${AUTH_CALLBACK_PATH}?${params.toString()}`;
}

/**
 * Route Handler: 프록시 헤더를 반영한 요청 origin (Vercel 배포용).
 */
export function getRequestSiteOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]?.trim();
    if (host) {
      return normalizeOrigin(`${forwardedProto}://${host}`);
    }
  }

  const host = request.headers.get("host");
  if (host) {
    const proto =
      request.headers.get("x-forwarded-proto") ??
      (host.includes("localhost") ? "http" : "https");
    return normalizeOrigin(`${proto}://${host}`);
  }

  const configured = getConfiguredSiteOrigin();
  if (configured) {
    return configured;
  }

  return normalizeOrigin(new URL(request.url).origin);
}
