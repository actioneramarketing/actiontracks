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
  try {
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
      track_type:
        String(formData.get("track_type") ?? "").trim() || "live_guided",
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
      console.error("[updateActionTrack] Supabase update failed", {
        trackId,
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
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

export interface ActionTrackDebugInfo {
  trackId: string;
  found: boolean;
  supabaseError?: {
    message: string;
    code?: string;
    details?: string;
    hint?: string;
  };
  configError?: string;
  fields?: {
    id: string;
    title: string;
    slug: string;
    status: string;
    track_type: string;
    duration_weeks: string;
    start_date: string;
    end_date: string;
    visibility: string;
    created_at: string;
    updated_at: string;
  };
  nullFields?: Record<string, boolean>;
  settingsJsonIsObject: boolean;
  settingsJsonType: string;
}

function safeDisplay(value: unknown): string {
  if (value == null) {
    return "(null)";
  }
  if (typeof value === "object") {
    return "(object)";
  }
  return String(value);
}

export async function getActionTrackDebugInfo(
  trackId: string
): Promise<ActionTrackDebugInfo> {
  const base: ActionTrackDebugInfo = {
    trackId,
    found: false,
    settingsJsonIsObject: false,
    settingsJsonType: "undefined",
  };

  try {
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return {
        ...base,
        configError:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    const { data, error } = await supabase
      .from("action_tracks")
      .select("*")
      .eq("id", trackId)
      .maybeSingle();

    if (error) {
      return {
        ...base,
        supabaseError: {
          message: error.message,
          code: error.code ?? undefined,
          details: error.details ?? undefined,
          hint: error.hint ?? undefined,
        },
      };
    }

    if (!data) {
      return base;
    }

    const row = data as Record<string, unknown>;
    const settingsJson = row.settings_json;

    return {
      trackId,
      found: true,
      settingsJsonIsObject:
        settingsJson != null &&
        typeof settingsJson === "object" &&
        !Array.isArray(settingsJson),
      settingsJsonType:
        settingsJson == null ? "null" : typeof settingsJson,
      fields: {
        id: safeDisplay(row.id),
        title: safeDisplay(row.title),
        slug: safeDisplay(row.slug),
        status: safeDisplay(row.status),
        track_type: safeDisplay(row.track_type),
        duration_weeks: safeDisplay(row.duration_weeks),
        start_date: safeDisplay(row.start_date),
        end_date: safeDisplay(row.end_date),
        visibility: safeDisplay(row.visibility),
        created_at: safeDisplay(row.created_at),
        updated_at: safeDisplay(row.updated_at),
      },
      nullFields: {
        title: row.title == null,
        slug: row.slug == null,
        short_description: row.short_description == null,
        full_description: row.full_description == null,
        primary_outcome: row.primary_outcome == null,
        who_this_is_for: row.who_this_is_for == null,
        current_struggle: row.current_struggle == null,
        track_type: row.track_type == null,
        status: row.status == null,
        duration_weeks: row.duration_weeks == null,
        start_date: row.start_date == null,
        end_date: row.end_date == null,
        visibility: row.visibility == null,
        hero_image_url: row.hero_image_url == null,
        reward_title: row.reward_title == null,
        settings_json: row.settings_json == null,
        philosophy: row.philosophy == null,
        guide_id: row.guide_id == null,
        welcome_headline: row.welcome_headline == null,
        completion_headline: row.completion_headline == null,
      },
    };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Failed to load debug info.";
    return {
      ...base,
      configError: message,
    };
  }
}
