import { slugify } from "@/lib/utils/slug";
import { asString } from "@/lib/utils/element-settings";

const DEFAULT_REFLECTION_PROMPT =
  "What did you learn or notice during this stage?";

export interface JournalPromptDefinition {
  promptKey: string;
  promptText: string;
}

export interface ParticipantJournalEntryView {
  id: string;
  elementId: string;
  promptKey: string;
  promptText: string;
  entryText: string;
  updatedAt: string;
}

export function buildPromptKey(index: number, promptText: string, raw?: Record<string, unknown>): string {
  const id = raw ? asString(raw.id).trim() : "";
  if (id) {
    return id;
  }
  const key = raw ? asString(raw.key).trim() : "";
  if (key) {
    return key;
  }
  const slug = slugify(promptText.slice(0, 48)) || "prompt";
  return `prompt-${index}-${slug}`;
}

export function parseJournalPrompts(
  settings: Record<string, unknown> | null | undefined
): JournalPromptDefinition[] {
  const data = settings ?? {};
  const prompts: JournalPromptDefinition[] = [];

  if (Array.isArray(data.prompts)) {
    for (let index = 0; index < data.prompts.length; index++) {
      const item = data.prompts[index];
      if (typeof item === "string") {
        const promptText = item.trim();
        if (promptText) {
          prompts.push({
            promptKey: buildPromptKey(index, promptText),
            promptText,
          });
        }
        continue;
      }

      if (item && typeof item === "object") {
        const raw = item as Record<string, unknown>;
        const promptText = asString(raw.text || raw.prompt || raw.title).trim();
        if (promptText) {
          prompts.push({
            promptKey: buildPromptKey(index, promptText, raw),
            promptText,
          });
        }
      }
    }
  }

  if (prompts.length > 0) {
    return prompts;
  }

  const legacyPrompt = asString(data.prompt).trim();
  if (legacyPrompt) {
    return [{ promptKey: buildPromptKey(0, legacyPrompt), promptText: legacyPrompt }];
  }

  return [
    {
      promptKey: buildPromptKey(0, DEFAULT_REFLECTION_PROMPT),
      promptText: DEFAULT_REFLECTION_PROMPT,
    },
  ];
}

export function mapJournalEntryRow(raw: {
  id: string;
  element_id: string;
  prompt_key: string;
  prompt_text: string;
  entry_text: string | null;
  updated_at: string;
}): ParticipantJournalEntryView {
  return {
    id: raw.id,
    elementId: raw.element_id,
    promptKey: raw.prompt_key,
    promptText: raw.prompt_text,
    entryText: raw.entry_text ?? "",
    updatedAt: raw.updated_at,
  };
}

export function getJournalEntriesForElement(
  elementId: string,
  entries: ParticipantJournalEntryView[]
): ParticipantJournalEntryView[] {
  return entries.filter((entry) => entry.elementId === elementId);
}

export function getSavedEntryText(
  elementId: string,
  promptKey: string,
  entries: ParticipantJournalEntryView[]
): string {
  return (
    entries.find(
      (entry) => entry.elementId === elementId && entry.promptKey === promptKey
    )?.entryText ?? ""
  );
}

export function hasSavedJournalEntries(
  elementId: string,
  entries: ParticipantJournalEntryView[]
): boolean {
  return getJournalEntriesForElement(elementId, entries).length > 0;
}

export function getJournalEntriesUpdatedAt(
  elementId: string,
  entries: ParticipantJournalEntryView[]
): string {
  const elementEntries = getJournalEntriesForElement(elementId, entries);
  if (elementEntries.length === 0) {
    return "new";
  }
  return elementEntries
    .map((entry) => entry.updatedAt)
    .sort()
    .join("-");
}
