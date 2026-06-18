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
    <Card>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-sm">
          {stage.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{stage.title}</h3>
            {stage.isFinalStage && (
              <Badge variant="purple">Final Stage</Badge>
            )}
          </div>
          {summary && (
            <p className="text-sm text-gray-500 mt-0.5">{summary}</p>
          )}
          {stage.whatYoullAccomplish && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium text-gray-700">Accomplish: </span>
              {stage.whatYoullAccomplish}
            </p>
          )}
          {stage.nextActionTitle && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium text-gray-700">Next action: </span>
              {stage.nextActionTitle}
            </p>
          )}

          {stage.elements.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {stage.elements.map((el) => (
                <span
                  key={el}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-600 ring-1 ring-gray-200"
                >
                  {el}
                </span>
              ))}
            </div>
          )}

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
