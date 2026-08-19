import "server-only";

import { getEnrollmentForTrackUser } from "@/lib/actions/enrollments";
import { getCurrentGuide, getCurrentUser, trackBelongsToGuide } from "@/lib/auth/guide";
import { getCurrentParticipant } from "@/lib/auth/participant";
import { isSiteAdminEmail } from "@/lib/auth/site-admin";
import { ActionTrackEnrollment, ActionTrackParticipant, GuideProfile } from "@/lib/types/database";
import { isEnrollmentCurrentlyAccessible } from "@/lib/utils/normalize-enrollment";
import type { User } from "@supabase/supabase-js";

export type TrackAccessResult =
  | { type: "unauthenticated" }
  | { type: "preview"; guide: GuideProfile; user: User }
  | { type: "site_admin_preview"; user: User }
  | {
      type: "enrolled";
      enrollment: ActionTrackEnrollment;
      participant: ActionTrackParticipant;
      user: User;
    }
  | { type: "denied" }
  | { type: "paused" }
  | { type: "error" };

function isGuideOwner(
  trackGuideId: string,
  guide: GuideProfile | null
): guide is GuideProfile {
  return Boolean(guide && trackBelongsToGuide(trackGuideId, guide.id));
}

export async function userCanAccessTrack(
  track: { id: string; guide_id: string },
  user: User | null
): Promise<boolean> {
  const result = await resolveTrackAccess(track, user);
  return (
    result.type === "preview" ||
    result.type === "enrolled" ||
    result.type === "site_admin_preview"
  );
}

export async function requireTrackEnrollment(track: {
  id: string;
  guide_id: string;
}): Promise<TrackAccessResult> {
  const user = await getCurrentUser();
  return resolveTrackAccess(track, user);
}

async function resolveTrackAccess(
  track: { id: string; guide_id: string },
  user: User | null
): Promise<TrackAccessResult> {
  try {
    if (!user) {
      return { type: "unauthenticated" };
    }

    const guide = await getCurrentGuide();
    if (isGuideOwner(track.guide_id, guide)) {
      return { type: "preview", guide, user };
    }

    if (isSiteAdminEmail(user.email)) {
      return { type: "site_admin_preview", user };
    }

    const participant = await getCurrentParticipant();
    if (!participant) {
      return { type: "denied" };
    }

    const { enrollment, error } = await getEnrollmentForTrackUser(
      track.id,
      user.id
    );

    if (error) {
      console.error("[requireTrackEnrollment] Enrollment lookup failed", {
        trackId: track.id,
        userId: user.id,
      });
      return { type: "error" };
    }

    if (!enrollment) {
      return { type: "denied" };
    }

    if (enrollment.status.trim().toLowerCase() === "paused") {
      return { type: "paused" };
    }

    if (!isEnrollmentCurrentlyAccessible(enrollment)) {
      return { type: "denied" };
    }

    return { type: "enrolled", enrollment, participant, user };
  } catch (error) {
    console.error("[requireTrackEnrollment] Unexpected error", {
      trackId: track.id,
      userId: user?.id,
      error,
    });
    return { type: "error" };
  }
}
