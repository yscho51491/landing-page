"use client";

import InAppBrowserNotice from "@/components/auth/InAppBrowserNotice";
import { buildAuthCallbackUrl } from "@/lib/auth/site-url";
import { isInAppBrowser, openInExternalBrowser } from "@/lib/auth/in-app-browser";
import { PENDING_REFERRER_STORAGE_KEY } from "@/lib/referral/referral-errors";
import { createClient } from "@/lib/supabase/client";
import { useMemo, useState } from "react";

type LoginButtonsProps = {
  redirectPath?: string;
};

export default function LoginButtons({ redirectPath = "/" }: LoginButtonsProps) {
  const [loading, setLoading] = useState<"google" | "kakao" | null>(null);
  const [referrerEmail, setReferrerEmail] = useState("");

  const loginPageUrl = useMemo(() => {
    if (typeof window === "undefined") return "/login";
    const params = new URLSearchParams();
    if (redirectPath && redirectPath !== "/") {
      params.set("next", redirectPath);
    }
    const query = params.toString();
    return `${window.location.origin}/login${query ? `?${query}` : ""}`;
  }, [redirectPath]);

  const signInWithOAuth = async (provider: "google" | "kakao") => {
    setLoading(provider);

    const trimmedReferrer = referrerEmail.trim().toLowerCase();
    if (trimmedReferrer) {
      sessionStorage.setItem(PENDING_REFERRER_STORAGE_KEY, trimmedReferrer);
    } else {
      sessionStorage.removeItem(PENDING_REFERRER_STORAGE_KEY);
    }

    const supabase = createClient();
    const redirectTo = buildAuthCallbackUrl(redirectPath);
    const inApp = isInAppBrowser();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: inApp,
        queryParams:
          provider === "google"
            ? { access_type: "offline", prompt: "consent" }
            : { scope: "profile_nickname profile_image account_email" },
      },
    });

    if (error) {
      setLoading(null);
      alert("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (inApp && data?.url) {
      openInExternalBrowser(data.url);
      setLoading(null);
      return;
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <InAppBrowserNotice loginPageUrl={loginPageUrl} />

      <label className="text-left">
        <span className="text-xs font-semibold text-foreground">
          추천인 ID <span className="font-normal text-muted">(선택)</span>
        </span>
        <input
          type="email"
          value={referrerEmail}
          onChange={(e) => setReferrerEmail(e.target.value)}
          placeholder="추천인 이메일 주소"
          disabled={loading !== null}
          className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-none disabled:opacity-60"
        />
        <span className="mt-1 block text-[11px] leading-relaxed text-muted">
          신규 가입 시 나와 추천인에게 아트랩코인 5개가 추가됩니다.
        </span>
      </label>

      <button
        type="button"
        onClick={() => void signInWithOAuth("google")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-surface-alt disabled:opacity-60"
      >
        {loading === "google" ? (
          "연결 중..."
        ) : (
          <>
            <GoogleIcon />
            Google로 로그인
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => void signInWithOAuth("kakao")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] px-6 py-3.5 text-sm font-semibold text-[#191919] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading === "kakao" ? (
          "연결 중..."
        ) : (
          <>
            <KakaoIcon />
            카카오로 로그인
          </>
        )}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919" aria-hidden>
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.87 5.33 4.69 6.77L5.5 21l4.02-2.2c.74.11 1.5.17 2.28.17 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
    </svg>
  );
}
