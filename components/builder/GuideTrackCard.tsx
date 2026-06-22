import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ActionTrackListItem } from "@/lib/types/database";

const TRACK_TYPE_LABELS: Record<string, string> = {
  live_guided: "Live Guided",
  cohort: "Cohort",
  "self-paced": "Self-Paced",
  hybrid: "Hybrid",
};

function formatTrackType(value: string): string {
  return TRACK_TYPE_LABELS[value] ?? value.replace(/_/g, " ");
}

function formatDate(value: string): string | null {
  if (!value.trim()) {
    return null;
  }
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) {
    return value;
  }
  return new Date(`${match[1]}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface GuideTrackCardProps {
  track: ActionTrackListItem;
}

export function GuideTrackCard({ track }: GuideTrackCardProps) {
  const startLabel = formatDate(track.startDate);
  const endLabel = formatDate(track.endDate);
  const trackTypeLabel = track.trackType
    ? formatTrackType(track.trackType)
    : null;

  return (
    <Card padding="none" className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-gradient-to-br from-teal-50 via-gray-50 to-violet-50 border-b border-gray-100">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-3xl mb-2 opacity-80" aria-hidden>
            🎯
          </span>
          <p className="text-xs font-medium text-gray-500">Track Image Coming Soon</p>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
            {track.title}
          </h3>
          <StatusBadge status={track.status} />
        </div>

        <p className="text-sm text-gray-600 flex-1 mb-4 line-clamp-3">
          {track.shortDescription || "No description yet."}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 mb-5">
          {track.durationWeeks > 0 ? (
            <span className="inline-flex items-center gap-1">
              <span className="text-teal-600">📅</span>
              {track.durationWeeks} week{track.durationWeeks === 1 ? "" : "s"}
            </span>
          ) : null}
          {trackTypeLabel ? (
            <span className="inline-flex items-center gap-1">
              <span className="text-teal-600">🏷</span>
              {trackTypeLabel}
            </span>
          ) : null}
          {startLabel ? <span>Starts {startLabel}</span> : null}
          {endLabel ? <span>Ends {endLabel}</span> : null}
        </div>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 mt-auto">
          <Button href={`/guide/tracks/${track.id}/edit`} variant="primary" size="sm">
            Edit
          </Button>
          <Button href={`/guide/tracks/${track.id}/stages`} variant="secondary" size="sm">
            Stages
          </Button>
          <Button href={`/guide/tracks/${track.id}/preview`} variant="accent" size="sm">
            Preview
          </Button>
        </div>
      </div>
    </Card>
  );
}
