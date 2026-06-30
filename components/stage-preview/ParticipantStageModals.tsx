"use client";

import { MentorEmbedPreview } from "@/components/tracks/MentorEmbedPreview";
import { StageElement } from "@/lib/types/database";
import { getAiMentorEmbedCode } from "./StageElementContent";
import { JournalEntryModal } from "./JournalEntryModal";
import type { ParticipantJournalEntryView } from "@/lib/utils/journal-entries";

export type ParticipantModalType = "ai-mentor" | "journal";

export interface JournalModalContext {
  trackId: string;
  stageId: string;
  trackSlug: string;
  stageSlug: string;
  savedEntries: ParticipantJournalEntryView[];
}

interface ParticipantStageModalsProps {
  modal: { type: ParticipantModalType; element: StageElement } | null;
  journalContext: JournalModalContext;
  onClose: () => void;
}

export function ParticipantStageModals({
  modal,
  journalContext,
  onClose,
}: ParticipantStageModalsProps) {
  if (!modal) {
    return null;
  }

  return (
    <div
      className="stage-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      {modal.type === "ai-mentor" ? (
        <div
          className="stage-modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <i className="fa-solid fa-robot text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {modal.element.title?.trim() || "AI Mentor Chat"}
                </h3>
                <p className="text-xs text-slate-500">Get instant guidance and support</p>
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
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            <MentorEmbedPreview
              embedCode={getAiMentorEmbedCode(modal.element)}
              emptyMessage="AI Mentor embed coming soon."
            />
          </div>
        </div>
      ) : (
        <JournalEntryModal
          element={modal.element}
          trackId={journalContext.trackId}
          stageId={journalContext.stageId}
          trackSlug={journalContext.trackSlug}
          stageSlug={journalContext.stageSlug}
          savedEntries={journalContext.savedEntries}
          onClose={onClose}
        />
      )}
    </div>
  );
}
