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

function revalidateTrackStagePaths(trackId: string, stageId?: string) {
  revalidatePath(`/guide/tracks/${trackId}/stages`);
  revalidatePath(`/guide/tracks/${trackId}/preview`);
  revalidatePath(`/guide/tracks/${trackId}/edit`);
  if (stageId) {
    revalidatePath(`/guide/tracks/${trackId}/stages/${stageId}`);
  }
}

async function loadOrderedStagesForTrack(
  trackId: string,
  supabase = createAdminClient()
): Promise<ActionTrackStage[]> {
  const { data, error } = await supabase
    .from("action_track_stages")
    .select("*")
    .eq("track_id", trackId)
    .order("stage_number", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ActionTrackStage[];
}

export async function renumberStages(trackId: string): Promise<void> {
  const supabase = createAdminClient();
  const stages = await loadOrderedStagesForTrack(trackId, supabase);

  for (let index = 0; index < stages.length; index++) {
    const expectedNumber = index + 1;
    if (stages[index].stage_number === expectedNumber) {
      continue;
    }

    const { error } = await supabase
      .from("action_track_stages")
      .update({
        stage_number: expectedNumber,
        updated_at: new Date().toISOString(),
      })
      .eq("id", stages[index].id);

    if (error) {
      throw new Error(error.message);
    }
  }
}

export async function moveStage(
  stageId: string,
  direction: "up" | "down"
): Promise<{ error?: string }> {
  try {
    const supabase = createAdminClient();

    const { data: currentStage, error: loadError } = await supabase
      .from("action_track_stages")
      .select("*")
      .eq("id", stageId)
      .maybeSingle();

    if (loadError) {
      console.error("[moveStage] Failed to load stage", {
        stageId,
        direction,
        message: loadError.message,
        code: loadError.code,
      });
      return { error: "Failed to move stage. Please try again." };
    }

    if (!currentStage) {
      return { error: "Stage not found." };
    }

    const trackId = currentStage.track_id as string;
    const stages = await loadOrderedStagesForTrack(trackId, supabase);
    const index = stages.findIndex((stage) => stage.id === stageId);

    if (index === -1) {
      return { error: "Stage not found." };
    }

    if (direction === "up" && index === 0) {
      return { error: "This stage is already first." };
    }

    if (direction === "down" && index === stages.length - 1) {
      return { error: "This stage is already last." };
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const movingStage = stages[index];
    const adjacentStage = stages[swapIndex];
    const movingNumber = movingStage.stage_number;
    const adjacentNumber = adjacentStage.stage_number;
    const updatedAt = new Date().toISOString();

    const { error: firstUpdateError } = await supabase
      .from("action_track_stages")
      .update({ stage_number: adjacentNumber, updated_at: updatedAt })
      .eq("id", movingStage.id);

    if (firstUpdateError) {
      console.error("[moveStage] Supabase update failed", {
        stageId,
        direction,
        message: firstUpdateError.message,
        code: firstUpdateError.code,
      });
      return { error: "Failed to move stage. Please try again." };
    }

    const { error: secondUpdateError } = await supabase
      .from("action_track_stages")
      .update({ stage_number: movingNumber, updated_at: updatedAt })
      .eq("id", adjacentStage.id);

    if (secondUpdateError) {
      console.error("[moveStage] Supabase swap rollback needed", {
        stageId,
        direction,
        message: secondUpdateError.message,
        code: secondUpdateError.code,
      });
      await supabase
        .from("action_track_stages")
        .update({ stage_number: movingNumber, updated_at: updatedAt })
        .eq("id", movingStage.id);
      return { error: "Failed to move stage. Please try again." };
    }

    revalidateTrackStagePaths(trackId, stageId);
    return {};
  } catch (error) {
    console.error("[moveStage] Unexpected error", { stageId, direction, error });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to move stage. Please try again.";
    return { error: message };
  }
}

export async function deleteStage(
  stageId: string
): Promise<{ error?: string }> {
  try {
    const supabase = createAdminClient();

    const { data: stage, error: loadError } = await supabase
      .from("action_track_stages")
      .select("id, track_id")
      .eq("id", stageId)
      .maybeSingle();

    if (loadError) {
      console.error("[deleteStage] Failed to load stage", {
        stageId,
        message: loadError.message,
        code: loadError.code,
      });
      return { error: "Failed to delete stage. Please try again." };
    }

    if (!stage) {
      return { error: "Stage not found." };
    }

    const trackId = stage.track_id as string;

    const { error: deleteStageError } = await supabase
      .from("action_track_stages")
      .delete()
      .eq("id", stageId);

    if (deleteStageError) {
      console.error("[deleteStage] Stage delete failed, trying elements first", {
        stageId,
        message: deleteStageError.message,
        code: deleteStageError.code,
      });

      const { error: deleteElementsError } = await supabase
        .from("stage_elements")
        .delete()
        .eq("stage_id", stageId);

      if (deleteElementsError) {
        console.error("[deleteStage] Failed to delete stage elements", {
          stageId,
          message: deleteElementsError.message,
          code: deleteElementsError.code,
        });
        return { error: "Failed to delete stage. Please try again." };
      }

      const { error: retryDeleteError } = await supabase
        .from("action_track_stages")
        .delete()
        .eq("id", stageId);

      if (retryDeleteError) {
        console.error("[deleteStage] Stage delete retry failed", {
          stageId,
          message: retryDeleteError.message,
          code: retryDeleteError.code,
        });
        return { error: "Failed to delete stage. Please try again." };
      }
    }

    await renumberStages(trackId);
    revalidateTrackStagePaths(trackId);
    return {};
  } catch (error) {
    console.error("[deleteStage] Unexpected error", { stageId, error });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to delete stage. Please try again.";
    return { error: message };
  }
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
      .order("stage_number", { ascending: true })
      .order("created_at", { ascending: true });

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
  revalidatePath(`/guide/tracks/${trackId}/edit`);
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
