"use server";

import {
  createAdminClient,
  SupabaseConfigError,
  tryCreateAdminClient,
} from "@/lib/supabase/admin";
import { ActionTrackStage } from "@/lib/types/database";
import { slugify } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

export async function getStagesForTrack(trackId: string): Promise<{
  stages: ActionTrackStage[];
  error?: string;
}> {
  try {
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return {
        stages: [],
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    const { data, error } = await supabase
      .from("action_track_stages")
      .select("*")
      .eq("action_track_id", trackId)
      .order("stage_number", { ascending: true });

    if (error) {
      return { stages: [], error: error.message };
    }

    return { stages: (data ?? []) as ActionTrackStage[] };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load stages.";
    return { stages: [], error: message };
  }
}

export async function getStageById(stageId: string): Promise<{
  stage: ActionTrackStage | null;
  error?: string;
}> {
  try {
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return {
        stage: null,
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    const { data, error } = await supabase
      .from("action_track_stages")
      .select("*")
      .eq("id", stageId)
      .maybeSingle();

    if (error) {
      return { stage: null, error: error.message };
    }

    return { stage: (data as ActionTrackStage | null) ?? null };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load stage.";
    return { stage: null, error: message };
  }
}

export async function getStageBySlug(
  trackId: string,
  slug: string
): Promise<{ stage: ActionTrackStage | null; error?: string }> {
  try {
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return {
        stage: null,
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    const { data, error } = await supabase
      .from("action_track_stages")
      .select("*")
      .eq("action_track_id", trackId)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return { stage: null, error: error.message };
    }

    return { stage: (data as ActionTrackStage | null) ?? null };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load stage.";
    return { stage: null, error: message };
  }
}

export async function createStage(trackId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { data: existingStages, error: stagesError } = await supabase
    .from("action_track_stages")
    .select("stage_number")
    .eq("action_track_id", trackId)
    .order("stage_number", { ascending: false })
    .limit(1);

  if (stagesError) {
    throw new Error(stagesError.message);
  }

  const nextStageNumber = (existingStages?.[0]?.stage_number ?? 0) + 1;
  const title =
    String(formData.get("title") ?? "").trim() || `Stage ${nextStageNumber}`;
  const slug = slugify(title) || `stage-${nextStageNumber}`;

  const payload = {
    action_track_id: trackId,
    stage_number: nextStageNumber,
    slug,
    title,
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    stage_goal: String(formData.get("stage_goal") ?? "").trim() || null,
    what_youll_accomplish:
      String(formData.get("what_youll_accomplish") ?? "").trim() || null,
    next_action_title:
      String(formData.get("next_action_title") ?? "").trim() || null,
    next_action_description:
      String(formData.get("next_action_description") ?? "").trim() || null,
    is_final_stage: formData.get("is_final_stage") === "on",
  };

  const { error } = await supabase.from("action_track_stages").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/guide/tracks/${trackId}/stages`);
  revalidatePath(`/guide/tracks/${trackId}/preview`);
}

export async function updateStage(stageId: string, formData: FormData) {
  const supabase = createAdminClient();

  const trackId = String(formData.get("track_id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    throw new Error("Stage title is required.");
  }

  const payload = {
    title,
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    stage_goal: String(formData.get("stage_goal") ?? "").trim() || null,
    what_youll_accomplish:
      String(formData.get("what_youll_accomplish") ?? "").trim() || null,
    next_action_title:
      String(formData.get("next_action_title") ?? "").trim() || null,
    next_action_description:
      String(formData.get("next_action_description") ?? "").trim() || null,
    is_final_stage: formData.get("is_final_stage") === "on",
  };

  const { error } = await supabase
    .from("action_track_stages")
    .update(payload)
    .eq("id", stageId);

  if (error) {
    throw new Error(error.message);
  }

  if (trackId) {
    revalidatePath(`/guide/tracks/${trackId}/stages`);
    revalidatePath(`/guide/tracks/${trackId}/stages/${stageId}`);
    revalidatePath(`/guide/tracks/${trackId}/preview`);
  }
}
