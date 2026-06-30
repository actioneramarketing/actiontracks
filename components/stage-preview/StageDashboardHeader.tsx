"use client";

import { shadowSoft } from "./shared";

export function StageDashboardHeader() {
  return (
    <>
      <div id="page-title" className="pt-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-800">
          Stage 1: Define Your Topic &amp; Commit to the Journey
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete all actions to unlock Stage 2
        </p>
      </div>

      <section id="stage-header" className={`bg-white rounded-2xl p-6 sm:p-8 ${shadowSoft}`}>
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100 mb-4">
              <i className="fa-solid fa-flag" /> Stage 1 of 6
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              What You&apos;ll Accomplish
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              By the end of this stage, you will have a crystal-clear topic, a personal
              commitment, and the accountability structure to ensure you finish what you
              start.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Stage Progress</span>
                <span className="text-sm font-bold text-[#0d9488]">
                  0 of 8 actions complete
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#14b8a6] to-[#0d9488] h-full rounded-full transition-all duration-500"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-auto shrink-0">
            <button
              type="button"
              disabled
              className="w-full lg:w-auto px-8 py-4 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border-2 border-slate-200"
            >
              <i className="fa-solid fa-lock" /> Mark Stage Complete
            </button>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Complete all actions to unlock
            </p>
          </div>
        </div>
      </section>

      <section
        id="start-here-card"
        className={`bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-2xl p-8 ${shadowSoft} text-white relative overflow-hidden h-52`}
      >
        <div className="absolute -right-12 -top-12 text-white/10">
          <i className="fa-solid fa-rocket text-[160px]" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold mb-4">
            <i className="fa-solid fa-star" /> START HERE
          </div>
          <h2 className="text-3xl font-bold mb-3">Welcome to Stage 1</h2>
          <p className="text-[#f0fdfa] text-lg mb-6 max-w-2xl">
            Begin with your kickoff call and commitment. Everything else will unlock as
            you go. Take it one step at a time.
          </p>
        </div>
      </section>
    </>
  );
}
