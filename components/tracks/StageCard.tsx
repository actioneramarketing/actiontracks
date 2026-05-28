import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DemoStage } from "@/lib/demo-data";

interface StageCardProps {
  stage: DemoStage;
  trackId: string;
}

export function StageCard({ stage, trackId }: StageCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-sm">
          {stage.number}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{stage.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{stage.shortGoal}</p>

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

          <div className="mt-4">
            <Button
              href={`/guide/tracks/${trackId}/stages/${stage.id}`}
              variant="secondary"
              size="sm"
            >
              Edit Stage
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
