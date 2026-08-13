import "server-only";

import { getStageById } from "@/lib/actions/stages";
import { getActionTrackById } from "@/lib/actions/tracks";
import { requireTrackEnrollment } from "@/lib/auth/track-access";
import { isStageReleased } from "@/lib/stages/release";

export type StageWriteAccessResult =
  | { ok: true }
  | { ok: false; error: string };

export async function requireStageWriteAccess(
  trackId: string,
  stageId: string
): Promise<StageWriteAccessResult> {
  try {
    const { track } = await getActionTrackById(trackId);
    if (!track) {
      return { ok: false, error: "Action Track not found." };
    }

    const { stage } = await getStageById(stageId);
    if (!stage || stage.track_id !== trackId) {
      return { ok: false, error: "Stage not found for this track." };
    }

    const access = await requireTrackEnrollment(track);
    if (access.type === "unauthenticated" || access.type === "denied") {
      return { ok: false, error: "You don't have access to this Action Track." };
    }

    if (access.type === "error") {
      return {
        ok: false,
        error: "We couldn't verify your access. Please try again.",
      };
    }

    if (access.type === "preview" || access.type === "site_admin_preview") {
      return { ok: true };
    }

    if (!isStageReleased(stage)) {
      return { ok: false, error: "This stage is not available yet." };
    }

    return { ok: true };
  } catch (error) {
    console.error("[requireStageWriteAccess] Unexpected error", {
      trackId,
      stageId,
      error,
    });
    return {
      ok: false,
      error: "We couldn't verify your access. Please try again.",
    };
  }
}
