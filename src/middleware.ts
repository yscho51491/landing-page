import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Public pages (/lab, /, /service …) skip middleware to avoid 504 timeouts.
  matcher: [
    "/studio/:path*",
    "/my/:path*",
    "/login",
    "/auth/:path*",
    "/api/:path*",
  ],
};
