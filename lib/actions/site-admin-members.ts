"use server";

import { getSiteAdminAccess } from "@/lib/auth/site-admin";
import {
  createAdminClient,
  tryCreateAdminClient,
} from "@/lib/supabase/admin";
import { normalizeEnrollment } from "@/lib/utils/normalize-enrollment";
import { normalizeActionTrack } from "@/lib/utils/normalize-action-track";
import { normalizeParticipant } from "@/lib/utils/normalize-participant";
import { revalidatePath } from "next/cache";

const ENROLLMENT_STATUSES = [
  "active",
  "paused",
  "revoked",
  "completed",
] as const;

export type EnrollmentStatusValue = (typeof ENROLLMENT_STATUSES)[number];

export interface SiteAdminMemberView {
  enrollmentId: string;
  status: string;
  enrolledAt: string;
  accessStartsAt: string;
  accessEndsAt: string;
  updatedAt: string;
  participantName: string;
  participantEmail: string;
  trackId: string;
  trackTitle: string;
  trackSlug: string;
  guideName: string;
}

function asStatus(value: string): EnrollmentStatusValue | null {
  const normalized = value.trim().toLowerCase();
  return ENROLLMENT_STATUSES.includes(normalized as EnrollmentStatusValue)
    ? (normalized as EnrollmentStatusValue)
    : null;
}

function sortNewestFirst(a: SiteAdminMemberView, b: SiteAdminMemberView) {
  const aTime = a.enrolledAt || a.updatedAt;
  const bTime = b.enrolledAt || b.updatedAt;
  return bTime.localeCompare(aTime);
}

export async function getActionTrackMembersForSiteAdmin(): Promise<{
  members: SiteAdminMemberView[];
  error?: string;
}> {
  try {
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return {
        members: [],
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    const { data: enrollmentRows, error: enrollmentError } = await supabase
      .from("action_track_enrollments")
      .select("*")
      .order("enrolled_at", { ascending: false });

    if (enrollmentError) {
      console.error("[getActionTrackMembersForSiteAdmin] Enrollment query failed", {
        message: enrollmentError.message,
        code: enrollmentError.code,
      });
      return { members: [], error: "Failed to load enrollments." };
    }

    const enrollments = (enrollmentRows ?? [])
      .map((row) => normalizeEnrollment(row))
      .filter((row): row is NonNullable<typeof row> => row != null);

    if (enrollments.length === 0) {
      return { members: [] };
    }

    const participantIds = [
      ...new Set(enrollments.map((item) => item.participant_id).filter(Boolean)),
    ];
    const userIds = [
      ...new Set(enrollments.map((item) => item.user_id).filter(Boolean)),
    ];
    const trackIds = [
      ...new Set(enrollments.map((item) => item.track_id).filter(Boolean)),
    ];

    const [participantByIdResult, participantByUserResult, trackResult] =
      await Promise.all([
        participantIds.length > 0
          ? supabase
              .from("action_track_participants")
              .select("*")
              .in("id", participantIds)
          : Promise.resolve({ data: [], error: null }),
        userIds.length > 0
          ? supabase
              .from("action_track_participants")
              .select("*")
              .in("user_id", userIds)
          : Promise.resolve({ data: [], error: null }),
        trackIds.length > 0
          ? supabase.from("action_tracks").select("*").in("id", trackIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

    if (participantByIdResult.error) {
      console.error("[getActionTrackMembersForSiteAdmin] Participant id lookup failed", {
        message: participantByIdResult.error.message,
        code: participantByIdResult.error.code,
      });
    }
    if (participantByUserResult.error) {
      console.error("[getActionTrackMembersForSiteAdmin] Participant user lookup failed", {
        message: participantByUserResult.error.message,
        code: participantByUserResult.error.code,
      });
    }
    if (trackResult.error) {
      console.error("[getActionTrackMembersForSiteAdmin] Track lookup failed", {
        message: trackResult.error.message,
        code: trackResult.error.code,
      });
    }

    const participantsById = new Map<
      string,
      { name: string; email: string; userId: string }
    >();
    for (const row of [
      ...(participantByIdResult.data ?? []),
      ...(participantByUserResult.data ?? []),
    ]) {
      const participant = normalizeParticipant(row);
      if (!participant) {
        continue;
      }
      const view = {
        name: participant.full_name.trim(),
        email: participant.email.trim(),
        userId: participant.user_id,
      };
      participantsById.set(participant.id, view);
      if (participant.user_id) {
        participantsById.set(`user:${participant.user_id}`, view);
      }
    }

    const tracksById = new Map<
      string,
      { title: string; slug: string; guideId: string }
    >();
    const guideIds: string[] = [];
    for (const row of trackResult.data ?? []) {
      const track = normalizeActionTrack(row);
      if (!track) {
        continue;
      }
      tracksById.set(track.id, {
        title: track.title,
        slug: track.slug,
        guideId: track.guide_id,
      });
      if (track.guide_id) {
        guideIds.push(track.guide_id);
      }
    }

    const uniqueGuideIds = [...new Set(guideIds)];
    const { data: guideRows, error: guidesError } =
      uniqueGuideIds.length > 0
        ? await supabase
            .from("action_track_guides")
            .select("id, full_name")
            .in("id", uniqueGuideIds)
        : { data: [], error: null };

    if (guidesError) {
      console.error("[getActionTrackMembersForSiteAdmin] Guide lookup failed", {
        message: guidesError.message,
        code: guidesError.code,
      });
    }

    const guidesById = new Map<string, string>();
    for (const row of guideRows ?? []) {
      const id = String(row.id ?? "").trim();
      if (!id) {
        continue;
      }
      guidesById.set(id, String(row.full_name ?? "").trim() || "Guide");
    }

    const members: SiteAdminMemberView[] = enrollments.map((enrollment) => {
      const participant =
        participantsById.get(enrollment.participant_id) ??
        (enrollment.user_id
          ? participantsById.get(`user:${enrollment.user_id}`)
          : undefined);
      const track = tracksById.get(enrollment.track_id);

      return {
        enrollmentId: enrollment.id,
        status: enrollment.status.trim() || "active",
        enrolledAt: enrollment.enrolled_at,
        accessStartsAt: enrollment.access_starts_at,
        accessEndsAt: enrollment.access_ends_at,
        updatedAt: enrollment.updated_at,
        participantName: participant?.name || "Unknown participant",
        participantEmail: participant?.email || "",
        trackId: enrollment.track_id,
        trackTitle: track?.title || "Unknown Action Track",
        trackSlug: track?.slug || "",
        guideName: track?.guideId ? guidesById.get(track.guideId) || "" : "",
      };
    });

    members.sort(sortNewestFirst);
    return { members };
  } catch (error) {
    console.error("[getActionTrackMembersForSiteAdmin] Unexpected error", {
      error,
    });
    return { members: [], error: "Failed to load enrollments." };
  }
}

export async function updateEnrollmentStatus(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const access = await getSiteAdminAccess();
  if (access.status !== "ok") {
    return { error: "You do not have access to this admin area." };
  }

  const enrollmentId = String(formData.get("enrollment_id") ?? "").trim();
  const status = asStatus(String(formData.get("status") ?? ""));

  if (!enrollmentId) {
    return { error: "Missing enrollment." };
  }

  if (!status) {
    return { error: "That enrollment status is not allowed." };
  }

  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("action_track_enrollments")
      .update({
        status,
        updated_at: now,
      })
      .eq("id", enrollmentId)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[updateEnrollmentStatus] Update failed", {
        enrollmentId,
        status,
        message: error.message,
        code: error.code,
      });
      return { error: "Failed to update enrollment access." };
    }

    if (!data) {
      return { error: "Enrollment not found." };
    }

    revalidatePath("/site-admin/members");
    revalidatePath("/my-tracks");
    return { success: true };
  } catch (error) {
    console.error("[updateEnrollmentStatus] Unexpected error", {
      enrollmentId,
      status,
      error,
    });
    return { error: "Failed to update enrollment access." };
  }
}
