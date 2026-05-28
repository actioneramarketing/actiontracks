import { cn } from "@/lib/utils";
import { DemoStage } from "@/lib/demo-data";

interface RoadmapProps {
  stages: DemoStage[];
  currentStage?: number;
}

export function Roadmap({ stages, currentStage = 1 }: RoadmapProps) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
      <ul className="space-y-4">
        {stages.map((stage) => {
          const isComplete = stage.number < currentStage;
          const isCurrent = stage.number === currentStage;

          return (
            <li key={stage.id} className="relative flex items-start gap-4 pl-0">
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-4 ring-white",
                  isComplete && "bg-teal-600 text-white",
                  isCurrent && "bg-violet-600 text-white",
                  !isComplete && !isCurrent && "bg-gray-100 text-gray-400"
                )}
              >
                {isComplete ? "✓" : stage.number}
              </div>
              <div className="pt-1.5">
                <p
                  className={cn(
                    "font-medium",
                    isCurrent ? "text-violet-700" : "text-gray-900"
                  )}
                >
                  {stage.title}
                </p>
                <p className="text-sm text-gray-500">{stage.shortGoal}</p>
                {isCurrent && (
                  <span className="mt-1 inline-block text-xs font-medium text-violet-600">
                    Current Stage
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
