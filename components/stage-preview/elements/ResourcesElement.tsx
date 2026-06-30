"use client";

import { useEffect, useState } from "react";
import { StageElement } from "@/lib/types/database";
import { asRecord } from "@/lib/utils/element-settings";
import {
  formatResourceSubtitle,
  parseStageResources,
  resourceActionIcon,
  StageResourceItem,
} from "@/lib/utils/stage-resources";
import {
  getVideoEmbedUrl,
  isVideoResource,
} from "@/lib/utils/video-embed";
import { ResourceVideoModal } from "../ResourceVideoModal";
import { resourceIconClass } from "../element-ux-styles";

interface ResourcesElementProps {
  element: StageElement;
}

function ResourceRow({
  resource,
  onWatchVideo,
}: {
  resource: StageResourceItem;
  onWatchVideo: (resource: StageResourceItem, embedUrl: string) => void;
}) {
  const subtitle = formatResourceSubtitle(resource);
  const hasUrl = Boolean(resource.url.trim());
  const isVideo = isVideoResource(resource);
  const embedUrl = hasUrl ? getVideoEmbedUrl(resource.url) : null;
  const openInModal = isVideo && Boolean(embedUrl);

  const pendingMessage = isVideo
    ? "Video link coming soon."
    : "Resource link coming soon.";

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
            <p className="text-xs text-slate-400 mt-0.5">{pendingMessage}</p>
          ) : null}
          {openInModal ? (
            <p className="text-xs text-amber-700 mt-0.5 font-medium">Watch</p>
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

  if (openInModal && embedUrl) {
    return (
      <button
        type="button"
        onClick={() => onWatchVideo(resource, embedUrl)}
        className="w-full flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group text-left"
      >
        {inner}
      </button>
    );
  }

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
  const [activeVideo, setActiveVideo] = useState<{
    resource: StageResourceItem;
    embedUrl: string;
  } | null>(null);

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [activeVideo]);

  if (resources.length === 0) {
    return (
      <div className="px-6 pb-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
        Resources for this stage will appear here when your guide adds them.
      </div>
    );
  }

  return (
    <>
      <div className="px-6 pb-6 border-t border-slate-100 pt-4">
        <div className="space-y-2">
          {resources.map((resource, index) => (
            <ResourceRow
              key={`${resource.title}-${index}`}
              resource={resource}
              onWatchVideo={(selected, embedUrl) =>
                setActiveVideo({ resource: selected, embedUrl })
              }
            />
          ))}
        </div>
      </div>

      {activeVideo ? (
        <ResourceVideoModal
          resource={activeVideo.resource}
          embedUrl={activeVideo.embedUrl}
          onClose={() => setActiveVideo(null)}
        />
      ) : null}
    </>
  );
}

export function getResourcesCount(element: StageElement): number {
  return parseStageResources(asRecord(element.settings_json)).length;
}
