"use server";

import {
  createAdminClient,
  SupabaseConfigError,
  tryCreateAdminClient,
} from "@/lib/supabase/admin";
import {
  ELEMENT_TYPE_LABELS,
  isStageElementType,
} from "@/lib/constants/element-types";
import { StageElement, StageElementType } from "@/lib/types/database";
import { revalidatePath } from "next/cache";

export async function getElementsForStage(stageId: string): Promise<{
  elements: StageElement[];
  error?: string;
}> {
  try {
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return {
        elements: [],
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    const { data, error } = await supabase
      .from("stage_elements")
      .select("*")
      .eq("action_track_stage_id", stageId)
      .order("display_order", { ascending: true });

    if (error) {
      return { elements: [], error: error.message };
    }

    return { elements: (data ?? []) as StageElement[] };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load stage elements.";
    return { elements: [], error: message };
  }
}

export async function createStageElement(
  stageId: string,
  trackId: string,
  elementType: string
) {
  if (!isStageElementType(elementType)) {
    throw new Error("Invalid element type.");
  }

  const supabase = createAdminClient();

  const { data: existingElements, error: existingError } = await supabase
    .from("stage_elements")
    .select("display_order")
    .eq("action_track_stage_id", stageId)
    .order("display_order", { ascending: false })
    .limit(1);

  if (existingError) {
    throw new Error(existingError.message);
  }

  const nextOrder = (existingElements?.[0]?.display_order ?? 0) + 1;
  const defaultTitle = ELEMENT_TYPE_LABELS[elementType as StageElementType];

  const payload = {
    action_track_stage_id: stageId,
    action_track_id: trackId,
    element_type: elementType,
    title: defaultTitle,
    description: null,
    is_required: false,
    is_enabled: true,
    settings_json: {},
    display_order: nextOrder,
  };

  const { error } = await supabase.from("stage_elements").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/guide/tracks/${trackId}/stages/${stageId}`);
}

export async function updateStageElement(elementId: string, formData: FormData) {
  const supabase = createAdminClient();

  const trackId = String(formData.get("track_id") ?? "").trim();
  const stageId = String(formData.get("stage_id") ?? "").trim();
  const settingsRaw = String(formData.get("settings_json") ?? "").trim();

  let settingsJson: Record<string, unknown> | null = null;
  if (settingsRaw) {
    try {
      settingsJson = JSON.parse(settingsRaw) as Record<string, unknown>;
    } catch {
      throw new Error("Settings JSON must be valid JSON.");
    }
  }

  const payload = {
    title: String(formData.get("title") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    is_required: formData.get("is_required") === "on",
    is_enabled: formData.get("is_enabled") === "on",
    settings_json: settingsJson,
  };

  const { error } = await supabase
    .from("stage_elements")
    .update(payload)
    .eq("id", elementId);

  if (error) {
    throw new Error(error.message);
  }

  if (trackId && stageId) {
    revalidatePath(`/guide/tracks/${trackId}/stages/${stageId}`);
  }
}

export async function deleteStageElement(
  elementId: string,
  trackId: string,
  stageId: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("stage_elements")
    .delete()
    .eq("id", elementId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/guide/tracks/${trackId}/stages/${stageId}`);
}

export async function toggleStageElement(
  elementId: string,
  isEnabled: boolean,
  trackId: string,
  stageId: string
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("stage_elements")
    .update({ is_enabled: isEnabled })
    .eq("id", elementId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/guide/tracks/${trackId}/stages/${stageId}`);
}
