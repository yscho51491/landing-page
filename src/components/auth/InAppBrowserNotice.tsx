"use client";

import {
  detectInAppBrowser,
  getInAppBrowserLabel,
  openInExternalBrowser,
} from "@/lib/auth/in-app-browser";
import { useEffect, useState } from "react";

type InAppBrowserNoticeProps = {
  loginPageUrl: string;
};

export default function InAppBrowserNotice({
  loginPageUrl,
}: InAppBrowserNoticeProps) {
  const [kind, setKind] = useState(detectInAppBrowser());

  useEffect(() => {
    setKind(detectInAppBrowser());
  }, []);

  if (!kind) return null;

  const label = getInAppBrowserLabel(kind);

  return (
    <div className="mb-4 rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-left">
      <p className="text-sm font-bold text-amber-900">
        ⚠️ {label}에서는 Google 로그인이 차단될 수 있어요
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-amber-900/80">
        Safari 또는 Chrome에서 열어야 로그인이 정상적으로 됩니다.
        {kind === "kakaotalk"
          ? " 아래 버튼을 누르거나, 우측 상단 메뉴에서 외부 브라우저로 열어 주세요."
          : " 우측 상단 ⋯ 메뉴에서 ‘Safari/Chrome에서 열기’를 선택해 주세요."}
      </p>
      <button
        type="button"
        onClick={() => openInExternalBrowser(loginPageUrl)}
        className="mt-3 w-full rounded-full bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-600"
      >
        Safari / Chrome에서 열기
      </button>
    </div>
  );
}
