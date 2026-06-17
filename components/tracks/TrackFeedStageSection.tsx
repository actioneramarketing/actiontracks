import { Card } from "@/components/ui/Card";

export function TrackFeedStageSection() {
  return (
    <Card padding="sm">
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">💬</span>
        <div>
          <h4 className="font-medium text-gray-900">Track Feed</h4>
          <p className="text-sm text-gray-500 mt-0.5">
            Share updates, questions, wins, and progress with your guide and
            others in this Action Track.
          </p>
          <p className="text-sm text-gray-400 italic mt-3">
            Track Feed posting is coming soon.
          </p>
        </div>
      </div>
    </Card>
  );
}
