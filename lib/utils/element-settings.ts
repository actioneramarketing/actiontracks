import { StageElementType } from "@/lib/types/database";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function checkbox(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

export function parseElementSettingsFromForm(
  elementType: StageElementType,
  formData: FormData
): Record<string, unknown> {
  switch (elementType) {
    case "live_call":
      return {
        call_type: str(formData, "call_type"),
        call_date: str(formData, "call_date"),
        start_time: str(formData, "start_time"),
        end_time: str(formData, "end_time"),
        join_url: str(formData, "join_url"),
        replay_url: str(formData, "replay_url"),
        button_text: str(formData, "button_text"),
      };
    case "commitment_builder": {
      const questions: string[] = [];
      for (let i = 0; i < 5; i++) {
        questions.push(str(formData, `question_${i}`));
      }
      return { questions };
    }
    case "task_list": {
      const tasks = [];
      for (let i = 0; i < 5; i++) {
        tasks.push({
          title: str(formData, `task_${i}_title`),
          description: str(formData, `task_${i}_description`),
          priority: str(formData, `task_${i}_priority`) || "medium",
          required: checkbox(formData, `task_${i}_required`),
        });
      }
      return { tasks };
    }
    case "ai_mentor":
      return {
        mentor_name: str(formData, "mentor_name"),
        mentor_purpose: str(formData, "mentor_purpose"),
        embed_code: str(formData, "embed_code"),
      };
    case "reflection_journal": {
      const DEFAULT_REFLECTION_PROMPT =
        "What did you learn or notice during this stage?";
      const countRaw = Number(formData.get("prompt_count") ?? 0);
      const promptCount = Number.isFinite(countRaw) ? countRaw : 0;
      const prompts: string[] = [];

      for (let i = 0; i < promptCount; i++) {
        const prompt = str(formData, `journal_prompt_${i}`);
        if (prompt) {
          prompts.push(prompt);
        }
      }

      return {
        prompts:
          prompts.length > 0 ? prompts : [DEFAULT_REFLECTION_PROMPT],
        supporting_guidance: str(formData, "supporting_guidance"),
        estimated_time: str(formData, "estimated_time"),
      };
    }
    case "resources": {
      const resources = [];
      for (let i = 0; i < 5; i++) {
        resources.push({
          title: str(formData, `resource_${i}_title`),
          type: str(formData, `resource_${i}_type`) || "link",
          url: str(formData, `resource_${i}_url`),
          description: str(formData, `resource_${i}_description`),
        });
      }
      return { resources };
    }
    case "track_feed":
      return {
        feed_prompt: str(formData, "feed_prompt"),
        allow_images: checkbox(formData, "allow_images"),
        allow_links: checkbox(formData, "allow_links"),
        allow_videos: checkbox(formData, "allow_videos"),
      };
    case "completion_submission": {
      const checklist_items: string[] = [];
      for (let i = 0; i < 5; i++) {
        checklist_items.push(str(formData, `checklist_${i}`));
      }
      return {
        submission_instructions: str(formData, "submission_instructions"),
        submission_deadline: str(formData, "submission_deadline"),
        require_url: checkbox(formData, "require_url"),
        require_notes: checkbox(formData, "require_notes"),
        button_text: str(formData, "button_text"),
        checklist_items,
      };
    }
    case "reward_activation":
      return {
        reward_name: str(formData, "reward_name"),
        reward_description: str(formData, "reward_description"),
        badge_name: str(formData, "badge_name"),
        certificate_enabled: checkbox(formData, "certificate_enabled"),
        unlock_condition: str(formData, "unlock_condition") || "after_guide_approval",
      };
    default:
      return {};
  }
}

export function asRecord(
  value: Record<string, unknown> | null | undefined
): Record<string, unknown> {
  return value ?? {};
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function asStringArray(value: unknown, length: number): string[] {
  if (!Array.isArray(value)) {
    return Array.from({ length }, () => "");
  }
  return Array.from({ length }, (_, i) => asString(value[i]));
}

export function asTaskArray(value: unknown, length: number) {
  const items = Array.isArray(value) ? value : [];
  return Array.from({ length }, (_, i) => {
    const item = items[i];
    if (item && typeof item === "object") {
      const task = item as Record<string, unknown>;
      return {
        title: asString(task.title),
        description: asString(task.description),
        priority: asString(task.priority, "medium"),
        required: asBoolean(task.required),
      };
    }
    return { title: "", description: "", priority: "medium", required: false };
  });
}

export function asResourceArray(value: unknown, length: number) {
  const items = Array.isArray(value) ? value : [];
  return Array.from({ length }, (_, i) => {
    const item = items[i];
    if (item && typeof item === "object") {
      const resource = item as Record<string, unknown>;
      return {
        title: asString(resource.title),
        type: asString(resource.type, "link"),
        url: asString(resource.url),
        description: asString(resource.description),
      };
    }
    return { title: "", type: "link", url: "", description: "" };
  });
}

const DEFAULT_REFLECTION_PROMPT =
  "What did you learn or notice during this stage?";

export function getReflectionJournalPrompts(
  settings: Record<string, unknown> | null | undefined
): string[] {
  const data = settings ?? {};

  if (Array.isArray(data.prompts)) {
    const prompts = data.prompts
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
    if (prompts.length > 0) {
      return prompts;
    }
  }

  const legacyPrompt = asString(data.prompt).trim();
  if (legacyPrompt) {
    return [legacyPrompt];
  }

  return [DEFAULT_REFLECTION_PROMPT];
}
