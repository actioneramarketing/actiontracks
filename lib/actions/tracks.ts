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
    shortDescription: track.short_description ?? "",
    guideName,
    durationWeeks: track.duration_weeks ?? 0,
    status: track.status,
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
    .select("name")
    .eq("id", guideId)
    .maybeSingle();

  return data?.name ?? "Guide";
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

    const tracks = (data ?? []) as ActionTrack[];
    const listItems = await Promise.all(
      tracks.map(async (track) =>
        mapTrackToListItem(track, await resolveGuideName(track.guide_id))
      )
    );

    return { tracks: listItems };
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
): Promise<{ track: ActionTrack | null; error?: string }> {
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
      return { track: null, error: error.message };
    }

    return { track: (data as ActionTrack | null) ?? null };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load action track.";
    return { track: null, error: message };
  }
}

export async function getActionTrackBySlug(
  slug: string
): Promise<{ track: ActionTrack | null; error?: string }> {
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

    return { track: (data as ActionTrack | null) ?? null };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load action track.";
    return { track: null, error: message };
  }
}

export async function createActionTrack(formData: FormData) {
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
  const supabase = createAdminClient();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    throw new Error("Track title is required.");
  }

  const durationWeeksRaw = String(formData.get("duration_weeks") ?? "").trim();
  const durationWeeks = durationWeeksRaw ? Number(durationWeeksRaw) : null;

  const payload = {
    title,
    short_description:
      String(formData.get("short_description") ?? "").trim() || null,
    primary_outcome:
      String(formData.get("primary_outcome") ?? "").trim() || null,
    who_this_is_for:
      String(formData.get("who_this_is_for") ?? "").trim() || null,
    duration_weeks: Number.isFinite(durationWeeks) ? durationWeeks : null,
    track_type: String(formData.get("track_type") ?? "").trim() || "live_guided",
    status: parseTrackStatus(String(formData.get("status") ?? "draft")),
    start_date: String(formData.get("start_date") ?? "").trim() || null,
    end_date: String(formData.get("end_date") ?? "").trim() || null,
    philosophy: String(formData.get("philosophy") ?? "").trim() || null,
    welcome_headline:
      String(formData.get("welcome_headline") ?? "").trim() || null,
    completion_headline:
      String(formData.get("completion_headline") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("action_tracks")
    .update(payload)
    .eq("id", trackId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/guide/tracks");
  revalidatePath(`/guide/tracks/${trackId}/edit`);
  revalidatePath(`/guide/tracks/${trackId}/preview`);
}
