"use client";

import { StageResourceItem } from "@/lib/utils/stage-resources";

interface ResourceVideoModalProps {
  resource: StageResourceItem;
  embedUrl: string;
  onClose: () => void;
}

export function ResourceVideoModal({
  resource,
  embedUrl,
  onClose,
}: ResourceVideoModalProps) {
  const originalUrl = resource.url.trim();
  const iframeTitle = resource.title.trim() || "Video resource";

  return (
    <div
      className="stage-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="stage-modal-content bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resource-video-title"
      >
        <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 id="resource-video-title" className="text-xl font-bold text-slate-800">
              {resource.title}
            </h3>
            {resource.description.trim() ? (
              <p className="text-sm text-slate-500 mt-1">{resource.description.trim()}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none shrink-0"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="relative w-full overflow-hidden rounded-xl bg-black aspect-video">
            <iframe
              src={embedUrl}
              title={iframeTitle}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {originalUrl ? (
          <div className="px-6 pb-6 flex justify-end">
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-amber-700 hover:text-amber-800 inline-flex items-center gap-2"
            >
              Open in new tab
              <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
