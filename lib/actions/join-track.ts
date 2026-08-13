"use server";

import { getEnrollmentForTrackUser } from "@/lib/actions/enrollments";
import { getStagesForTrack } from "@/lib/actions/stages";
import { getActionTrackBySlug } from "@/lib/actions/tracks";
import { ensureParticipantForUser } from "@/lib/actions/participants";
import { getCurrentUser } from "@/lib/auth/guide";
import { getParticipantKeyFromCookies } from "@/lib/participant/get-participant-key";
import { getFirstAvailableStage } from "@/lib/stages/release";
import { tryCreateAdminClient } from "@/lib/supabase/admin";
import { ActionTrackEnrollment } from "@/lib/types/database";
import { normalizeEnrollment } from "@/lib/utils/normalize-enrollment";
import { withReturnToQuery } from "@/lib/utils/safe-return-path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function metadataFullName(user: {
  user_metadata?: Record<string, unknown>;
}): string | undefined {
  const value = user.user_metadata?.full_name;
  return typeof value === "string" ? value : undefined;
}

function isActiveEnrollment(enrollment: ActionTrackEnrollment): boolean {
  return enrollment.status.trim().toLowerCase() === "active";
}

function continuePath(trackSlug: string, firstReleasedStageSlug: string | null): string {
  if (firstReleasedStageSlug) {
    return `/track/${trackSlug}/stages/${firstReleasedStageSlug}`;
  }
  return "/my-tracks";
}

async function upsertEnrollmentRow(params: {
  trackId: string;
  participantId: string;
  userId: string;
  participantKey: string | null;
}): Promise<{ enrollment: ActionTrackEnrollment | null; error?: string }> {
  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return {
      enrollment: null,
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const now = new Date().toISOString();
  const payload = {
    track_id: params.trackId,
    participant_id: params.participantId,
    user_id: params.userId,
    status: "active",
    enrolled_at: now,
    participant_key: params.participantKey,
    updated_at: now,
  };

  const upsert = await supabase
    .from("action_track_enrollments")
    .upsert(payload, { onConflict: "track_id,user_id" })
    .select("*")
    .maybeSingle();

  if (!upsert.error) {
    return { enrollment: normalizeEnrollment(upsert.data) };
  }

  console.error("[joinActionTrack] Enrollment upsert failed", {
    trackId: params.trackId,
    userId: params.userId,
    message: upsert.error.message,
    code: upsert.error.code,
  });

  const insert = await supabase
    .from("action_track_enrollments")
    .insert(payload)
    .select("*")
    .maybeSingle();

  if (!insert.error) {
    return { enrollment: normalizeEnrollment(insert.data) };
  }

  console.error("[joinActionTrack] Enrollment insert failed", {
    trackId: params.trackId,
    userId: params.userId,
    message: insert.error.message,
    code: insert.error.code,
  });

  if (insert.error.code === "23505") {
    const existing = await getEnrollmentForTrackUser(
      params.trackId,
      params.userId
    );
    if (existing.enrollment) {
      return existing;
    }
  }

  return { enrollment: null, error: "Failed to join this Action Track." };
}

export async function joinActionTrack(
  formData: FormData
): Promise<{ error?: string }> {
  const trackSlug = String(formData.get("track_slug") ?? "").trim();
  const joinPath = trackSlug ? `/join/${trackSlug}` : "/my-tracks";

  const user = await getCurrentUser();
  if (!user?.email) {
    redirect(withReturnToQuery("/participant/login", joinPath));
  }

  if (!trackSlug) {
    return { error: "This Action Track could not be found." };
  }

  const { track } = await getActionTrackBySlug(trackSlug);
  if (!track) {
    return { error: "This Action Track could not be found." };
  }

  let participant;
  try {
    participant = await ensureParticipantForUser(
      user.id,
      user.email,
      metadataFullName(user)
    );
  } catch (error) {
    console.error("[joinActionTrack] Participant profile setup failed", {
      userId: user.id,
      error,
    });
    return {
      error:
        "Your participant profile could not be set up. Please try again or contact support.",
    };
  }

  const existing = await getEnrollmentForTrackUser(track.id, user.id);
  if (existing.error) {
    return { error: "We couldn't verify your enrollment. Please try again." };
  }

  if (existing.enrollment && !isActiveEnrollment(existing.enrollment)) {
    return {
      error: "Your access to this Action Track is not currently active.",
    };
  }

  if (!existing.enrollment) {
    const participantKey = await getParticipantKeyFromCookies();
    const created = await upsertEnrollmentRow({
      trackId: track.id,
      participantId: participant.id,
      userId: user.id,
      participantKey,
    });

    if (created.error || !created.enrollment) {
      return {
        error: created.error ?? "Failed to join this Action Track.",
      };
    }

    if (!isActiveEnrollment(created.enrollment)) {
      return {
        error: "Your access to this Action Track is not currently active.",
      };
    }
  }

  revalidatePath("/my-tracks");
  revalidatePath(joinPath);

  const { stages } = await getStagesForTrack(track.id);
  const firstReleased = getFirstAvailableStage(stages);
  redirect(continuePath(track.slug, firstReleased?.slug?.trim() || null));
}
