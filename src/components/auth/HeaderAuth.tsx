"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function HeaderAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  if (loading) {
    return (
      <span className="inline-block h-9 w-24 animate-pulse rounded-full bg-border" />
    );
  }

  if (user) {
    const displayName =
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email?.split("@")[0] ??
      "선생님";

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/my"
          className="hidden max-w-[100px] truncate text-sm font-medium text-foreground transition-colors hover:text-primary lg:inline"
        >
          {displayName}님
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-emphasis hover:text-emphasis"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark md:px-5 md:py-2.5"
    >
      로그인
    </Link>
  );
}
