import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface StageLockedCardProps {
  trackTitle: string;
  stageTitle: string;
  releaseLabel: string | null;
  availableStageHref?: string | null;
}

export function StageLockedCard({
  trackTitle,
  stageTitle,
  releaseLabel,
  availableStageHref,
}: StageLockedCardProps) {
  return (
    <PageContainer>
      <Card padding="lg" className="max-w-xl mx-auto text-center shadow-md">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700 border border-amber-100">
          <span aria-hidden="true">🔒</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Stage Locked</h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          This stage is scheduled to unlock soon.
        </p>
        <p className="mt-4 text-sm font-medium text-gray-900">{trackTitle}</p>
        <p className="mt-1 text-sm text-gray-700">{stageTitle}</p>
        {releaseLabel ? (
          <p className="mt-3 text-sm text-teal-800 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
            Unlocks {releaseLabel}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/my-tracks" variant="primary">
            Back to My Tracks
          </Button>
          {availableStageHref ? (
            <Button href={availableStageHref} variant="secondary">
              Go to Available Stage
            </Button>
          ) : null}
        </div>
      </Card>
    </PageContainer>
  );
}
