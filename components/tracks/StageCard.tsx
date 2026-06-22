import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StageCardControls } from "@/components/tracks/StageCardControls";

export interface StageCardData {
  id: string;
  number: number;
  title: string;
  subtitle?: string | null;
  stageGoal?: string | null;
  whatYoullAccomplish?: string | null;
  nextActionTitle?: string | null;
  isFinalStage?: boolean;
  elements: string[];
}

interface StageCardProps {
  stage: StageCardData;
  trackId: string;
  isFirst: boolean;
  isLast: boolean;
}

export function StageCard({ stage, trackId, isFirst, isLast }: StageCardProps) {
  const summary = stage.subtitle ?? stage.stageGoal ?? "";

  return (
    <Card padding="lg" className="shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-base ring-4 ring-teal-50">
          {stage.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{stage.title}</h3>
            {stage.isFinalStage && (
              <Badge variant="purple">Final Stage</Badge>
            )}
          </div>
          {summary ? (
            <p className="text-sm text-gray-500">{summary}</p>
          ) : null}

          {stage.whatYoullAccomplish ? (
            <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5 border border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                What You&apos;ll Accomplish
              </p>
              <p className="text-sm text-gray-700 line-clamp-2">
                {stage.whatYoullAccomplish}
              </p>
            </div>
          ) : null}

          {stage.nextActionTitle ? (
            <div className="mt-2 rounded-lg bg-teal-50/60 px-3 py-2.5 border border-teal-100/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 mb-1">
                Next Action
              </p>
              <p className="text-sm text-gray-800">{stage.nextActionTitle}</p>
            </div>
          ) : null}

          {stage.elements.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Elements</p>
              <div className="flex flex-wrap gap-1.5">
                {stage.elements.map((el) => (
                  <span
                    key={el}
                    className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs text-gray-600 ring-1 ring-gray-200"
                  >
                    {el}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <StageCardControls
            trackId={trackId}
            stageId={stage.id}
            isFirst={isFirst}
            isLast={isLast}
          />
        </div>
      </div>
    </Card>
  );
}
