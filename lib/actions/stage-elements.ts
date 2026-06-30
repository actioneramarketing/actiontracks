"use server";

import {
  createAdminClient,
  SupabaseConfigError,
  tryCreateAdminClient,
} from "@/lib/supabase/admin";
import { getElementDefaults } from "@/lib/constants/element-defaults";
import {
  filterBuilderVisibleElements,
  isAddableStageElementType,
  isStageElementType,
} from "@/lib/constants/element-types";
import { StageElement, StageElementType } from "@/lib/types/database";
import { parseElementSettingsFromForm } from "@/lib/utils/element-settings";
import { revalidatePath } from "next/cache";

function revalidateStageElementPaths(trackId: string, stageId: string) {
  revalidatePath(`/guide/tracks/${trackId}/stages/${stageId}`);
  revalidatePath(`/guide/tracks/${trackId}/stages`);
}

async function loadOrderedElementsForStage(stageId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("stage_elements")
    .select("*")
    .eq("stage_id", stageId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as StageElement[];
}

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
      .eq("stage_id", stageId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

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

export async function getEnabledElementsForTrack(trackId: string): Promise<{
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
      .eq("track_id", trackId)
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      return { elements: [], error: error.message };
    }

    return { elements: (data ?? []) as StageElement[] };
  } catch (error) {
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load track elements.";
    return { elements: [], error: message };
  }
}

export async function createStageElement(
  stageId: string,
  trackId: string,
  elementType: string
): Promise<string> {
  if (elementType === "track_feed") {
    throw new Error(
      "Track Feed is included automatically on every stage and cannot be added as an element."
    );
  }

  if (!isAddableStageElementType(elementType)) {
    throw new Error("Invalid element type.");
  }

  const supabase = createAdminClient();
  const type = elementType;
  const defaults = getElementDefaults(type);

  const { data: existingElements, error: existingError } = await supabase
    .from("stage_elements")
    .select("sort_order")
    .eq("stage_id", stageId)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (existingError) {
    throw new Error(existingError.message);
  }

  const nextOrder =
    existingElements && existingElements.length > 0
      ? (existingElements[0].sort_order ?? 0) + 1
      : 1;

  const payload = {
    stage_id: stageId,
    track_id: trackId,
    element_type: elementType,
    title: defaults.title,
    description: defaults.description,
    is_required: false,
    is_enabled: true,
    settings_json: defaults.settings_json,
    sort_order: nextOrder,
  };

  const { data, error } = await supabase
    .from("stage_elements")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateStageElementPaths(trackId, stageId);
  return data.id;
}

export async function updateStageElement(elementId: string, formData: FormData) {
  const supabase = createAdminClient();

  const trackId = String(formData.get("track_id") ?? "").trim();
  const stageId = String(formData.get("stage_id") ?? "").trim();
  const elementTypeRaw = String(formData.get("element_type") ?? "").trim();

  if (!isStageElementType(elementTypeRaw)) {
    throw new Error("Invalid element type.");
  }

  const elementType = elementTypeRaw as StageElementType;
  const settingsJson = parseElementSettingsFromForm(elementType, formData);

  const payload = {
    title: String(formData.get("title") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    is_required: formData.get("is_required") === "on",
    is_enabled: formData.get("is_enabled") === "on",
    settings_json: settingsJson,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("stage_elements")
    .update(payload)
    .eq("id", elementId);

  if (error) {
    throw new Error(error.message);
  }

  if (trackId && stageId) {
    revalidateStageElementPaths(trackId, stageId);
  }
}

export async function deleteStageElement(elementId: string) {
  const supabase = createAdminClient();

  const { data: element, error: fetchError } = await supabase
    .from("stage_elements")
    .select("stage_id, track_id")
    .eq("id", elementId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const { error } = await supabase
    .from("stage_elements")
    .delete()
    .eq("id", elementId);

  if (error) {
    throw new Error(error.message);
  }

  if (element?.track_id && element?.stage_id) {
    revalidateStageElementPaths(element.track_id, element.stage_id);
  }
}

export async function toggleStageElement(elementId: string, isEnabled: boolean) {
  const supabase = createAdminClient();

  const { data: element, error: fetchError } = await supabase
    .from("stage_elements")
    .select("stage_id, track_id")
    .eq("id", elementId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const { error } = await supabase
    .from("stage_elements")
    .update({
      is_enabled: isEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq("id", elementId);

  if (error) {
    throw new Error(error.message);
  }

  if (element?.track_id && element?.stage_id) {
    revalidateStageElementPaths(element.track_id, element.stage_id);
  }
}

export async function moveStageElement(
  elementId: string,
  direction: "up" | "down"
) {
  const supabase = createAdminClient();

  const { data: current, error: currentError } = await supabase
    .from("stage_elements")
    .select("id, stage_id, track_id")
    .eq("id", elementId)
    .maybeSingle();

  if (currentError) {
    throw new Error(currentError.message);
  }

  if (!current) {
    throw new Error("Element not found.");
  }

  const elements = filterBuilderVisibleElements(
    await loadOrderedElementsForStage(current.stage_id)
  );
  const currentIndex = elements.findIndex((element) => element.id === elementId);

  if (currentIndex === -1) {
    throw new Error("Element not found in stage.");
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= elements.length) {
    throw new Error(`Cannot move element ${direction}.`);
  }

  const reordered = [...elements];
  const [moved] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, moved);

  const updates = reordered.map((element, index) =>
    supabase
      .from("stage_elements")
      .update({
        sort_order: index + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", element.id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    throw new Error(failed.error.message);
  }

  revalidateStageElementPaths(current.track_id, current.stage_id);
}
