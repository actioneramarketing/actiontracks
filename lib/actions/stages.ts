"use server";

import {
  createAdminClient,
  SupabaseConfigError,
  tryCreateAdminClient,
} from "@/lib/supabase/admin";
import { ActionTrackStage } from "@/lib/types/database";
import { slugify } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

async function generateUniqueStageSlug(
  trackId: string,
  title: string,
  fallback: string
): Promise<string> {
  const supabase = createAdminClient();
  const base = slugify(title) || fallback;

  const { data: existingSlugs, error } = await supabase
    .from("action_track_stages")
    .select("slug")
    .eq("track_id", trackId);

  if (error) {
    throw new Error(error.message);
  }

  const taken = new Set((existingSlugs ?? []).map((row) => row.slug));
  if (!taken.has(base)) {
    return base;
  }

  let candidate = `${base}-${Date.now().toString(36).slice(-4)}`;
  while (taken.has(candidate)) {
    candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }

  return candidate;
}

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
      .eq("track_id", trackId)
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
      .eq("track_id", trackId)
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

function readStageFormFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    stage_goal: String(formData.get("stage_goal") ?? "").trim() || null,
    stage_summary: String(formData.get("stage_summary") ?? "").trim() || null,
    what_youll_accomplish:
      String(formData.get("what_youll_accomplish") ?? "").trim() || null,
    next_action_title:
      String(formData.get("next_action_title") ?? "").trim() || null,
    next_action_description:
      String(formData.get("next_action_description") ?? "").trim() || null,
    unlock_type: String(formData.get("unlock_type") ?? "").trim() || null,
    is_final_stage: formData.get("is_final_stage") === "on",
  };
}

export async function createStage(trackId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { data: existingStages, error: stagesError } = await supabase
    .from("action_track_stages")
    .select("stage_number")
    .eq("track_id", trackId)
    .order("stage_number", { ascending: false })
    .limit(1);

  if (stagesError) {
    throw new Error(stagesError.message);
  }

  const nextStageNumber = (existingStages?.[0]?.stage_number ?? 0) + 1;
  const fields = readStageFormFields(formData);
  const title = fields.title || `Stage ${nextStageNumber}`;
  const slug = await generateUniqueStageSlug(
    trackId,
    title,
    `stage-${nextStageNumber}`
  );

  const payload = {
    track_id: trackId,
    stage_number: nextStageNumber,
    slug,
    title,
    subtitle: fields.subtitle,
    stage_goal: fields.stage_goal,
    stage_summary: fields.stage_summary,
    what_youll_accomplish: fields.what_youll_accomplish,
    next_action_title: fields.next_action_title,
    next_action_description: fields.next_action_description,
    unlock_type: fields.unlock_type,
    is_final_stage: fields.is_final_stage,
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
  const fields = readStageFormFields(formData);

  if (!fields.title) {
    throw new Error("Stage title is required.");
  }

  const payload = {
    title: fields.title,
    subtitle: fields.subtitle,
    stage_goal: fields.stage_goal,
    stage_summary: fields.stage_summary,
    what_youll_accomplish: fields.what_youll_accomplish,
    next_action_title: fields.next_action_title,
    next_action_description: fields.next_action_description,
    unlock_type: fields.unlock_type,
    is_final_stage: fields.is_final_stage,
    updated_at: new Date().toISOString(),
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
