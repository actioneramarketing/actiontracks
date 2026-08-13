import "server-only";

import { getCurrentUser } from "@/lib/auth/guide";
import type { User } from "@supabase/supabase-js";

function parseSiteAdminEmails(): string[] {
  const raw = process.env.SITE_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isSiteAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }
  return parseSiteAdminEmails().includes(email.trim().toLowerCase());
}

export type SiteAdminAccessResult =
  | { status: "unauthenticated" }
  | { status: "denied" }
  | { status: "ok"; user: User };

export async function getSiteAdminAccess(): Promise<SiteAdminAccessResult> {
  const user = await getCurrentUser();
  if (!user?.email) {
    return { status: "unauthenticated" };
  }

  if (!isSiteAdminEmail(user.email)) {
    return { status: "denied" };
  }

  return { status: "ok", user };
}
