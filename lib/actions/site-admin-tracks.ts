"use server";

import { getFirstStagesForTracks } from "@/lib/actions/stages";
import { tryCreateAdminClient } from "@/lib/supabase/admin";
import { TrackStatus } from "@/lib/types/database";
import {
  buildAppUrl,
  buildTrackJoinPath,
  buildTrackPreviewPath,
} from "@/lib/utils/app-url";
import { normalizeActionTrack } from "@/lib/utils/normalize-action-track";

export interface SiteAdminTrackView {
  id: string;
  title: string;
  slug: string;
  status: TrackStatus;
  visibility: string;
  trackImageUrl: string;
  trackIconUrl: string;
  guideName: string;
  guideEmail: string;
  stageCount: number;
  joinPath: string;
  joinUrl: string;
  previewPath: string | null;
  previewUrl: string | null;
}

export async function getActionTracksForSiteAdmin(): Promise<{
  tracks: SiteAdminTrackView[];
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

    const { data: trackRows, error: tracksError } = await supabase
      .from("action_tracks")
      .select("*")
      .order("created_at", { ascending: false });

    if (tracksError) {
      console.error("[getActionTracksForSiteAdmin] Track query failed", {
        message: tracksError.message,
        code: tracksError.code,
      });
      return { tracks: [], error: "Failed to load Action Tracks." };
    }

    const tracks = (trackRows ?? [])
      .map((row) => normalizeActionTrack(row))
      .filter((track): track is NonNullable<typeof track> => track != null);

    if (tracks.length === 0) {
      return { tracks: [] };
    }

    const trackIds = tracks.map((track) => track.id);
    const guideIds = [
      ...new Set(tracks.map((track) => track.guide_id).filter(Boolean)),
    ];

    const [{ data: guideRows, error: guidesError }, firstStagesResult, stageRowsResult] =
      await Promise.all([
        guideIds.length > 0
          ? supabase
              .from("action_track_guides")
              .select("id, full_name, email")
              .in("id", guideIds)
          : Promise.resolve({ data: [], error: null }),
        getFirstStagesForTracks(trackIds),
        supabase
          .from("action_track_stages")
          .select("track_id")
          .in("track_id", trackIds),
      ]);

    if (guidesError) {
      console.error("[getActionTracksForSiteAdmin] Guide query failed", {
        message: guidesError.message,
        code: guidesError.code,
      });
    }

    if (stageRowsResult.error) {
      console.error("[getActionTracksForSiteAdmin] Stage count query failed", {
        message: stageRowsResult.error.message,
        code: stageRowsResult.error.code,
      });
    }

    const guidesById = new Map<string, { name: string; email: string }>();
    for (const row of guideRows ?? []) {
      const id = String(row.id ?? "").trim();
      if (!id) {
        continue;
      }
      guidesById.set(id, {
        name: String(row.full_name ?? "").trim() || "Guide",
        email: String(row.email ?? "").trim(),
      });
    }

    const stageCountByTrackId = new Map<string, number>();
    for (const row of stageRowsResult.data ?? []) {
      const trackId = String(row.track_id ?? "").trim();
      if (!trackId) {
        continue;
      }
      stageCountByTrackId.set(trackId, (stageCountByTrackId.get(trackId) ?? 0) + 1);
    }

    const views: SiteAdminTrackView[] = tracks.map((track) => {
      const guide = guidesById.get(track.guide_id);
      const joinPath = buildTrackJoinPath(track.slug);
      const firstStageSlug = firstStagesResult.firstStagesByTrackId[track.id]?.slug ?? null;
      const previewPath =
        track.slug.trim() && firstStageSlug
          ? buildTrackPreviewPath(track.slug, firstStageSlug)
          : null;

      return {
        id: track.id,
        title: track.title,
        slug: track.slug,
        status: track.status,
        visibility: track.visibility,
        trackImageUrl: track.track_image_url,
        trackIconUrl: track.track_icon_url,
        guideName: guide?.name || "Guide",
        guideEmail: guide?.email || "",
        stageCount: stageCountByTrackId.get(track.id) ?? 0,
        joinPath,
        joinUrl: buildAppUrl(joinPath),
        previewPath,
        previewUrl: previewPath ? buildAppUrl(previewPath) : null,
      };
    });

    return {
      tracks: views,
      error:
        firstStagesResult.error || stageRowsResult.error
          ? "Some track details could not be loaded."
          : undefined,
    };
  } catch (error) {
    console.error("[getActionTracksForSiteAdmin] Unexpected error", { error });
    return { tracks: [], error: "Failed to load Action Tracks." };
  }
}
