"use server";

import {
  createAdminClient,
  SupabaseConfigError,
  tryCreateAdminClient,
} from "@/lib/supabase/admin";
import {
  ActionTrack,
  ActionTrackListItem,
  TrackStatus,
} from "@/lib/types/database";
import { uniqueSlug } from "@/lib/utils/slug";
import {
  normalizeActionTrack,
  NormalizedActionTrack,
} from "@/lib/utils/normalize-action-track";
import { requireGuide } from "@/lib/auth/guide";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseTrackStatus(value: string | null): TrackStatus {
  if (value === "active" || value === "archived") {
    return value;
  }
  return "draft";
}

function mapTrackToListItem(
  track: ActionTrack,
  guideName = "Guide"
): ActionTrackListItem {
  return {
    id: track.id,
    slug: track.slug,
    title: track.title,
    shortDescription: track.short_description,
    guideName,
    durationWeeks: track.duration_weeks,
    status: track.status,
    trackType: track.track_type,
    startDate: track.start_date,
    endDate: track.end_date,
    trackImageUrl: track.track_image_url,
    trackIconUrl: track.track_icon_url,
  };
}

async function resolveGuideName(guideId: string | null): Promise<string> {
  if (!guideId) {
    return "Guide";
  }

  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return "Guide";
  }

  const { data } = await supabase
    .from("action_track_guides")
    .select("full_name")
    .eq("id", guideId)
    .maybeSingle();

  return data?.full_name ?? "Guide";
}

export async function getActionTracksForGuide(guideId: string): Promise<{
  tracks: ActionTrackListItem[];
  error?: string;
}> {
  try {
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return {
        tracks: [],
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    const { data, error } = await supabase
      .from("action_tracks")
      .select("*")
      .eq("guide_id", guideId)
      .order("created_at", { ascending: false });

    if (error) {
      return { tracks: [], error: error.message };
    }

    const listItems = await Promise.all(
      (data ?? []).map(async (raw) => {
        const track = normalizeActionTrack(raw);
        if (!track) {
          return null;
        }
        return mapTrackToListItem(
          track,
          await resolveGuideName(track.guide_id || null)
        );
      })
    );

    return {
      tracks: listItems.filter(
        (item): item is ActionTrackListItem => item != null
      ),
    };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load action tracks.";
    return { tracks: [], error: message };
  }
}

export async function getActionTracks(): Promise<{
  tracks: ActionTrackListItem[];
  error?: string;
}> {
  try {
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return {
        tracks: [],
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    const { data, error } = await supabase
      .from("action_tracks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { tracks: [], error: error.message };
    }

    const listItems = await Promise.all(
      (data ?? []).map(async (raw) => {
        const track = normalizeActionTrack(raw);
        if (!track) {
          return null;
        }
        return mapTrackToListItem(
          track,
          await resolveGuideName(track.guide_id || null)
        );
      })
    );

    return {
      tracks: listItems.filter(
        (item): item is ActionTrackListItem => item != null
      ),
    };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load action tracks.";
    return { tracks: [], error: message };
  }
}

export async function getActionTrackById(
  trackId: string
): Promise<{ track: NormalizedActionTrack | null; error?: string }> {
  try {
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
      console.error("[getActionTrackById] Supabase query failed", {
        route: "/guide/tracks/[trackId]/edit",
        trackId,
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return { track: null, error: error.message };
    }

    if (!data) {
      return { track: null };
    }

    const track = normalizeActionTrack(data);
    if (!track) {
      console.error("[getActionTrackById] Failed to normalize track row", {
        route: "/guide/tracks/[trackId]/edit",
        trackId,
      });
      return {
        track: null,
        error: "The Action Track data could not be read.",
      };
    }

    return { track };
  } catch (error) {
    console.error("[getActionTrackById] Unexpected error", {
      route: "/guide/tracks/[trackId]/edit",
      trackId,
      error,
    });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load action track.";
    return { track: null, error: message };
  }
}

export const getTrackById = getActionTrackById;

export async function getActionTrackBySlug(
  slug: string
): Promise<{ track: NormalizedActionTrack | null; error?: string }> {
  try {
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
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return { track: null, error: error.message };
    }

    if (!data) {
      return { track: null };
    }

    return { track: normalizeActionTrack(data) };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load action track.";
    return { track: null, error: message };
  }
}

function optionalFormString(formData: FormData, name: string): string | null {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

function optionalFormDate(formData: FormData, name: string): string | null {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

function parseDurationWeeks(formData: FormData): number {
  const raw = String(formData.get("duration_weeks") ?? "").trim();
  if (!raw) {
    return 6;
  }
  const num = Number(raw);
  return Number.isFinite(num) && num > 0 ? num : 6;
}

export async function createActionTrack(formData: FormData) {
  const auth = await requireGuide();

  if (auth.status === "unauthenticated") {
    redirect("/login");
  }

  if (auth.status === "no_profile") {
    redirect("/guide/profile");
  }

  if (auth.status === "pending") {
    throw new Error("Your guide account is not approved yet.");
  }

  const supabase = createAdminClient();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    throw new Error("Track title is required.");
  }

  const trackType =
    String(formData.get("track_type") ?? "").trim() || "live_guided";
  const durationWeeksRaw = String(formData.get("duration_weeks") ?? "").trim();
  const durationWeeks = durationWeeksRaw ? Number(durationWeeksRaw) : null;

  const slug = uniqueSlug(title, Date.now().toString(36).slice(-6));

  const payload = {
    guide_id: auth.guide.id,
    slug,
    title,
    short_description:
      String(formData.get("short_description") ?? "").trim() || null,
    primary_outcome:
      String(formData.get("primary_outcome") ?? "").trim() || null,
    who_this_is_for:
      String(formData.get("who_this_is_for") ?? "").trim() || null,
    duration_weeks: Number.isFinite(durationWeeks) ? durationWeeks : null,
    track_type: trackType,
    status: "draft",
    start_date: String(formData.get("start_date") ?? "").trim() || null,
    end_date: String(formData.get("end_date") ?? "").trim() || null,
    track_image_url: optionalFormString(formData, "track_image_url"),
    track_icon_url: optionalFormString(formData, "track_icon_url"),
  };

  const { data, error } = await supabase
    .from("action_tracks")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/guide/tracks");
  redirect(`/guide/tracks/${data.id}/edit`);
}

export async function updateActionTrack(trackId: string, formData: FormData) {
  try {
    const supabase = createAdminClient();

    const title = String(formData.get("title") ?? "").trim();
    if (!title) {
      throw new Error("Track title is required.");
    }

    const updatePayload = {
      title,
      short_description: optionalFormString(formData, "short_description"),
      primary_outcome: optionalFormString(formData, "primary_outcome"),
      who_this_is_for: optionalFormString(formData, "who_this_is_for"),
      track_type:
        String(formData.get("track_type") ?? "").trim() || "live_guided",
      status: parseTrackStatus(String(formData.get("status") ?? "draft")),
      duration_weeks: parseDurationWeeks(formData),
      start_date: optionalFormDate(formData, "start_date"),
      end_date: optionalFormDate(formData, "end_date"),
      track_image_url: optionalFormString(formData, "track_image_url"),
      track_icon_url: optionalFormString(formData, "track_icon_url"),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("action_tracks")
      .update(updatePayload)
      .eq("id", trackId);

    if (error) {
      console.error("[updateActionTrack] Supabase update failed", {
        trackId,
        payloadKeys: Object.keys(updatePayload),
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      if (error.code === "PGRST204") {
        throw new Error(
          "Failed to save Action Track: an unsupported field was sent. Please try again or contact support."
        );
      }

      throw new Error("Failed to save Action Track. Please try again.");
    }

    revalidatePath("/guide/tracks");
    revalidatePath(`/guide/tracks/${trackId}/edit`);
    revalidatePath(`/guide/tracks/${trackId}/preview`);
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      console.error("[updateActionTrack] Supabase not configured", { trackId });
      throw new Error(error.message);
    }

    if (error instanceof Error) {
      throw error;
    }

    console.error("[updateActionTrack] Unexpected error", { trackId, error });
    throw new Error("Failed to save Action Track. Please try again.");
  }
}
