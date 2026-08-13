import { createClient } from "@/lib/supabase/server";
import { getSafeReturnPath } from "@/lib/utils/safe-return-path";
import { NextResponse } from "next/server";

function isParticipantNextPath(next: string): boolean {
  return (
    next === "/my-tracks" ||
    next.startsWith("/my-tracks/") ||
    next.startsWith("/participant/") ||
    next.startsWith("/track/") ||
    next === "/join" ||
    next.startsWith("/join/")
  );
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeReturnPath(searchParams.get("next"), "/guide/profile");
  const errorRedirect = isParticipantNextPath(next)
    ? `${origin}/participant/login?error=auth_callback`
    : `${origin}/login?error=auth_callback`;

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      console.error("[auth/callback] exchangeCodeForSession failed", {
        message: error.message,
      });
    }
  }

  return NextResponse.redirect(errorRedirect);
}
