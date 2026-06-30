"use server";

import {
  createAdminClient,
  SupabaseConfigError,
  tryCreateAdminClient,
} from "@/lib/supabase/admin";
import { ActionTrackCommitment } from "@/lib/types/database";
import {
  buildCommitmentAnswersJson,
  buildCommitmentSummary,
  parseCommitmentAnswersJson,
  ParticipantCommitmentView,
} from "@/lib/utils/commitment";
import { asRecord, asStringArray } from "@/lib/utils/element-settings";
import {
  getOptionalParticipantUser,
  getOrCreateParticipantKey,
} from "@/lib/participant/get-participant-key";
import { revalidatePath } from "next/cache";

function mapCommitmentRow(row: ActionTrackCommitment): ParticipantCommitmentView {
  return {
    elementId: row.element_id,
    answers: parseCommitmentAnswersJson(row.answers_json),
    commitmentSummary: row.commitment_summary,
    updatedAt: row.updated_at,
  };
}

export async function getCommitmentsForStage(
  stageId: string,
  participantKey: string | null,
  elementIds?: string[]
): Promise<{
  commitments: ParticipantCommitmentView[];
  error?: string;
}> {
  if (!participantKey) {
    return { commitments: [] };
  }

  try {
    const supabase = tryCreateAdminClient();
    if (!supabase) {
      return {
        commitments: [],
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      };
    }

    let query = supabase
      .from("action_track_commitments")
      .select("*")
      .eq("stage_id", stageId)
      .eq("participant_key", participantKey);

    if (elementIds && elementIds.length > 0) {
      query = query.in("element_id", elementIds);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[getCommitmentsForStage] Supabase query failed", {
        action: "getCommitmentsForStage",
        stageId,
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return { commitments: [], error: error.message };
    }

    return {
      commitments: ((data ?? []) as ActionTrackCommitment[]).map(mapCommitmentRow),
    };
  } catch (error) {
    console.error("[getCommitmentsForStage] Unexpected error", {
      action: "getCommitmentsForStage",
      stageId,
      error,
    });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load commitments.";
    return { commitments: [], error: message };
  }
}

export async function saveCommitment(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const trackId = String(formData.get("track_id") ?? "").trim();
  const stageId = String(formData.get("stage_id") ?? "").trim();
  const elementId = String(formData.get("element_id") ?? "").trim();
  const trackSlug = String(formData.get("track_slug") ?? "").trim();
  const stageSlug = String(formData.get("stage_slug") ?? "").trim();
  const questionCountRaw = Number(formData.get("question_count") ?? 0);

  if (!trackId || !stageId || !elementId) {
    return { error: "Missing track, stage, or element information." };
  }

  if (!trackSlug || !stageSlug) {
    return { error: "Missing page information for this commitment." };
  }

  try {
    const supabase = createAdminClient();

    const { data: element, error: elementError } = await supabase
      .from("stage_elements")
      .select("*")
      .eq("id", elementId)
      .maybeSingle();

    if (elementError) {
      console.error("[saveCommitment] Element lookup failed", {
        action: "saveCommitment",
        trackId,
        stageId,
        elementId,
        message: elementError.message,
        code: elementError.code,
        details: elementError.details,
        hint: elementError.hint,
      });
      return { error: "Failed to validate commitment element." };
    }

    if (!element) {
      return { error: "Commitment element not found." };
    }

    if (element.element_type !== "commitment_builder") {
      return { error: "This element is not a Commitment Builder." };
    }

    if (element.track_id !== trackId || element.stage_id !== stageId) {
      return { error: "Commitment element does not belong to this stage." };
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

    const settings = asRecord(element.settings_json);
    const questions = asStringArray(settings.questions, 10).filter(Boolean);

    if (questions.length === 0) {
      return { error: "No commitment questions are configured for this element." };
    }

    const questionCount = Number.isFinite(questionCountRaw)
      ? questionCountRaw
      : questions.length;
    const answerValues: string[] = [];

    for (let index = 0; index < questionCount; index++) {
      answerValues.push(String(formData.get(`answer_${index}`) ?? "").trim());
    }

    while (answerValues.length < questions.length) {
      answerValues.push("");
    }

    const answersJson = buildCommitmentAnswersJson(questions, answerValues);
    const commitmentSummary = buildCommitmentSummary(questions, answerValues);

    const { participantKey } = await getOrCreateParticipantKey();
    const { participantUserId, participantEmail } = await getOptionalParticipantUser();

    const now = new Date().toISOString();
    const payload = {
      track_id: trackId,
      stage_id: stageId,
      element_id: elementId,
      participant_key: participantKey,
      participant_user_id: participantUserId,
      participant_email: participantEmail,
      answers_json: answersJson,
      commitment_summary: commitmentSummary,
      status: "submitted",
      updated_at: now,
    };

    const { error: upsertError } = await supabase
      .from("action_track_commitments")
      .upsert(payload, { onConflict: "element_id,participant_key" });

    if (upsertError) {
      console.error("[saveCommitment] Supabase upsert failed", {
        action: "saveCommitment",
        trackId,
        stageId,
        elementId,
        message: upsertError.message,
        code: upsertError.code,
        details: upsertError.details,
        hint: upsertError.hint,
      });
      return { error: "Failed to save commitment. Please try again." };
    }

    revalidatePath(`/track/${trackSlug}/stages/${stageSlug}`);
    return { success: true };
  } catch (error) {
    console.error("[saveCommitment] Unexpected error", {
      action: "saveCommitment",
      trackId,
      stageId,
      elementId,
      error,
    });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to save commitment. Please try again.";
    return { error: message };
  }
}
