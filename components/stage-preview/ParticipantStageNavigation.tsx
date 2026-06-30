"use client";

import { ActionTrackStage } from "@/lib/types/database";
import { getStageNavigation } from "@/lib/participant/stage-page-model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { shadowSoft } from "./shared";

interface ParticipantStageNavigationProps {
  trackSlug: string;
  stage: ActionTrackStage;
  stages: ActionTrackStage[];
}

function NavButton({
  direction,
  link,
}: {
  direction: "previous" | "next";
  link: { stage: ActionTrackStage; href: string } | null;
}) {
  const isPrevious = direction === "previous";
  const label = isPrevious ? "Previous Stage" : "Next Stage";
  const arrow = isPrevious ? "←" : "→";

  if (!link) {
    return (
      <div
        className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
        aria-disabled="true"
      >
        <p className="text-sm font-semibold flex items-center gap-2">
          {isPrevious ? (
            <>
              <span aria-hidden="true">{arrow}</span> {label}
            </>
          ) : (
            <>
              {label} <span aria-hidden="true">{arrow}</span>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <Link
      href={link.href}
      className={`flex-1 min-w-0 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-[#14b8a6] hover:bg-[#f0fdfa] transition-colors group ${shadowSoft}`}
    >
      <p className="text-sm font-semibold text-slate-800 flex items-center gap-2 group-hover:text-[#0d9488]">
        {isPrevious ? (
          <>
            <span aria-hidden="true">{arrow}</span> {label}
          </>
        ) : (
          <>
            {label} <span aria-hidden="true">{arrow}</span>
          </>
        )}
      </p>
      <p className="text-xs text-slate-500 mt-1 truncate group-hover:text-[#0d9488]">
        Stage {link.stage.stage_number}: {link.stage.title}
      </p>
    </Link>
  );
}

export function ParticipantStageNavigation({
  trackSlug,
  stage,
  stages,
}: ParticipantStageNavigationProps) {
  const router = useRouter();
  const navigation = getStageNavigation(trackSlug, stage, stages);
  const currentHref =
    navigation.allStages.find((item) => item.stage.id === stage.id)?.href ?? "";

  return (
    <nav
      id="stage-navigation"
      aria-label="Stage navigation"
      className={`bg-white rounded-2xl p-4 sm:p-5 ${shadowSoft} border border-slate-200`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <NavButton direction="previous" link={navigation.previous} />

          <div className="shrink-0 text-center px-2">
            <p className="text-sm font-bold text-slate-800">{navigation.stageLabel}</p>
            {navigation.allStages.length > 1 ? (
              <label className="sr-only" htmlFor="stage-picker">
                View all stages
              </label>
            ) : null}
            {navigation.allStages.length > 1 ? (
              <select
                id="stage-picker"
                value={currentHref}
                onChange={(event) => {
                  const href = event.target.value;
                  if (href) {
                    router.push(href);
                  }
                }}
                className="mt-2 w-full sm:w-auto max-w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent outline-none"
              >
                {navigation.allStages.map((item) => (
                  <option key={item.stage.id} value={item.href}>
                    Stage {item.stage.stage_number}: {item.stage.title}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          <NavButton direction="next" link={navigation.next} />
        </div>
      </div>
    </nav>
  );
}
