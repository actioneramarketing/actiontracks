"use client";

import { MentorEmbedPreview } from "@/components/tracks/MentorEmbedPreview";
import { StageElement } from "@/lib/types/database";
import { getAiMentorEmbedCode, getJournalPrompts } from "./StageElementContent";

export type ParticipantModalType = "ai-mentor" | "journal";

interface ParticipantStageModalsProps {
  modal: { type: ParticipantModalType; element: StageElement } | null;
  onClose: () => void;
}

export function ParticipantStageModals({ modal, onClose }: ParticipantStageModalsProps) {
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
        <div
          className="stage-modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
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
          <div className="flex-1 overflow-y-auto p-6">
            {getJournalPrompts(modal.element).map((prompt, index) => (
              <div key={index} className={index > 0 ? "mt-6" : ""}>
                <div className="bg-pink-50 rounded-xl p-4 mb-4 border border-pink-100">
                  <p className="text-sm font-semibold text-pink-900 mb-2">Prompt:</p>
                  <p className="text-sm text-pink-800 italic">&quot;{prompt}&quot;</p>
                </div>
                <textarea
                  readOnly
                  placeholder="Start writing your reflection..."
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                />
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 bg-white flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled
              className="px-6 py-3 bg-pink-600/60 text-white font-semibold rounded-xl cursor-not-allowed flex items-center gap-2"
            >
              <i className="fa-solid fa-save" /> Save Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
