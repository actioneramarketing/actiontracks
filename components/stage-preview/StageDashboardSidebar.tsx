"use client";

import { shadowSoft, type StageDashboardUIHandlers } from "./shared";

interface StageDashboardSidebarProps {
  handlers: StageDashboardUIHandlers;
}

export function StageDashboardSidebar({ handlers }: StageDashboardSidebarProps) {
  const { openModal } = handlers;

  return (
    <div className="space-y-6">
      <section
        id="commitment-summary"
        className={`bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 ${shadowSoft} text-white relative overflow-hidden`}
      >
        <div className="absolute -right-10 -top-10 text-white/10">
          <i className="fa-solid fa-handshake text-9xl" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <i className="fa-solid fa-star" /> Your Commitment
          </h3>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xs text-emerald-100 mb-2 uppercase tracking-wide font-semibold">
              You&apos;re Creating:
            </p>
            <p className="text-sm font-medium text-white italic">Not set yet</p>
          </div>
        </div>
      </section>

      <section
        id="next-action"
        className={`bg-white rounded-2xl p-6 ${shadowSoft} border-2 border-[#14b8a6] sticky top-[380px] h-auto`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#14b8a6] text-white flex items-center justify-center">
            <i className="fa-solid fa-bolt" />
          </div>
          <h3 className="text-md font-bold text-slate-800">Next Action</h3>
        </div>
        <div className="bg-[#f0fdfa] rounded-xl p-4 border border-[#ccfbf1] mb-0">
          <p className="font-semibold text-[#134e4a] text-sm mb-1">
            Complete Your Commitment
          </p>
          <p className="text-xs text-[#0d9488]">
            Define what you&apos;re creating and why it matters to you.
          </p>
        </div>
      </section>

      <section id="sidebar-calendar" className={`bg-white rounded-2xl ${shadowSoft} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-regular fa-calendar text-purple-500" /> Upcoming Events
          </h3>
          <span className="text-xs text-slate-400 font-medium">2 events</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-100 rounded-xl hover:border-purple-300 transition-colors">
            <div className="shrink-0 text-center bg-purple-600 text-white rounded-lg px-2 py-1.5 min-w-[42px]">
              <p className="text-xs font-bold leading-none">MAY</p>
              <p className="text-lg font-extrabold leading-tight">6</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 leading-snug">
                Live Kickoff Call
              </p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <i className="fa-regular fa-clock text-[9px]" /> 7:00 PM EST · 60 min
              </p>
              <span className="inline-flex items-center mt-1.5 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                <i className="fa-solid fa-video mr-1 text-[9px]" /> Live Call
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-xl hover:border-orange-300 transition-colors">
            <div className="shrink-0 text-center bg-orange-500 text-white rounded-lg px-2 py-1.5 min-w-[42px]">
              <p className="text-xs font-bold leading-none">MAY</p>
              <p className="text-lg font-extrabold leading-tight">8</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 leading-snug">GSD Session</p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <i className="fa-regular fa-clock text-[9px]" /> 10:00 AM EST · 90 min
              </p>
              <span className="inline-flex items-center mt-1.5 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                <i className="fa-solid fa-bolt mr-1 text-[9px]" /> Co-working
              </span>
            </div>
          </div>
          <button
            type="button"
            className="w-full py-2 text-xs font-semibold text-[#14b8a6] hover:text-[#0d9488] flex items-center justify-center gap-1 mt-1"
          >
            <i className="fa-regular fa-calendar-plus" /> View Full Calendar
          </button>
        </div>
      </section>

      <section id="sidebar-task-list" className={`bg-white rounded-2xl ${shadowSoft} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-teal-500" /> Task List
          </h3>
          <span className="text-xs text-slate-400 font-medium">3 pending</span>
        </div>
        <div className="mb-3">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <i className="fa-solid fa-circle-exclamation text-[10px]" /> High Priority
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 leading-snug">
                  Submit commitment form
                </p>
                <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                  <i className="fa-regular fa-calendar text-[9px]" /> Due May 8
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <i className="fa-solid fa-circle-half-stroke text-[10px]" /> Medium Priority
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2.5 bg-yellow-50 border border-yellow-100 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 leading-snug">
                  Research competitors in niche
                </p>
                <p className="text-xs text-yellow-600 mt-0.5 flex items-center gap-1">
                  <i className="fa-regular fa-calendar text-[9px]" /> Due May 10
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <i className="fa-solid fa-circle text-[10px]" /> Low Priority
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2.5 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 leading-snug">
                  Block calendar for Week 2
                </p>
                <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                  <i className="fa-regular fa-calendar text-[9px]" /> Due May 13
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="track-group-panel" className={`bg-white rounded-2xl ${shadowSoft} overflow-hidden`}>
        <div className="relative h-24 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/478c74a6c0-2819ba7512d938ee2965.png"
            alt="community group cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
            <i className="fa-solid fa-users" /> Track Group
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div>
              <p className="text-sm font-bold text-slate-800">Cohort A — May 2024</p>
              <p className="text-xs text-slate-500">8 members</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Your accountability group for this track. Share wins, ask questions, and
            cheer each other on.
          </p>
          <button
            type="button"
            className="w-full py-2.5 bg-[#14b8a6] text-white font-semibold rounded-xl hover:bg-[#0d9488] transition-colors text-sm flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-arrow-right-to-bracket" /> Go to Group
          </button>
        </div>
      </section>

      <section id="sidebar-partner" className={`bg-white rounded-2xl ${shadowSoft} p-5`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user-group text-lg" />
          </div>
          <div>
            <h3 className="text-md font-bold text-slate-800">Accountability Partner</h3>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 mb-3">
          <p className="font-semibold text-[#134e4a] text-sm mb-1">
            <span className="text-[#1E40AF] text-left w-full">Choose a Partner</span>
          </p>
          <p className="text-xs text-blue-800">
            Having an accountability partner doubles your chances of completion.
          </p>
        </div>
      </section>

      <section id="sidebar-tools" className={`bg-white rounded-2xl ${shadowSoft} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-toolbox text-indigo-500" /> Tools
          </h3>
          <span className="text-xs text-slate-400 font-medium">2 tools</span>
        </div>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => openModal("ai-mentor")}
            className="w-full flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-100 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <i className="fa-solid fa-robot text-sm" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-slate-800">AI Mentor</p>
              <p className="text-xs text-slate-500">Instant guidance 24/7</p>
            </div>
            <i className="fa-solid fa-arrow-right text-slate-400 group-hover:text-indigo-600 text-xs" />
          </button>
          <button
            type="button"
            onClick={() => openModal("journal")}
            className="w-full flex items-center gap-3 p-3 bg-pink-50 border border-pink-100 rounded-xl hover:border-pink-300 hover:bg-pink-100 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-pink-600 text-white flex items-center justify-center shrink-0">
              <i className="fa-solid fa-book text-sm" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-slate-800">Reflection Journal</p>
              <p className="text-xs text-slate-500">Document your journey</p>
            </div>
            <i className="fa-solid fa-arrow-right text-slate-400 group-hover:text-pink-600 text-xs" />
          </button>
        </div>
      </section>

      <section
        id="guide-panel"
        className={`bg-white rounded-2xl p-6 ${shadowSoft} border-t-4 border-[#14b8a6] sticky top-24`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
              alt="Guide Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Robert Evans</h3>
          <p className="text-xs font-semibold text-[#14b8a6] uppercase tracking-wider mb-3">
            Your Track Guide
          </p>
          <p className="text-sm text-slate-600 mb-5 line-clamp-2 h-auto">
            I&apos;m here to guide you through every step. Don&apos;t hesitate to reach
            out for support.
          </p>
          <div className="w-full flex gap-3">
            <button
              type="button"
              className="py-2 bg-white text-slate-600 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors border border-slate-200 text-center flex-1 w-auto"
            >
              Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
