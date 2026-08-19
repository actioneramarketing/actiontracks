import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { EnrolledTrackView } from "@/lib/actions/enrollments";
import { getTrackInitials } from "@/lib/utils/action-track-assets";

function formatDate(value: string): string | null {
  if (!value.trim()) {
    return null;
  }
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return value;
    }
    return new Date(parsed).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return new Date(`${match[1]}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatEnrollmentStatus(status: string): string {
  const normalized = status.trim() || "active";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

interface EnrolledTrackCardProps {
  item: EnrolledTrackView;
}

export function EnrolledTrackCard({ item }: EnrolledTrackCardProps) {
  const { track, enrollment, firstStageSlug, hasStages, nextReleaseLabel } = item;
  const initials = getTrackInitials(track.title);
  const startLabel = formatDate(enrollment.access_starts_at);
  const endLabel = formatDate(enrollment.access_ends_at);
  const status = enrollment.status.trim().toLowerCase() || "active";
  const isPaused = status === "paused";
  const continueHref =
    !isPaused && track.slug.trim() && firstStageSlug
      ? `/track/${track.slug.trim()}/stages/${firstStageSlug}`
      : null;

  return (
    <Card padding="none" className="flex flex-col h-full overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-teal-50 via-gray-50 to-violet-50 border-b border-gray-100">
        {track.track_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.track_image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-3xl mb-2 opacity-80" aria-hidden>
              🎯
            </span>
            <p className="text-xs font-medium text-gray-500">Track Image Coming Soon</p>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-teal-50 text-sm font-bold text-teal-700">
              {track.track_icon_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.track_icon_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
              {track.title}
            </h3>
          </div>
          <Badge variant={isPaused ? "warning" : "success"}>
            {formatEnrollmentStatus(enrollment.status)}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 flex-1 mb-4 line-clamp-3">
          {track.short_description || "No description yet."}
        </p>

        {(startLabel || endLabel) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-5">
            {startLabel ? <span>Access starts {startLabel}</span> : null}
            {endLabel ? <span>Access ends {endLabel}</span> : null}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 mt-auto">
          {isPaused ? (
            <Button type="button" variant="secondary" size="sm" disabled>
              Access paused
            </Button>
          ) : continueHref ? (
            <Button href={continueHref} variant="primary" size="sm">
              Continue
            </Button>
          ) : hasStages ? (
            <div>
              <Button type="button" variant="secondary" size="sm" disabled>
                Starts Soon
              </Button>
              {nextReleaseLabel ? (
                <p className="mt-2 text-xs text-gray-500">
                  First stage unlocks {nextReleaseLabel}
                </p>
              ) : null}
            </div>
          ) : (
            <Button type="button" variant="secondary" size="sm" disabled>
              No stages yet.
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
