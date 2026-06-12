"use client";

import { PENDING_REFERRER_STORAGE_KEY } from "@/lib/referral/referral-errors";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";

export default function ReferralClaimRunner() {
  const [notice, setNotice] = useState<string | null>(null);
  const claimedRef = useRef(false);

  useEffect(() => {
    if (claimedRef.current) return;

    const supabase = createClient();

    const tryClaim = async () => {
      const pending = sessionStorage.getItem(PENDING_REFERRER_STORAGE_KEY);
      if (!pending) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      claimedRef.current = true;
      sessionStorage.removeItem(PENDING_REFERRER_STORAGE_KEY);

      try {
        const res = await fetch("/api/referral/claim", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referrerEmail: pending }),
        });

        const data = (await res.json()) as { message?: string; error?: string };
        if (res.ok && data.message) {
          setNotice(data.message);
        }
      } catch {
        // 조용히 무시 — 로그인만 성공해도 됨
      }
    };

    void tryClaim();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        void tryClaim();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!notice) return null;

  return (
    <div className="fixed right-4 bottom-4 z-[200] max-w-sm rounded-2xl border border-primary/30 bg-surface px-5 py-4 shadow-xl">
      <p className="text-sm font-semibold text-foreground">🎉 추천인 보너스</p>
      <p className="mt-1 text-sm text-muted">{notice}</p>
      <button
        type="button"
        onClick={() => setNotice(null)}
        className="mt-3 text-xs font-semibold text-primary hover:underline"
      >
        닫기
      </button>
    </div>
  );
}
