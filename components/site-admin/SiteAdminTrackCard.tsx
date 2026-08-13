"use client";

import { Badge, StatusBadge } from "@/components/ui/Badge";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { Card } from "@/components/ui/Card";
import type { SiteAdminTrackView } from "@/lib/actions/site-admin-tracks";
import { getTrackInitials } from "@/lib/utils/action-track-assets";

interface SiteAdminTrackCardProps {
  track: SiteAdminTrackView;
}

export function SiteAdminTrackCard({ track }: SiteAdminTrackCardProps) {
  const initials = getTrackInitials(track.title);
  const visibilityLabel = track.visibility.trim() || "Not set";

  return (
    <Card padding="none" className="flex flex-col h-full overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-teal-50 via-gray-50 to-violet-50 border-b border-gray-100">
        {track.trackImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.trackImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-3xl mb-2 opacity-80" aria-hidden>
              🎯
            </span>
            <p className="text-xs font-medium text-gray-500">No track image</p>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-teal-50 text-sm font-bold text-teal-700">
              {track.trackIconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.trackIconUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
                {track.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 font-mono truncate">
                {track.slug}
              </p>
            </div>
          </div>
          <StatusBadge status={track.status} />
        </div>

        <dl className="space-y-1.5 text-sm text-gray-600 mb-4">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-gray-500">Visibility</dt>
            <dd>
              <Badge variant="info">{visibilityLabel}</Badge>
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-gray-500">Guide</dt>
            <dd>{track.guideName}</dd>
          </div>
          {track.guideEmail ? (
            <div className="flex flex-wrap gap-x-2 min-w-0">
              <dt className="font-medium text-gray-500">Email</dt>
              <dd className="truncate">{track.guideEmail}</dd>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-gray-500">Stages</dt>
            <dd>
              {track.stageCount > 0
                ? `${track.stageCount} stage${track.stageCount === 1 ? "" : "s"}`
                : "No stages yet"}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="font-medium text-gray-500">Join link</dt>
            <dd className="font-mono text-xs text-gray-500 truncate">{track.joinPath}</dd>
          </div>
          <div className="min-w-0">
            <dt className="font-medium text-gray-500">Preview</dt>
            <dd className="font-mono text-xs text-gray-500 truncate">
              {track.previewPath ?? "No stages yet"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 mt-auto">
          <CopyLinkButton value={track.joinUrl} label="Copy Join Link" variant="primary" />
          {track.previewUrl ? (
            <CopyLinkButton
              value={track.previewUrl}
              label="Copy Preview Link"
              variant="secondary"
            />
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 text-xs text-gray-400">
              Preview unavailable
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
