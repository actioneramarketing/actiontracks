"use client";

import { JournalEntryReviewItem, formatJournalUpdatedAt } from "@/lib/utils/journal-entries";

interface JournalEntriesReviewModalProps {
  entries: JournalEntryReviewItem[];
  onClose: () => void;
}

function ReviewEntryCard({ entry }: { entry: JournalEntryReviewItem }) {
  const updatedLabel = formatJournalUpdatedAt(entry.updatedAt);

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-bold text-slate-800">
          Stage {entry.stageNumber}: {entry.stageTitle}
        </p>
        {entry.elementTitle ? (
          <p className="text-xs font-semibold text-pink-700">{entry.elementTitle}</p>
        ) : null}
        {updatedLabel ? (
          <p className="text-xs text-slate-400">Last saved {updatedLabel}</p>
        ) : null}
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Prompt
        </p>
        <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
          <p className="text-sm text-pink-900 italic">&quot;{entry.promptText}&quot;</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Your Answer
        </p>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {entry.entryText.trim() || "No answer saved."}
          </p>
        </div>
      </div>
    </article>
  );
}

export function JournalEntriesReviewModal({
  entries,
  onClose,
}: JournalEntriesReviewModalProps) {
  return (
    <div
      className="stage-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="stage-modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="journal-review-title"
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-book text-lg" />
            </div>
            <div className="min-w-0">
              <h3 id="journal-review-title" className="text-xl font-bold text-slate-800">
                My Journal Entries
              </h3>
              <p className="text-xs text-slate-500">
                Review the reflections you&apos;ve saved throughout this Action Track.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none shrink-0"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {entries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">
                You haven&apos;t saved any journal entries yet. When you write and save
                reflections from a stage, they&apos;ll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {entries.map((entry) => (
                <ReviewEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
