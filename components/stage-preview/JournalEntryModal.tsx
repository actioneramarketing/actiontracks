"use client";

import { saveJournalEntries } from "@/lib/actions/journal-entries";
import { StageElement } from "@/lib/types/database";
import {
  getJournalEntriesUpdatedAt,
  getSavedEntryText,
  parseJournalPrompts,
  ParticipantJournalEntryView,
} from "@/lib/utils/journal-entries";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface JournalEntryModalProps {
  element: StageElement;
  trackId: string;
  stageId: string;
  trackSlug: string;
  stageSlug: string;
  savedEntries: ParticipantJournalEntryView[];
  onClose: () => void;
}

export function JournalEntryModal({
  element,
  trackId,
  stageId,
  trackSlug,
  stageSlug,
  savedEntries,
  onClose,
}: JournalEntryModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prompts = parseJournalPrompts(element.settings_json);
  const formKey = getJournalEntriesUpdatedAt(element.id, savedEntries);

  function handleSave(formData: FormData) {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await saveJournalEntries(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage("Journal entry saved.");
      router.refresh();
    });
  }

  return (
    <div
      className="stage-modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
      onClick={(event) => event.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
            <i className="fa-solid fa-book text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Reflection Journal</h3>
            <p className="text-xs text-slate-500">Document your journey</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      <form
        key={formKey}
        action={handleSave}
        className="flex flex-col flex-1 min-h-0"
      >
        <input type="hidden" name="track_id" value={trackId} />
        <input type="hidden" name="stage_id" value={stageId} />
        <input type="hidden" name="element_id" value={element.id} />
        <input type="hidden" name="track_slug" value={trackSlug} />
        <input type="hidden" name="stage_slug" value={stageSlug} />
        <input type="hidden" name="prompt_count" value={String(prompts.length)} />

        <div className="flex-1 overflow-y-auto p-6">
          {prompts.map((prompt, index) => (
            <div key={prompt.promptKey} className={index > 0 ? "mt-6" : ""}>
              <input
                type="hidden"
                name={`prompt_key_${index}`}
                value={prompt.promptKey}
              />
              <input
                type="hidden"
                name={`prompt_text_${index}`}
                value={prompt.promptText}
              />
              <div className="bg-pink-50 rounded-xl p-4 mb-4 border border-pink-100">
                <p className="text-sm font-semibold text-pink-900 mb-2">Prompt:</p>
                <p className="text-sm text-pink-800 italic">
                  &quot;{prompt.promptText}&quot;
                </p>
              </div>
              <textarea
                name={`entry_text_${index}`}
                defaultValue={getSavedEntryText(
                  element.id,
                  prompt.promptKey,
                  savedEntries
                )}
                placeholder="Start writing your reflection..."
                rows={8}
                disabled={isPending}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none disabled:opacity-60"
              />
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                <i className="fa-solid fa-save" />
                {isPending ? "Saving..." : "Save Entry"}
              </button>
            </div>
            {message ? <span className="text-sm text-teal-700">{message}</span> : null}
            {error ? (
              <span className="text-sm text-red-600" role="alert">
                {error}
              </span>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
