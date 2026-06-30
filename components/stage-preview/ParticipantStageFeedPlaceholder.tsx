"use client";

import { shadowSoft } from "./shared";

export function ParticipantStageFeedPlaceholder() {
  return (
    <section id="track-feed" className={`bg-white rounded-2xl p-6 ${shadowSoft} mt-8`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-1">Group Feed</h3>
        <p className="text-sm text-slate-500">
          Connect, share progress, and support others on the same journey
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-teal-100 shrink-0 flex items-center justify-center text-teal-700 text-sm font-bold">
            You
          </div>
          <div className="flex-1">
            <textarea
              disabled
              placeholder="Share your progress, ask a question, or post an update..."
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm resize-none opacity-70 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-500">Posting coming soon.</p>
          <button
            type="button"
            disabled
            className="px-5 py-2 bg-slate-200 text-slate-500 font-semibold rounded-lg cursor-not-allowed text-sm"
          >
            Post Update
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
        <p className="text-sm text-slate-500">
          Group feed posts will appear here once community features launch.
        </p>
      </div>
    </section>
  );
}
