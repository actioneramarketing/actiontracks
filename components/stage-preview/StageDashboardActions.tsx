"use client";

import {
  CardToggle,
  CollapsiblePanel,
  shadowSoft,
  type StageDashboardUIHandlers,
} from "./shared";

interface StageDashboardActionsProps {
  handlers: StageDashboardUIHandlers;
}

export function StageDashboardActions({ handlers }: StageDashboardActionsProps) {
  const { expandedCards, toggleCard, openModal } = handlers;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-arrow-right text-[#14b8a6]" /> Your Next Steps
          </h3>
          <span className="text-sm text-slate-500 font-medium">3 actions</span>
        </div>

        <section
          id="action-live-kickoff"
          className={`bg-white rounded-2xl ${shadowSoft} border-l-4 border-purple-500`}
        >
          <div className="p-6 h-[100px]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-video text-xl" />
              </div>
              <div className="min-w-0 h-auto block">
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">
                      Live Kickoff Call
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Meet your cohort and set the foundation
                </p>
              </div>
            </div>
          </div>
          <CollapsiblePanel expanded className="">
            <div className="px-6 pb-6 border-t border-slate-100 pt-0">
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-regular fa-calendar text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">
                    Monday, May 6th at 7:00 PM EST
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-regular fa-clock text-slate-400" />
                  <span className="text-sm text-slate-600">Duration: 60 minutes</span>
                </div>
              </div>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" /> Join Call (Opens
                May 6th)
              </button>
            </div>
          </CollapsiblePanel>
        </section>

        <section
          id="action-commitment-builder"
          className={`bg-white rounded-2xl ${shadowSoft} border-l-4 border-emerald-500`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4 h-auto">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-handshake text-xl" />
              </div>
              <div className="min-w-0 h-[60px]">
                <div className="flex items-start justify-between mb-2 gap-3 h-[25px]">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">
                      Commitment Builder
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Define your why and create your execution contract
                </p>
              </div>
            </div>
          </div>
          <CollapsiblePanel expanded>
            <div className="px-6 pb-6 border-t border-slate-100 pt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    What are you committing to create?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., A masterclass on Email Marketing for Coaches"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Why is this important to you?
                  </label>
                  <textarea
                    placeholder="Share your deeper motivation..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    What obstacles might get in your way?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Time management, perfectionism"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    When will you work on this each week?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tuesday & Thursday 6-8pm"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-check" /> Save My Commitment
                </button>
              </div>
            </div>
          </CollapsiblePanel>
        </section>

        <section
          id="action-todo-list"
          className={`bg-white rounded-2xl ${shadowSoft} border-l-4 border-teal-500`}
        >
          <div className="p-6 h-[100px]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-list-check text-xl" />
              </div>
              <div className="flex-1 min-w-0 h-[60px]">
                <div className="flex items-start justify-between gap-3 mb-2 h-7">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Task List</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-2" />
                  </div>
                  <CardToggle
                    expanded={expandedCards.todo}
                    onClick={() => toggleCard("todo")}
                  />
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Track your action items and progress
                </p>
              </div>
            </div>
          </div>
          <CollapsiblePanel expanded={expandedCards.todo}>
            <div className="px-6 border-t border-slate-100 pt-4 pb-6">
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  System Tasks
                </p>
                <div className="space-y-2">
                  <div className="flex items-center p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mr-3"
                    />
                    <span className="text-sm text-slate-400 line-through flex-1">
                      Complete your profile
                    </span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mr-3"
                    />
                    <span className="text-sm text-slate-400 line-through flex-1">
                      Join the community group
                    </span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-colors">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-slate-700 font-medium">
                          Submit your commitment form
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                            <i className="fa-solid fa-circle-exclamation mr-1 text-[9px]" />
                            High
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <i className="fa-regular fa-calendar text-[10px]" /> May 8
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Personal Tasks
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-colors">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-slate-700 font-medium">
                          Research competitors in my niche
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                            <i className="fa-solid fa-circle-half-stroke mr-1 text-[9px]" />
                            Medium
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <i className="fa-regular fa-calendar text-[10px]" /> May 10
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-colors">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-slate-700 font-medium">
                          Block calendar time for Week 2
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            <i className="fa-solid fa-circle mr-1 text-[9px]" />
                            Low
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <i className="fa-regular fa-calendar text-[10px]" /> May 13
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <i className="fa-solid fa-plus" />
                  </button>
                </div>
              </div>
            </div>
          </CollapsiblePanel>
        </section>
      </div>

      <div id="momentum-content" className="space-y-4 mt-0">
        <section
          id="action-accountability-partner"
          className={`bg-white rounded-2xl ${shadowSoft} border-l-4 border-blue-500`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-user-group text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">
                      Choose Your Accountability Partner
                    </h4>
                  </div>
                  <CardToggle
                    expanded={expandedCards.partner}
                    onClick={() => toggleCard("partner")}
                  />
                </div>
                <p className="text-sm text-slate-600">
                  Connect with someone to keep you on track
                </p>
                <hr className="p-0 m-0 mt-6 mb-6 border-t border-[#ccc]" />
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" /> RSVP &amp; Join
                  Session
                </button>
              </div>
            </div>
          </div>
          <CollapsiblePanel expanded={expandedCards.partner}>
            <div className="px-6 pb-6 border-t border-slate-100 pt-4">
              <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
                <p className="text-sm text-blue-800 mb-2">
                  <i className="fa-solid fa-lightbulb mr-2" />
                  <strong>Why it matters:</strong>
                </p>
                <p className="text-sm text-blue-700">
                  Having an accountability partner doubles your chances of completion.
                  You&apos;ll check in weekly and support each other&apos;s progress.
                </p>
              </div>
              <div className="mb-4">
                <h5 className="text-sm font-bold text-slate-700 mb-3">Suggested Matches</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                        alt="Partner"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-800">Priya Sharma</p>
                        <p className="text-xs text-slate-500">Marketing · EST</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors shadow-sm"
                    >
                      Request
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
                        alt="Partner"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-800">David Chen</p>
                        <p className="text-xs text-slate-500">Design · PST</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors shadow-sm"
                    >
                      Request
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-3">
                    <i className="fa-solid fa-users text-blue-600" /> Browse All Partners
                  </span>
                  <i className="fa-solid fa-arrow-right text-slate-400 group-hover:text-blue-600" />
                </button>
              </div>
            </div>
          </CollapsiblePanel>
        </section>

        <section
          id="action-gsd-session"
          className={`bg-white rounded-2xl ${shadowSoft} border-l-4 border-purple-500`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-video text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">GSD Session</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-clock" /> 90 min
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        <i className="fa-solid fa-bolt mr-1 text-[9px]" /> Live Event
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Live co-working session to power through your work
                </p>
              </div>
            </div>
          </div>
          <CollapsiblePanel expanded>
            <div className="px-6 pb-6 border-t border-slate-100 pt-4">
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fa-regular fa-calendar text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">
                    Wednesday, May 8th at 10:00 AM EST
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-regular fa-clock text-slate-400" />
                  <span className="text-sm text-slate-600">Duration: 90 minutes</span>
                </div>
              </div>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" /> RSVP &amp; Join
                Session
              </button>
            </div>
          </CollapsiblePanel>
        </section>
      </div>

      <div className="space-y-4 mt-0 p-0 h-[612px]">
        <section
          id="action-ai-mentor"
          className={`bg-white rounded-2xl ${shadowSoft} border-l-4 border-indigo-500`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-robot text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">AI Mentor</h4>
                    <div className="flex items-center gap-3 text-sm mb-2">
                      <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full">
                        <i className="fa-solid fa-sparkles text-[8px] mr-1" /> Available
                        24/7
                      </span>
                    </div>
                  </div>
                  <CardToggle
                    expanded={expandedCards.ai}
                    onClick={() => toggleCard("ai")}
                  />
                </div>
                <p className="text-sm text-slate-600">
                  Get instant guidance, feedback, and brainstorming support
                </p>
              </div>
            </div>
          </div>
          <CollapsiblePanel expanded={expandedCards.ai}>
            <div className="px-6 pb-6 border-t border-slate-100 pt-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border border-indigo-100">
                <p className="text-sm text-indigo-900 mb-3">
                  <strong>Your AI Mentor can help you:</strong>
                </p>
                <ul className="space-y-1.5 text-sm text-indigo-800">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-indigo-500 mt-0.5" />
                    <span>Brainstorm and refine your topic ideas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-indigo-500 mt-0.5" />
                    <span>Overcome creative blocks and obstacles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-indigo-500 mt-0.5" />
                    <span>Get personalized action plans</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => openModal("ai-mentor")}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-comments" /> UX Pilot AI Mentor Chat
              </button>
            </div>
          </CollapsiblePanel>
        </section>

        <section
          id="action-journal"
          className={`bg-white rounded-2xl ${shadowSoft} border-l-4 border-pink-500`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-book text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">
                      Reflection Journal
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-clock" /> 5–10 min
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-circle text-[8px]" /> Not Started
                      </span>
                    </div>
                  </div>
                  <CardToggle
                    expanded={expandedCards.journal}
                    onClick={() => toggleCard("journal")}
                  />
                </div>
                <p className="text-sm text-slate-600">Document your journey and insights</p>
              </div>
            </div>
          </div>
          <CollapsiblePanel expanded={expandedCards.journal}>
            <div className="px-6 pb-6 border-t border-slate-100 pt-4">
              <div className="bg-pink-50 rounded-xl p-4 mb-4 border border-pink-100">
                <p className="text-sm font-semibold text-pink-900 mb-2">
                  Today&apos;s Prompt:
                </p>
                <p className="text-sm text-pink-800 italic">
                  &quot;What would it feel like to complete this masterclass and share it
                  with the world? What impact could it have on your audience?&quot;
                </p>
              </div>
              <button
                type="button"
                onClick={() => openModal("journal")}
                className="w-full sm:w-auto px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-pen-to-square" /> Open Full Journal
              </button>
            </div>
          </CollapsiblePanel>
        </section>

        <section
          id="action-content"
          className={`bg-white rounded-2xl ${shadowSoft} border-l-4 border-red-500`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-play text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">
                      Essential Training Content
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-clock" /> 20 min total
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-circle text-[8px]" /> Not Started
                      </span>
                    </div>
                  </div>
                  <CardToggle
                    expanded={expandedCards.content}
                    onClick={() => toggleCard("content")}
                  />
                </div>
                <p className="text-sm text-slate-600">
                  Watch these videos to master the fundamentals
                </p>
              </div>
            </div>
          </div>
          <CollapsiblePanel expanded={expandedCards.content}>
            <div className="px-6 pb-6 border-t border-slate-100 pt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-red-300 transition-colors cursor-pointer group">
                  <div className="w-20 h-14 bg-slate-200 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                    <i className="fa-solid fa-play text-slate-400 group-hover:text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-slate-800 text-sm mb-1">
                      How to Choose a Winning Masterclass Topic
                    </h5>
                    <p className="text-xs text-slate-500">12 minutes · Video lesson</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-red-300 transition-colors cursor-pointer group">
                  <div className="w-20 h-14 bg-slate-200 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                    <i className="fa-solid fa-play text-slate-400 group-hover:text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-slate-800 text-sm mb-1">
                      The Power of Commitment in Execution
                    </h5>
                    <p className="text-xs text-slate-500">8 minutes · Video lesson</p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsiblePanel>
        </section>

        <section
          id="action-resources"
          className={`bg-white rounded-2xl ${shadowSoft} border-l-4 border-amber-500`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-folder-open text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">
                      Resources &amp; Templates
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <i className="fa-solid fa-download" /> 3 downloads
                      </span>
                    </div>
                  </div>
                  <CardToggle
                    expanded={expandedCards.resources}
                    onClick={() => toggleCard("resources")}
                  />
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Download helpful materials to support your work
                </p>
              </div>
            </div>
          </div>
          <CollapsiblePanel expanded={expandedCards.resources}>
            <div className="px-6 pb-6 border-t border-slate-100 pt-4">
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <i className="fa-regular fa-file-pdf text-red-500 text-xl" />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        Topic Ideation Worksheet
                      </p>
                      <p className="text-xs text-slate-500">PDF · 245 KB</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-download text-slate-400 group-hover:text-amber-600" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <i className="fa-regular fa-file-word text-blue-500 text-xl" />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        Commitment Contract Template
                      </p>
                      <p className="text-xs text-slate-500">DOCX · 128 KB</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-download text-slate-400 group-hover:text-amber-600" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-link text-[#14b8a6] text-xl" />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        Recommended Tools &amp; Software List
                      </p>
                      <p className="text-xs text-slate-500">External Link</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-up-right-from-square text-slate-400 group-hover:text-amber-600" />
                </a>
              </div>
            </div>
          </CollapsiblePanel>
        </section>
      </div>
    </>
  );
}
