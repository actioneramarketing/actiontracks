"use client";

import type { StageDashboardUIHandlers } from "./shared";

interface StageDashboardModalsProps {
  handlers: StageDashboardUIHandlers;
}

export function StageDashboardModals({ handlers }: StageDashboardModalsProps) {
  const { activeModal, closeModal } = handlers;

  if (!activeModal) {
    return null;
  }

  return (
    <div
      className="stage-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={closeModal}
      role="presentation"
    >
      {activeModal === "ai-mentor" ? (
        <div
          className="stage-modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-mentor-modal-title"
        >
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <i className="fa-solid fa-robot text-lg" />
              </div>
              <div>
                <h3
                  id="ai-mentor-modal-title"
                  className="text-xl font-bold text-slate-800"
                >
                  AI Mentor Chat
                </h3>
                <p className="text-xs text-slate-500">
                  Get instant guidance and support
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 text-sm">
                  <i className="fa-solid fa-robot" />
                </div>
                <div className="flex-1 bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <p className="text-sm text-slate-700">
                    Hello! I&apos;m your AI Mentor. I&apos;m here to help you
                    brainstorm ideas, overcome obstacles, and create a clear
                    action plan. What would you like to work on today?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <i className="fa-solid fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="stage-modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="journal-modal-title"
        >
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <i className="fa-solid fa-book text-lg" />
              </div>
              <div>
                <h3
                  id="journal-modal-title"
                  className="text-xl font-bold text-slate-800"
                >
                  Reflection Journal
                </h3>
                <p className="text-xs text-slate-500">Document your journey</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-pink-50 rounded-xl p-4 mb-6 border border-pink-100">
              <p className="text-sm font-semibold text-pink-900 mb-2">
                Today&apos;s Prompt:
              </p>
              <p className="text-sm text-pink-800 italic">
                &quot;What would it feel like to complete this masterclass and
                share it with the world? What impact could it have on your
                audience?&quot;
              </p>
            </div>
            <textarea
              placeholder="Start writing your reflection..."
              rows={12}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="p-4 border-t border-slate-200 bg-white flex justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-save" />
              Save Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
