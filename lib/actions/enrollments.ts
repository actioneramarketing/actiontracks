"use server";

import { getParticipantByUserId } from "@/lib/actions/participants";
import { tryCreateAdminClient } from "@/lib/supabase/admin";
import { ActionTrackEnrollment } from "@/lib/types/database";
import { normalizeActionTrack, NormalizedActionTrack } from "@/lib/utils/normalize-action-track";
import {
  isEnrollmentCurrentlyAccessible,
  normalizeEnrollment,
} from "@/lib/utils/normalize-enrollment";
import { getFirstStagesForTracks, TrackFirstStagePreview } from "@/lib/actions/stages";

export interface EnrollmentLookupResult {
  enrollment: ActionTrackEnrollment | null;
  error?: string;
}

export interface EnrolledTrackView {
  enrollment: ActionTrackEnrollment;
  track: NormalizedActionTrack;
  firstStageSlug: string | null;
  currentlyAccessible: boolean;
}

function firstEnrollmentRow(data: unknown): ActionTrackEnrollment | null {
  if (Array.isArray(data)) {
    return normalizeEnrollment(data[0] ?? null);
  }
  return normalizeEnrollment(data);
}

async function loadEnrollmentByTrackAndUserId(
  trackId: string,
  userId: string
): Promise<EnrollmentLookupResult> {
  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return {
      enrollment: null,
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const { data, error } = await supabase
    .from("action_track_enrollments")
    .select("*")
    .eq("track_id", trackId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("[getEnrollmentForTrackUser] Lookup by user_id failed", {
      trackId,
      userId,
      message: error.message,
      code: error.code,
    });
    return { enrollment: null, error: error.message };
  }

  return { enrollment: firstEnrollmentRow(data) };
}

async function loadEnrollmentByTrackAndParticipantId(
  trackId: string,
  participantId: string
): Promise<EnrollmentLookupResult> {
  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return {
      enrollment: null,
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const { data, error } = await supabase
    .from("action_track_enrollments")
    .select("*")
    .eq("track_id", trackId)
    .eq("participant_id", participantId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("[getEnrollmentForTrackUser] Lookup by participant_id failed", {
      trackId,
      participantId,
      message: error.message,
      code: error.code,
    });
    return { enrollment: null, error: error.message };
  }

  return { enrollment: firstEnrollmentRow(data) };
}

export async function getEnrollmentForTrackUser(
  trackId: string,
  userId: string
): Promise<EnrollmentLookupResult> {
  try {
    const byUserId = await loadEnrollmentByTrackAndUserId(trackId, userId);
    if (byUserId.error) {
      return byUserId;
    }
    if (byUserId.enrollment) {
      return byUserId;
    }

    const participant = await getParticipantByUserId(userId);
    if (!participant) {
      return { enrollment: null };
    }

    return loadEnrollmentByTrackAndParticipantId(trackId, participant.id);
  } catch (error) {
    console.error("[getEnrollmentForTrackUser] Unexpected error", {
      trackId,
      userId,
      error,
    });
    return { enrollment: null, error: "Failed to load enrollment." };
  }
}

export async function getEnrollmentsForParticipant(
  userId: string
): Promise<{ enrollments: ActionTrackEnrollment[]; error?: string }> {
  try {
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return {
        enrollments: [],
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    const byUserId = await supabase
      .from("action_track_enrollments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (byUserId.error) {
      console.error("[getEnrollmentsForParticipant] Lookup by user_id failed", {
        userId,
        message: byUserId.error.message,
        code: byUserId.error.code,
      });
      return { enrollments: [], error: "Failed to load enrollments." };
    }

    const enrollmentsById = new Map<string, ActionTrackEnrollment>();
    for (const row of byUserId.data ?? []) {
      const enrollment = normalizeEnrollment(row);
      if (enrollment) {
        enrollmentsById.set(enrollment.id, enrollment);
      }
    }

    const participant = await getParticipantByUserId(userId);
    if (participant) {
      const byParticipantId = await supabase
        .from("action_track_enrollments")
        .select("*")
        .eq("participant_id", participant.id)
        .order("created_at", { ascending: false });

      if (byParticipantId.error) {
        console.error(
          "[getEnrollmentsForParticipant] Lookup by participant_id failed",
          {
            userId,
            participantId: participant.id,
            message: byParticipantId.error.message,
            code: byParticipantId.error.code,
          }
        );
        return { enrollments: [], error: "Failed to load enrollments." };
      }

      for (const row of byParticipantId.data ?? []) {
        const enrollment = normalizeEnrollment(row);
        if (enrollment) {
          enrollmentsById.set(enrollment.id, enrollment);
        }
      }
    }

    const enrollments = [...enrollmentsById.values()].sort((a, b) => {
      const aTime = a.enrolled_at || a.created_at;
      const bTime = b.enrolled_at || b.created_at;
      return bTime.localeCompare(aTime);
    });

    return { enrollments };
  } catch (error) {
    console.error("[getEnrollmentsForParticipant] Unexpected error", {
      userId,
      error,
    });
    return { enrollments: [], error: "Failed to load enrollments." };
  }
}

export async function getEnrolledTracksForParticipant(
  userId: string
): Promise<{ tracks: EnrolledTrackView[]; error?: string }> {
  const { enrollments, error } = await getEnrollmentsForParticipant(userId);
  if (error) {
    return { tracks: [], error };
  }

  const activeEnrollments = enrollments.filter(
    (enrollment) => enrollment.status.trim().toLowerCase() === "active"
  );

  if (activeEnrollments.length === 0) {
    return { tracks: [] };
  }

  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return {
      tracks: [],
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const trackIds = [...new Set(activeEnrollments.map((item) => item.track_id))];
  const { data, error: tracksError } = await supabase
    .from("action_tracks")
    .select("*")
    .in("id", trackIds);

  if (tracksError) {
    console.error("[getEnrolledTracksForParticipant] Track lookup failed", {
      userId,
      message: tracksError.message,
      code: tracksError.code,
    });
    return { tracks: [], error: "Failed to load enrolled Action Tracks." };
  }

  const tracksById = new Map<string, NormalizedActionTrack>();
  for (const row of data ?? []) {
    const track = normalizeActionTrack(row);
    if (track) {
      tracksById.set(track.id, track);
    }
  }

  const { firstStagesByTrackId, error: firstStageError } =
    await getFirstStagesForTracks(trackIds);

  const views: EnrolledTrackView[] = [];
  for (const enrollment of activeEnrollments) {
    const track = tracksById.get(enrollment.track_id);
    if (!track) {
      continue;
    }

    const firstStage: TrackFirstStagePreview | null =
      firstStagesByTrackId[track.id] ?? null;

    views.push({
      enrollment,
      track,
      firstStageSlug: firstStage?.slug ?? null,
      currentlyAccessible: isEnrollmentCurrentlyAccessible(enrollment),
    });
  }

  return { tracks: views, error: firstStageError };
}
