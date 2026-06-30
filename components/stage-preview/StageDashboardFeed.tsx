"use client";

import { cn } from "@/lib/utils";
import { shadowSoft, type FeedFilter, type StageDashboardUIHandlers } from "./shared";

interface StageDashboardFeedProps {
  handlers: StageDashboardUIHandlers;
}

function postVisible(stage: "stage1" | "general", filter: FeedFilter): boolean {
  if (filter === "all") {
    return true;
  }
  if (filter === "stage1") {
    return stage === "stage1";
  }
  return stage === "general";
}

export function StageDashboardFeed({ handlers }: StageDashboardFeedProps) {
  const { feedFilter, setFeedFilter, openComments, toggleComments } = handlers;

  const filterButtonClass = (filter: FeedFilter) =>
    cn(
      "feed-filter-btn px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
      feedFilter === filter
        ? "bg-[#14b8a6] text-white border border-[#14b8a6]"
        : "bg-white text-slate-600 border border-slate-200 hover:border-[#14b8a6]/30 hover:text-[#14b8a6]"
    );

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
            alt="Your Avatar"
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="flex-1">
            <textarea
              placeholder="Share your Stage 1 progress, ask a question, or post an update..."
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent outline-none"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">Post to:</span>
              <select
                defaultValue="stage1"
                className="bg-white border border-[#ccfbf1] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0d9488] focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent outline-none cursor-pointer"
              >
                <option value="stage1">Stage 1</option>
                <option value="general">General</option>
                <option value="stage2">Stage 2</option>
              </select>
              <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                <i className="fa-solid fa-flag mr-1 text-[9px]" /> Stage 1 Default
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                title="Add Image"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#14b8a6] hover:border-[#ccfbf1] hover:bg-[#f0fdfa] transition-colors"
              >
                <i className="fa-regular fa-image" />
              </button>
              <button
                type="button"
                title="Add Link"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#14b8a6] hover:border-[#ccfbf1] hover:bg-[#f0fdfa] transition-colors"
              >
                <i className="fa-solid fa-link" />
              </button>
              <button
                type="button"
                title="Add Document"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#14b8a6] hover:border-[#ccfbf1] hover:bg-[#f0fdfa] transition-colors"
              >
                <i className="fa-regular fa-file" />
              </button>
              <button
                type="button"
                title="Add Video"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-[#14b8a6] hover:border-[#ccfbf1] hover:bg-[#f0fdfa] transition-colors"
              >
                <i className="fa-solid fa-video" />
              </button>
            </div>
            <button
              type="button"
              className="px-5 py-2 bg-[#14b8a6] text-white font-semibold rounded-lg hover:bg-[#0d9488] transition-colors text-sm"
            >
              Post Update
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 font-medium">Viewing:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="filter-stage1"
              onClick={() => setFeedFilter("stage1")}
              className={filterButtonClass("stage1")}
            >
              Stage 1
            </button>
            <button
              type="button"
              id="filter-all"
              onClick={() => setFeedFilter("all")}
              className={filterButtonClass("all")}
            >
              All Stages
            </button>
            <button
              type="button"
              id="filter-general"
              onClick={() => setFeedFilter("general")}
              className={filterButtonClass("general")}
            >
              General
            </button>
          </div>
        </div>
        <button
          type="button"
          className="text-sm text-[#14b8a6] font-medium hover:text-[#0d9488] flex items-center gap-1"
        >
          <i className="fa-solid fa-arrow-rotate-right text-xs" /> Refresh
        </button>
      </div>

      <div id="feed-posts" className="space-y-4">
        <div
          data-stage="stage1"
          className={cn(
            "feed-post bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors",
            !postVisible("stage1", feedFilter) && "hidden"
          )}
        >
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
              alt="User"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Sarah Mitchell</h4>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full shrink-0">
                  <i className="fa-solid fa-flag mr-1 text-[9px]" />
                  Stage 1
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mt-2">
                Just completed my commitment form! Going with &quot;Email Marketing for
                Coaches&quot; as my topic. Feeling nervous but excited to finally take
                action on this. 🎉
              </p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-slate-500 hover:text-[#14b8a6] transition-colors text-sm font-medium"
                >
                  <i className="fa-regular fa-hand" />{" "}
                  <span className="hidden sm:inline">Progress</span>{" "}
                  <span className="text-xs">(12)</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleComments("post1")}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-[#14b8a6] transition-colors text-sm font-medium"
                >
                  <i className="fa-regular fa-comment" />{" "}
                  <span className="hidden sm:inline">Comment</span>{" "}
                  <span className="text-xs">(5)</span>
                </button>
              </div>
              {openComments.post1 ? (
                <div
                  id="post1-comments"
                  className="mt-3 pt-3 border-t border-slate-100 space-y-3"
                >
                  <div className="flex gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
                      alt="Robert"
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                      <p className="text-xs font-semibold text-slate-800">
                        Robert Evans{" "}
                        <span className="text-slate-400 font-normal ml-1">· 1 hour ago</span>
                      </p>
                      <p className="text-xs text-slate-700 mt-0.5">
                        That&apos;s a great niche! Email marketing for coaches is super
                        in-demand right now. You&apos;ve got this! 💪
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-9.jpg"
                      alt="User"
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                      <p className="text-xs font-semibold text-slate-800">
                        Marcus Lee{" "}
                        <span className="text-slate-400 font-normal ml-1">· 45 min ago</span>
                      </p>
                      <p className="text-xs text-slate-700 mt-0.5">
                        Same stage here! Let&apos;s keep each other accountable 🙌
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                      alt="You"
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment on Stage 1..."
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-[#14b8a6] text-white text-xs font-semibold rounded-xl hover:bg-[#0d9488] transition-colors"
                      >
                        <i className="fa-solid fa-paper-plane" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div
          data-stage="stage1"
          className={cn(
            "feed-post bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors",
            !postVisible("stage1", feedFilter) && "hidden"
          )}
        >
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg"
              alt="User"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">James Rodriguez</h4>
                  <p className="text-xs text-slate-500">5 hours ago</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full shrink-0">
                  <i className="fa-solid fa-flag mr-1 text-[9px]" />
                  Stage 1
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mt-2">
                Anyone else struggling to narrow down their topic? I have like 5 different
                ideas and can&apos;t decide which one to focus on. Stage 1 is harder than I
                thought!
              </p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-slate-500 hover:text-[#14b8a6] transition-colors text-sm font-medium"
                >
                  <i className="fa-regular fa-hand" />{" "}
                  <span className="hidden sm:inline">Progress</span>{" "}
                  <span className="text-xs">(3)</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleComments("post2")}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-[#14b8a6] transition-colors text-sm font-medium"
                >
                  <i className="fa-regular fa-comment" />{" "}
                  <span className="hidden sm:inline">Comment</span>{" "}
                  <span className="text-xs">(8)</span>
                </button>
              </div>
              {openComments.post2 ? (
                <div
                  id="post2-comments"
                  className="mt-3 pt-3 border-t border-slate-100 space-y-3"
                >
                  <div className="flex gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                      alt="User"
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                      <p className="text-xs font-semibold text-slate-800">
                        Priya Sharma{" "}
                        <span className="text-slate-400 font-normal ml-1">· 3 hours ago</span>
                      </p>
                      <p className="text-xs text-slate-700 mt-0.5">
                        Try the AI Mentor — it really helped me narrow down from 4 ideas to
                        1. It asks great questions!
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                      alt="You"
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment on Stage 1..."
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-[#14b8a6] text-white text-xs font-semibold rounded-xl hover:bg-[#0d9488] transition-colors"
                      >
                        <i className="fa-solid fa-paper-plane" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div
          data-stage="general"
          className={cn(
            "feed-post bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors",
            !postVisible("general", feedFilter) && "hidden"
          )}
        >
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
              alt="User"
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">David Chen</h4>
                  <p className="text-xs text-slate-500">1 day ago</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full shrink-0">
                  General
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mt-2">
                Just joined the cohort! Super excited to be here. Looking forward to
                meeting everyone on the kickoff call.
              </p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-slate-500 hover:text-[#14b8a6] transition-colors text-sm font-medium"
                >
                  <i className="fa-regular fa-hand" />{" "}
                  <span className="hidden sm:inline">Progress</span>{" "}
                  <span className="text-xs">(7)</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleComments("post3")}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-[#14b8a6] transition-colors text-sm font-medium"
                >
                  <i className="fa-regular fa-comment" />{" "}
                  <span className="hidden sm:inline">Comment</span>{" "}
                  <span className="text-xs">(2)</span>
                </button>
              </div>
              {openComments.post3 ? (
                <div id="post3-comments" className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex gap-2 mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                      alt="You"
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-[#14b8a6] text-white text-xs font-semibold rounded-xl hover:bg-[#0d9488] transition-colors"
                      >
                        <i className="fa-solid fa-paper-plane" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          className="px-6 py-2.5 bg-slate-50 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors text-sm border border-slate-200"
        >
          Load More Posts
        </button>
      </div>
    </section>
  );
}
