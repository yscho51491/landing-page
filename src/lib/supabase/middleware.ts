import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

/** Edge middleware must stay fast — slow Supabase auth calls cause 504 timeouts. */
const AUTH_REFRESH_TIMEOUT_MS = 4_000;

async function refreshAuthSession(supabase: SupabaseClient): Promise<void> {
  try {
    await Promise.race([
      supabase.auth.getUser(),
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("auth refresh timeout")),
          AUTH_REFRESH_TIMEOUT_MS,
        );
      }),
    ]);
  } catch (error) {
    console.warn(
      "[middleware] Supabase auth refresh skipped:",
      error instanceof Error ? error.message : error,
    );
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasSupabaseEnv()) {
    return supabaseResponse;
  }

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  await refreshAuthSession(supabase);

  return supabaseResponse;
}
