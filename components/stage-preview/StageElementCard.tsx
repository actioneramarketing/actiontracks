"use client";

import { ELEMENT_TYPE_LABELS } from "@/lib/constants/element-types";
import { StageElement, StageElementType } from "@/lib/types/database";
import {
  CollapsiblePanel,
  CardToggle,
  shadowSoft,
} from "./shared";
import {
  DEFAULT_ELEMENT_UX_STYLE,
  ELEMENT_UX_STYLES,
} from "./element-ux-styles";
import { getResourcesCount } from "./elements/ResourcesElement";
import { formatResourceCountLabel } from "@/lib/utils/stage-resources";
import {
  CommitmentElementContext,
  ElementContentHandlers,
  JournalElementContext,
  StageElementContent,
  TaskListElementContext,
} from "./StageElementContent";
import { getReflectionJournalStatusLabel } from "./elements/ReflectionJournalElement";

interface StageElementCardProps {
  element: StageElement;
  expanded: boolean;
  onToggle: () => void;
  handlers?: ElementContentHandlers;
  commitmentContext?: CommitmentElementContext;
  taskListContext?: TaskListElementContext;
  journalContext?: JournalElementContext;
}

function getElementStyle(type: StageElementType) {
  return ELEMENT_UX_STYLES[type] ?? DEFAULT_ELEMENT_UX_STYLE;
}

export function StageElementCard({
  element,
  expanded,
  onToggle,
  handlers,
  commitmentContext,
  taskListContext,
  journalContext,
}: StageElementCardProps) {
  const style = getElementStyle(element.element_type);
  const isResources = element.element_type === "resources";
  const isJournal = element.element_type === "reflection_journal";
  const title = isResources
    ? element.title?.trim() || "Resources & Templates"
    : element.title?.trim() || ELEMENT_TYPE_LABELS[element.element_type] || "Stage Element";
  const resourceCount = isResources ? getResourcesCount(element) : 0;
  const hasToggle = !["live_call", "commitment_builder", "task_list"].includes(
    element.element_type
  );

  return (
    <section
      id={`element-${element.id}`}
      className={`bg-white rounded-2xl ${shadowSoft} border-l-4 ${style.border}`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl ${style.iconBg} ${style.iconText} flex items-center justify-center shrink-0`}
          >
            <i className={`fa-solid ${style.iconClass} text-xl`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">{title}</h4>
                {isResources ? (
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-download text-xs" />
                      {formatResourceCountLabel(resourceCount)}
                    </span>
                  </div>
                ) : null}
                {isJournal && journalContext ? (
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      {getReflectionJournalStatusLabel(
                        element.id,
                        journalContext.savedEntries
                      ) === "Saved" ? (
                        <>
                          <i className="fa-solid fa-circle-check text-[10px] text-pink-600" />{" "}
                          Saved
                        </>
                      ) : (
                        <>
                          <i className="fa-regular fa-circle text-[8px]" /> Not Started
                        </>
                      )}
                    </span>
                  </div>
                ) : null}
                {element.is_required ? (
                  <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full ring-1 ring-amber-100">
                    Required
                  </span>
                ) : null}
              </div>
              {hasToggle ? (
                <CardToggle expanded={expanded} onClick={onToggle} />
              ) : null}
            </div>
            {element.description &&
            ![
              "live_call",
              "commitment_builder",
              "task_list",
              "resources",
              "ai_mentor",
              "reflection_journal",
            ].includes(element.element_type) ? (
              <p className="text-sm text-slate-600 mb-2">{element.description}</p>
            ) : null}
            {element.element_type === "live_call" && element.description ? (
              <p className="text-sm text-slate-600 mb-2">{element.description}</p>
            ) : null}
            {element.element_type === "commitment_builder" && element.description ? (
              <p className="text-sm text-slate-600 mb-2">{element.description}</p>
            ) : null}
            {element.element_type === "task_list" && element.description ? (
              <p className="text-sm text-slate-600 mb-2">{element.description}</p>
            ) : null}
            {isResources ? (
              <p className="text-sm text-slate-600 mb-2">
                {element.description?.trim() ||
                  "Download helpful materials to support your work"}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <CollapsiblePanel expanded={hasToggle ? expanded : true}>
        <StageElementContent
          element={element}
          handlers={handlers}
          commitmentContext={commitmentContext}
          taskListContext={taskListContext}
          journalContext={journalContext}
        />
      </CollapsiblePanel>
    </section>
  );
}
