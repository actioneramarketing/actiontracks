"use server";

import {
  getOptionalParticipantUser,
  getOrCreateParticipantKey,
} from "@/lib/participant/get-participant-key";
import {
  ActionTrackJournalEntry,
  StageElement,
} from "@/lib/types/database";
import {
  mapJournalEntryRow,
  ParticipantJournalEntryView,
} from "@/lib/utils/journal-entries";
import { createAdminClient, SupabaseConfigError } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

interface JournalValidationResult {
  error?: string;
  element?: StageElement;
}

async function validateReflectionJournalElement(
  trackId: string,
  stageId: string,
  elementId: string
): Promise<JournalValidationResult> {
  const supabase = createAdminClient();

  const { data: element, error: elementError } = await supabase
    .from("stage_elements")
    .select("*")
    .eq("id", elementId)
    .maybeSingle();

  if (elementError) {
    console.error("[journal-entries] Element lookup failed", {
      action: "validateReflectionJournalElement",
      trackId,
      stageId,
      elementId,
      message: elementError.message,
      code: elementError.code,
      details: elementError.details,
      hint: elementError.hint,
    });
    return { error: "Failed to validate reflection journal element." };
  }

  if (!element) {
    return { error: "Reflection journal element not found." };
  }

  if (element.element_type !== "reflection_journal") {
    return { error: "This element is not a Reflection Journal." };
  }

  if (element.track_id !== trackId || element.stage_id !== stageId) {
    return { error: "Reflection journal element does not belong to this stage." };
  }

  const { data: trackRow } = await supabase
    .from("action_tracks")
    .select("id")
    .eq("id", trackId)
    .maybeSingle();

  if (!trackRow) {
    return { error: "Action Track not found." };
  }

  const { data: stageRow } = await supabase
    .from("action_track_stages")
    .select("id")
    .eq("id", stageId)
    .eq("track_id", trackId)
    .maybeSingle();

  if (!stageRow) {
    return { error: "Stage not found for this track." };
  }

  return { element };
}

function logJournalActionError(
  action: string,
  context: Record<string, unknown>,
  error: { message: string; code?: string; details?: string; hint?: string }
) {
  console.error(`[${action}] Supabase error`, {
    action,
    ...context,
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
}

export async function getJournalEntriesForStage(
  trackId: string,
  stageId: string,
  participantKey: string | null,
  elementIds?: string[]
): Promise<{ entries: ParticipantJournalEntryView[]; error?: string }> {
  if (!participantKey) {
    return { entries: [] };
  }

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("action_track_journal_entries")
      .select("*")
      .eq("track_id", trackId)
      .eq("stage_id", stageId)
      .eq("participant_key", participantKey)
      .order("updated_at", { ascending: true });

    if (elementIds && elementIds.length > 0) {
      query = query.in("element_id", elementIds);
    }

    const { data, error } = await query;

    if (error) {
      logJournalActionError("getJournalEntriesForStage", { trackId, stageId }, error);
      return { entries: [], error: "Failed to load journal entries." };
    }

    const rows = (data ?? []) as ActionTrackJournalEntry[];
    return { entries: rows.map(mapJournalEntryRow) };
  } catch (error) {
    console.error("[getJournalEntriesForStage] Unexpected error", {
      action: "getJournalEntriesForStage",
      trackId,
      stageId,
      error,
    });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load journal entries.";
    return { entries: [], error: message };
  }
}

export async function saveJournalEntries(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const trackId = String(formData.get("track_id") ?? "").trim();
  const stageId = String(formData.get("stage_id") ?? "").trim();
  const elementId = String(formData.get("element_id") ?? "").trim();
  const trackSlug = String(formData.get("track_slug") ?? "").trim();
  const stageSlug = String(formData.get("stage_slug") ?? "").trim();
  const promptCountRaw = Number(formData.get("prompt_count") ?? 0);

  if (!trackId || !stageId || !elementId) {
    return { error: "Missing track, stage, or element information." };
  }

  if (!trackSlug || !stageSlug) {
    return { error: "Missing page information for this journal entry." };
  }

  if (!Number.isFinite(promptCountRaw) || promptCountRaw < 1) {
    return { error: "Missing journal prompt information." };
  }

  try {
    const validation = await validateReflectionJournalElement(
      trackId,
      stageId,
      elementId
    );
    if (validation.error || !validation.element) {
      return { error: validation.error ?? "Invalid reflection journal element." };
    }

    const { participantKey } = await getOrCreateParticipantKey();
    const { participantUserId } = await getOptionalParticipantUser();
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    for (let index = 0; index < promptCountRaw; index++) {
      const promptKey = String(formData.get(`prompt_key_${index}`) ?? "").trim();
      const promptText = String(formData.get(`prompt_text_${index}`) ?? "").trim();
      const entryText = String(formData.get(`entry_text_${index}`) ?? "");

      if (!promptKey || !promptText) {
        return { error: "Missing journal prompt information." };
      }

      const { data: existing, error: selectError } = await supabase
        .from("action_track_journal_entries")
        .select("id")
        .eq("element_id", elementId)
        .eq("participant_key", participantKey)
        .eq("prompt_key", promptKey)
        .maybeSingle();

      if (selectError) {
        logJournalActionError(
          "saveJournalEntries",
          { trackId, stageId, elementId, promptKey },
          selectError
        );
        return { error: "Failed to save journal entry." };
      }

      const payload = {
        track_id: trackId,
        stage_id: stageId,
        element_id: elementId,
        participant_key: participantKey,
        participant_user_id: participantUserId,
        prompt_key: promptKey,
        prompt_text: promptText,
        entry_text: entryText,
        status: "saved",
        updated_at: now,
      };

      if (existing) {
        const { error: updateError } = await supabase
          .from("action_track_journal_entries")
          .update({
            prompt_text: promptText,
            entry_text: entryText,
            status: "saved",
            participant_user_id: participantUserId,
            updated_at: now,
          })
          .eq("id", existing.id)
          .eq("participant_key", participantKey);

        if (updateError) {
          logJournalActionError(
            "saveJournalEntries",
            { trackId, stageId, elementId, promptKey },
            updateError
          );
          return { error: "Failed to save journal entry." };
        }
      } else {
        const { error: insertError } = await supabase
          .from("action_track_journal_entries")
          .insert(payload);

        if (insertError) {
          logJournalActionError(
            "saveJournalEntries",
            { trackId, stageId, elementId, promptKey },
            insertError
          );
          return { error: "Failed to save journal entry." };
        }
      }
    }

    revalidatePath(`/track/${trackSlug}/stages/${stageSlug}`);
    return { success: true };
  } catch (error) {
    console.error("[saveJournalEntries] Unexpected error", {
      action: "saveJournalEntries",
      trackId,
      stageId,
      elementId,
      error,
    });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to save journal entry.";
    return { error: message };
  }
}
