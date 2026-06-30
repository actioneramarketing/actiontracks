"use client";

import { StageElement } from "@/lib/types/database";
import { asRecord, asString } from "@/lib/utils/element-settings";
import {
  hasSavedJournalEntries,
  parseJournalPrompts,
  ParticipantJournalEntryView,
} from "@/lib/utils/journal-entries";

interface ReflectionJournalElementProps {
  element: StageElement;
  onOpen: () => void;
}

export function ReflectionJournalElement({
  element,
  onOpen,
}: ReflectionJournalElementProps) {
  const settings = asRecord(element.settings_json);
  const prompts = parseJournalPrompts(settings);
  const time = asString(settings.estimated_time);

  return (
    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
      <div className="bg-pink-50 rounded-xl p-4 mb-4 border border-pink-100">
        <p className="text-sm font-semibold text-pink-900 mb-2">Today&apos;s Prompt:</p>
        <p className="text-sm text-pink-800 italic">&quot;{prompts[0]?.promptText}&quot;</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-3">
        {time ? (
          <span className="flex items-center gap-1">
            <i className="fa-regular fa-clock" /> {time}
          </span>
        ) : null}
      </div>
      {element.description ? (
        <p className="text-sm text-slate-600 mb-4">{element.description}</p>
      ) : null}
      <button
        type="button"
        onClick={onOpen}
        className="w-full sm:w-auto px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-pen-to-square" /> Open Full Journal
      </button>
    </div>
  );
}

export function getReflectionJournalStatusLabel(
  elementId: string,
  savedEntries: ParticipantJournalEntryView[]
): "Saved" | "Not Started" {
  return hasSavedJournalEntries(elementId, savedEntries) ? "Saved" : "Not Started";
}
