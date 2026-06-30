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
import {
  ElementContentHandlers,
  StageElementContent,
} from "./StageElementContent";

interface StageElementCardProps {
  element: StageElement;
  expanded: boolean;
  onToggle: () => void;
  handlers?: ElementContentHandlers;
}

function getElementStyle(type: StageElementType) {
  return ELEMENT_UX_STYLES[type] ?? DEFAULT_ELEMENT_UX_STYLE;
}

export function StageElementCard({
  element,
  expanded,
  onToggle,
  handlers,
}: StageElementCardProps) {
  const style = getElementStyle(element.element_type);
  const title =
    element.title?.trim() || ELEMENT_TYPE_LABELS[element.element_type] || "Stage Element";
  const hasToggle = !["live_call", "commitment_builder"].includes(element.element_type);

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
            !["live_call", "commitment_builder", "ai_mentor", "reflection_journal"].includes(
              element.element_type
            ) ? (
              <p className="text-sm text-slate-600 mb-2">{element.description}</p>
            ) : null}
            {element.element_type === "live_call" && element.description ? (
              <p className="text-sm text-slate-600 mb-2">{element.description}</p>
            ) : null}
            {element.element_type === "commitment_builder" && element.description ? (
              <p className="text-sm text-slate-600 mb-2">{element.description}</p>
            ) : null}
          </div>
        </div>
      </div>
      <CollapsiblePanel expanded={hasToggle ? expanded : true}>
        <StageElementContent element={element} handlers={handlers} />
      </CollapsiblePanel>
    </section>
  );
}
