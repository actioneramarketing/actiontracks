import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ActionTrackListItem } from "@/lib/types/database";

interface DemoTrackCardProps {
  track: ActionTrackListItem;
  variant?: "library" | "guide";
}

export function DemoTrackCard({
  track,
  variant = "library",
}: DemoTrackCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {track.title}
        </h3>
        <StatusBadge status={track.status} />
      </div>

      <p className="text-sm text-gray-600 flex-1 mb-4">{track.shortDescription}</p>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-5">
        <span className="flex items-center gap-1">
          <span className="text-teal-600">👤</span> {track.guideName}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-teal-600">📅</span> {track.durationWeeks} weeks
        </span>
      </div>

      {variant === "library" ? (
        <Button
          href={`/track/${track.slug}/welcome`}
          variant="primary"
          size="sm"
          className="w-full"
        >
          View Action Track
        </Button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button href={`/guide/tracks/${track.id}/edit`} variant="secondary" size="sm">
            Edit
          </Button>
          <Button href={`/guide/tracks/${track.id}/stages`} variant="secondary" size="sm">
            Stages
          </Button>
          <Button href={`/guide/tracks/${track.id}/preview`} variant="accent" size="sm">
            Preview
          </Button>
        </div>
      )}
    </Card>
  );
}
