"use client";

import { StageElement } from "@/lib/types/database";
import { asRecord } from "@/lib/utils/element-settings";
import {
  formatResourceSubtitle,
  parseStageResources,
  resourceActionIcon,
  StageResourceItem,
} from "@/lib/utils/stage-resources";
import { resourceIconClass } from "../element-ux-styles";

interface ResourcesElementProps {
  element: StageElement;
}

function ResourceRow({ resource }: { resource: StageResourceItem }) {
  const subtitle = formatResourceSubtitle(resource);
  const hasUrl = Boolean(resource.url.trim());

  const inner = (
    <>
      <div className="flex items-center gap-3 min-w-0">
        <i className={`${resourceIconClass(resource.type)} text-xl shrink-0`} />
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm">{resource.title}</p>
          {subtitle ? (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          ) : null}
          {!hasUrl ? (
            <p className="text-xs text-slate-400 mt-0.5">Resource link coming soon.</p>
          ) : null}
        </div>
      </div>
      <i
        className={`fa-solid ${resourceActionIcon(resource.type, hasUrl)} text-slate-400 shrink-0 ${
          hasUrl ? "group-hover:text-amber-600" : ""
        }`}
      />
    </>
  );

  if (hasUrl) {
    return (
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
      {inner}
    </div>
  );
}

export function ResourcesElement({ element }: ResourcesElementProps) {
  const settings = asRecord(element.settings_json);
  const resources = parseStageResources(settings);

  if (resources.length === 0) {
    return (
      <div className="px-6 pb-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
        Resources for this stage will appear here when your guide adds them.
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
      <div className="space-y-2">
        {resources.map((resource, index) => (
          <ResourceRow key={`${resource.title}-${index}`} resource={resource} />
        ))}
      </div>
    </div>
  );
}

export function getResourcesCount(element: StageElement): number {
  return parseStageResources(asRecord(element.settings_json)).length;
}
