"use client";

import {
  buildReferralMailSubject,
  buildReferralShareText,
} from "@/lib/referral/share-content";
import { REFERRAL_SHARE_URL } from "@/lib/service/links";
import { useEffect, useState } from "react";

type ReferralShareModalProps = {
  userEmail: string;
  onClose: () => void;
};

function ShareOption({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-20 flex-col items-center gap-2 transition-opacity hover:opacity-85"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm">
        {children}
      </div>
      <span className="text-xs text-muted">{label}</span>
    </button>
  );
}

export default function ReferralShareModal({
  userEmail,
  onClose,
}: ReferralShareModalProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const shareText = buildReferralShareText(userEmail);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const showNotice = (message: string) => setNotice(message);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_SHARE_URL);
      showNotice("URL을 복사했어요!");
    } catch {
      showNotice("복사에 실패했어요.");
    }
  };

  const handleKakaoShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      showNotice("내용을 복사했어요. 카카오톡 채팅에 붙여넣어 공유해 주세요!");
    } catch {
      showNotice("복사에 실패했어요.");
    }
  };

  const handleMailShare = () => {
    const subject = encodeURIComponent(buildReferralMailSubject());
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    showNotice("메일 앱을 열었어요.");
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="공유하기"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-foreground">공유하기</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-4 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-alt hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-6">
          <div className="flex justify-center gap-10">
            <ShareOption label="카카오톡" onClick={() => void handleKakaoShare()}>
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#FEE500] text-2xl">
                💬
              </div>
            </ShareOption>
            <ShareOption label="메일" onClick={handleMailShare}>
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#03C75A] text-2xl text-white">
                ✉️
              </div>
            </ShareOption>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-surface-alt/50 px-4 py-3 text-center">
            <p className="text-xs font-semibold text-muted">추천인 ID</p>
            <p className="mt-1 break-all text-base font-bold text-emphasis md:text-lg">
              {userEmail}
            </p>
          </div>

          <div className="mt-4 flex overflow-hidden rounded-xl border border-border">
            <p className="min-w-0 flex-1 truncate px-4 py-3 text-sm text-[#0066cc]">
              {REFERRAL_SHARE_URL}
            </p>
            <button
              type="button"
              onClick={() => void handleCopyUrl()}
              className="shrink-0 border-l border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-alt"
            >
              복사
            </button>
          </div>

          {notice && (
            <p className="mt-4 text-center text-sm font-semibold text-emphasis">
              {notice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
