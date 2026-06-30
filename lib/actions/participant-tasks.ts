"use server";

import {
  getOptionalParticipantUser,
  getOrCreateParticipantKey,
} from "@/lib/participant/get-participant-key";
import {
  ActionTrackParticipantTask,
  StageElement,
} from "@/lib/types/database";
import { mapParticipantTaskRow, ParticipantTaskRowView } from "@/lib/utils/participant-tasks";
import { createAdminClient, SupabaseConfigError } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

interface TaskValidationResult {
  error?: string;
  element?: StageElement;
}

async function validateTaskListElement(
  trackId: string,
  stageId: string,
  elementId: string
): Promise<TaskValidationResult> {
  const supabase = createAdminClient();

  const { data: element, error: elementError } = await supabase
    .from("stage_elements")
    .select("*")
    .eq("id", elementId)
    .maybeSingle();

  if (elementError) {
    console.error("[participant-tasks] Element lookup failed", {
      action: "validateTaskListElement",
      trackId,
      stageId,
      elementId,
      message: elementError.message,
      code: elementError.code,
      details: elementError.details,
      hint: elementError.hint,
    });
    return { error: "Failed to validate task list element." };
  }

  if (!element) {
    return { error: "Task list element not found." };
  }

  if (element.element_type !== "task_list") {
    return { error: "This element is not a Task List." };
  }

  if (element.track_id !== trackId || element.stage_id !== stageId) {
    return { error: "Task list element does not belong to this stage." };
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

function logTaskActionError(
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

export async function getParticipantTasksForStage(
  trackId: string,
  stageId: string,
  participantKey: string | null
): Promise<{ tasks: ParticipantTaskRowView[]; error?: string }> {
  if (!participantKey) {
    return { tasks: [] };
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("action_track_participant_tasks")
      .select("*")
      .eq("track_id", trackId)
      .eq("stage_id", stageId)
      .eq("participant_key", participantKey)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) {
      logTaskActionError("getParticipantTasksForStage", { trackId, stageId }, error);
      return { tasks: [], error: "Failed to load tasks." };
    }

    const rows = (data ?? []) as ActionTrackParticipantTask[];
    return { tasks: rows.map(mapParticipantTaskRow) };
  } catch (error) {
    console.error("[getParticipantTasksForStage] Unexpected error", {
      action: "getParticipantTasksForStage",
      trackId,
      stageId,
      error,
    });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to load tasks.";
    return { tasks: [], error: message };
  }
}

export async function toggleTaskCompletion(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const trackId = String(formData.get("track_id") ?? "").trim();
  const stageId = String(formData.get("stage_id") ?? "").trim();
  const elementId = String(formData.get("element_id") ?? "").trim();
  const trackSlug = String(formData.get("track_slug") ?? "").trim();
  const stageSlug = String(formData.get("stage_slug") ?? "").trim();
  const taskSource = String(formData.get("task_source") ?? "").trim();
  const isCompleted = String(formData.get("is_completed") ?? "") === "true";

  if (!trackId || !stageId || !elementId) {
    return { error: "Missing track, stage, or element information." };
  }

  if (!trackSlug || !stageSlug) {
    return { error: "Missing page information for this task." };
  }

  if (taskSource !== "guide" && taskSource !== "participant") {
    return { error: "Invalid task source." };
  }

  try {
    const validation = await validateTaskListElement(trackId, stageId, elementId);
    if (validation.error || !validation.element) {
      return { error: validation.error ?? "Invalid task list element." };
    }

    const { participantKey } = await getOrCreateParticipantKey();
    const { participantUserId } = await getOptionalParticipantUser();
    const supabase = createAdminClient();
    const now = new Date().toISOString();
    const completedAt = isCompleted ? now : null;

    if (taskSource === "guide") {
      const guideTaskKey = String(formData.get("guide_task_key") ?? "").trim();
      const title = String(formData.get("title") ?? "").trim();
      const description = String(formData.get("description") ?? "").trim();
      const priority = String(formData.get("priority") ?? "medium").trim() || "medium";
      const dueDateRaw = String(formData.get("due_date") ?? "").trim();
      const dueDate = dueDateRaw || null;

      if (!guideTaskKey || !title) {
        return { error: "Missing guide task information." };
      }

      const { data: existing, error: selectError } = await supabase
        .from("action_track_participant_tasks")
        .select("id")
        .eq("element_id", elementId)
        .eq("participant_key", participantKey)
        .eq("guide_task_key", guideTaskKey)
        .eq("task_source", "guide")
        .maybeSingle();

      if (selectError) {
        logTaskActionError(
          "toggleTaskCompletion",
          { trackId, stageId, elementId, taskSource, guideTaskKey },
          selectError
        );
        return { error: "Failed to save task completion." };
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from("action_track_participant_tasks")
          .update({
            is_completed: isCompleted,
            completed_at: completedAt,
            updated_at: now,
          })
          .eq("id", existing.id)
          .eq("participant_key", participantKey);

        if (updateError) {
          logTaskActionError(
            "toggleTaskCompletion",
            { trackId, stageId, elementId, taskSource, guideTaskKey },
            updateError
          );
          return { error: "Failed to save task completion." };
        }
      } else {
        const { error: insertError } = await supabase
          .from("action_track_participant_tasks")
          .insert({
            track_id: trackId,
            stage_id: stageId,
            element_id: elementId,
            participant_key: participantKey,
            participant_user_id: participantUserId,
            task_source: "guide",
            guide_task_key: guideTaskKey,
            title,
            description: description || null,
            priority,
            due_date: dueDate,
            is_completed: isCompleted,
            completed_at: completedAt,
            sort_order: null,
            updated_at: now,
          });

        if (insertError) {
          logTaskActionError(
            "toggleTaskCompletion",
            { trackId, stageId, elementId, taskSource, guideTaskKey },
            insertError
          );
          return { error: "Failed to save task completion." };
        }
      }
    } else {
      const participantTaskId = String(formData.get("participant_task_id") ?? "").trim();
      if (!participantTaskId) {
        return { error: "Missing personal task information." };
      }

      const { data: existing, error: selectError } = await supabase
        .from("action_track_participant_tasks")
        .select("id")
        .eq("id", participantTaskId)
        .eq("participant_key", participantKey)
        .eq("task_source", "participant")
        .maybeSingle();

      if (selectError) {
        logTaskActionError(
          "toggleTaskCompletion",
          { trackId, stageId, elementId, taskSource, participantTaskId },
          selectError
        );
        return { error: "Failed to save task completion." };
      }

      if (!existing) {
        return { error: "Personal task not found." };
      }

      const { error: updateError } = await supabase
        .from("action_track_participant_tasks")
        .update({
          is_completed: isCompleted,
          completed_at: completedAt,
          updated_at: now,
        })
        .eq("id", participantTaskId)
        .eq("participant_key", participantKey);

      if (updateError) {
        logTaskActionError(
          "toggleTaskCompletion",
          { trackId, stageId, elementId, taskSource, participantTaskId },
          updateError
        );
        return { error: "Failed to save task completion." };
      }
    }

    revalidatePath(`/track/${trackSlug}/stages/${stageSlug}`);
    return { success: true };
  } catch (error) {
    console.error("[toggleTaskCompletion] Unexpected error", {
      action: "toggleTaskCompletion",
      trackId,
      stageId,
      elementId,
      taskSource,
      error,
    });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to save task completion.";
    return { error: message };
  }
}

export async function createParticipantTask(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const trackId = String(formData.get("track_id") ?? "").trim();
  const stageId = String(formData.get("stage_id") ?? "").trim();
  const elementId = String(formData.get("element_id") ?? "").trim();
  const trackSlug = String(formData.get("track_slug") ?? "").trim();
  const stageSlug = String(formData.get("stage_slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = String(formData.get("priority") ?? "medium").trim() || "medium";
  const dueDateRaw = String(formData.get("due_date") ?? "").trim();
  const dueDate = dueDateRaw || null;

  if (!trackId || !stageId || !elementId) {
    return { error: "Missing track, stage, or element information." };
  }

  if (!trackSlug || !stageSlug) {
    return { error: "Missing page information for this task." };
  }

  if (!title) {
    return { error: "Please enter a task title." };
  }

  try {
    const validation = await validateTaskListElement(trackId, stageId, elementId);
    if (validation.error || !validation.element) {
      return { error: validation.error ?? "Invalid task list element." };
    }

    const { participantKey } = await getOrCreateParticipantKey();
    const { participantUserId } = await getOptionalParticipantUser();
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    const { data: maxRow, error: maxError } = await supabase
      .from("action_track_participant_tasks")
      .select("sort_order")
      .eq("track_id", trackId)
      .eq("stage_id", stageId)
      .eq("element_id", elementId)
      .eq("participant_key", participantKey)
      .eq("task_source", "participant")
      .order("sort_order", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    if (maxError) {
      logTaskActionError(
        "createParticipantTask",
        { trackId, stageId, elementId, taskSource: "participant" },
        maxError
      );
      return { error: "Failed to create task." };
    }

    const nextSortOrder = (maxRow?.sort_order ?? 0) + 1;

    const { error: insertError } = await supabase
      .from("action_track_participant_tasks")
      .insert({
        track_id: trackId,
        stage_id: stageId,
        element_id: elementId,
        participant_key: participantKey,
        participant_user_id: participantUserId,
        task_source: "participant",
        guide_task_key: null,
        title,
        description: description || null,
        priority,
        due_date: dueDate,
        is_completed: false,
        completed_at: null,
        sort_order: nextSortOrder,
        updated_at: now,
      });

    if (insertError) {
      logTaskActionError(
        "createParticipantTask",
        { trackId, stageId, elementId, taskSource: "participant" },
        insertError
      );
      return { error: "Failed to create task." };
    }

    revalidatePath(`/track/${trackSlug}/stages/${stageSlug}`);
    return { success: true };
  } catch (error) {
    console.error("[createParticipantTask] Unexpected error", {
      action: "createParticipantTask",
      trackId,
      stageId,
      elementId,
      error,
    });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to create task.";
    return { error: message };
  }
}

export async function deleteParticipantTask(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const trackId = String(formData.get("track_id") ?? "").trim();
  const stageId = String(formData.get("stage_id") ?? "").trim();
  const elementId = String(formData.get("element_id") ?? "").trim();
  const trackSlug = String(formData.get("track_slug") ?? "").trim();
  const stageSlug = String(formData.get("stage_slug") ?? "").trim();
  const participantTaskId = String(formData.get("participant_task_id") ?? "").trim();

  if (!trackId || !stageId || !elementId || !participantTaskId) {
    return { error: "Missing task information." };
  }

  if (!trackSlug || !stageSlug) {
    return { error: "Missing page information for this task." };
  }

  try {
    const validation = await validateTaskListElement(trackId, stageId, elementId);
    if (validation.error) {
      return { error: validation.error };
    }

    const { participantKey } = await getOrCreateParticipantKey();
    const supabase = createAdminClient();

    const { data: existing, error: selectError } = await supabase
      .from("action_track_participant_tasks")
      .select("id")
      .eq("id", participantTaskId)
      .eq("participant_key", participantKey)
      .eq("task_source", "participant")
      .maybeSingle();

    if (selectError) {
      logTaskActionError(
        "deleteParticipantTask",
        { trackId, stageId, elementId, participantTaskId },
        selectError
      );
      return { error: "Failed to delete task." };
    }

    if (!existing) {
      return { error: "Personal task not found." };
    }

    const { error: deleteError } = await supabase
      .from("action_track_participant_tasks")
      .delete()
      .eq("id", participantTaskId)
      .eq("participant_key", participantKey);

    if (deleteError) {
      logTaskActionError(
        "deleteParticipantTask",
        { trackId, stageId, elementId, participantTaskId },
        deleteError
      );
      return { error: "Failed to delete task." };
    }

    revalidatePath(`/track/${trackSlug}/stages/${stageSlug}`);
    return { success: true };
  } catch (error) {
    console.error("[deleteParticipantTask] Unexpected error", {
      action: "deleteParticipantTask",
      trackId,
      stageId,
      elementId,
      participantTaskId,
      error,
    });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to delete task.";
    return { error: message };
  }
}
