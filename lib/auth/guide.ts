import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  ensureGuideForUser,
  getGuideByUserId,
  resolveGuideForUser,
} from "@/lib/actions/guides";
import { tryCreateAdminClient } from "@/lib/supabase/admin";
import { GuideProfile } from "@/lib/types/database";
import { normalizeActionTrack, NormalizedActionTrack } from "@/lib/utils/normalize-action-track";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error("[getCurrentUser] Unexpected error", { error });
    return null;
  }
}

export async function getCurrentGuide(): Promise<GuideProfile | null> {
  const user = await getCurrentUser();
  if (!user?.email) {
    return null;
  }

  try {
    const byUserId = await getGuideByUserId(user.id);
    if (byUserId) {
      return byUserId;
    }

    return resolveGuideForUser(user.id, user.email);
  } catch (error) {
    console.error("[getCurrentGuide] Unexpected error", {
      userId: user.id,
      error,
    });
    return null;
  }
}

export type RequireGuideResult =
  | { status: "unauthenticated" }
  | { status: "no_profile" }
  | { status: "pending"; guide: GuideProfile }
  | { status: "approved"; guide: GuideProfile; user: User };

export async function requireGuide(): Promise<RequireGuideResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { status: "unauthenticated" };
  }

  if (!user.email) {
    return { status: "no_profile" };
  }

  let guide = await getCurrentGuide();
  if (!guide) {
    return { status: "no_profile" };
  }

  if (guide.status && guide.status !== "approved") {
    return { status: "pending", guide };
  }

  return { status: "approved", guide, user };
}

export async function requireGuideForProfilePage(): Promise<
  | { status: "unauthenticated" }
  | { status: "ok"; guide: GuideProfile; user: User }
> {
  const user = await getCurrentUser();
  if (!user?.email) {
    return { status: "unauthenticated" };
  }

  try {
    const guide = await ensureGuideForUser(user.id, user.email);
    return { status: "ok", guide, user };
  } catch (error) {
    console.error("[requireGuideForProfilePage] Failed to ensure guide", {
      userId: user.id,
      error,
    });
    throw error;
  }
}

export function trackBelongsToGuide(
  trackGuideId: string,
  guideId: string
): boolean {
  return Boolean(trackGuideId && trackGuideId === guideId);
}

async function loadTrackForAccessCheck(
  trackId: string
): Promise<{ track: NormalizedActionTrack | null; error?: string }> {
  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return {
      track: null,
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const { data, error } = await supabase
    .from("action_tracks")
    .select("*")
    .eq("id", trackId)
    .maybeSingle();

  if (error) {
    console.error("[requireGuideTrackAccess] Supabase query failed", {
      trackId,
      message: error.message,
      code: error.code,
    });
    return { track: null, error: error.message };
  }

  if (!data) {
    return { track: null };
  }

  return { track: normalizeActionTrack(data) };
}

export type GuideTrackAccessResult =
  | { type: "redirect"; to: string }
  | { type: "pending"; guide: GuideProfile }
  | { type: "denied" }
  | { type: "not_found"; error?: string }
  | { type: "ok"; guide: GuideProfile; track: NormalizedActionTrack };

export async function requireGuideTrackAccess(
  trackId: string
): Promise<GuideTrackAccessResult> {
  const auth = await requireGuide();

  if (auth.status === "unauthenticated") {
    return { type: "redirect", to: "/login" };
  }

  if (auth.status === "no_profile") {
    return { type: "redirect", to: "/guide/profile" };
  }

  if (auth.status === "pending") {
    return { type: "pending", guide: auth.guide };
  }

  const { track, error } = await loadTrackForAccessCheck(trackId);
  if (!track) {
    return { type: "not_found", error };
  }

  if (!trackBelongsToGuide(track.guide_id, auth.guide.id)) {
    return { type: "denied" };
  }

  return { type: "ok", guide: auth.guide, track };
}

export async function redirectIfUnauthenticatedGuide(): Promise<GuideProfile | null> {
  const auth = await requireGuide();
  if (auth.status === "unauthenticated") {
    redirect("/login");
  }
  if (auth.status === "no_profile") {
    redirect("/guide/profile");
  }
  if (auth.status === "pending") {
    return auth.guide;
  }
  return null;
}
