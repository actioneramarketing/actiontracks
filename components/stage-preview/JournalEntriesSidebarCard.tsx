"use client";

import { shadowSoft } from "./shared";

interface JournalEntriesSidebarCardProps {
  entryCount: number;
  onOpen: () => void;
}

export function JournalEntriesSidebarCard({
  entryCount,
  onOpen,
}: JournalEntriesSidebarCardProps) {
  const hasEntries = entryCount > 0;
  const subtitle = hasEntries
    ? "Review your saved reflections"
    : "Your saved reflections will appear here";
  const countLabel =
    entryCount === 1 ? "1 saved entry" : `${entryCount} saved entries`;

  return (
    <section
      id="sidebar-journal-entries"
      className={`bg-white rounded-2xl ${shadowSoft} p-5 border border-pink-100`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-book-open text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-md font-bold text-slate-800">Journal Entries</h3>
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            </div>
            <span className="text-xs text-slate-400 font-medium shrink-0">
              {countLabel}
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="w-full py-2.5 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-colors text-sm flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-book" />
        View Journal Entries
      </button>
    </section>
  );
}
