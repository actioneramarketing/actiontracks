import { Card } from "@/components/ui/Card";
import { demoTrack } from "@/lib/demo-data";

interface GuideProfileCardProps {
  name?: string;
  title?: string;
  bio?: string;
  compact?: boolean;
}

export function GuideProfileCard({
  name = demoTrack.guideName,
  title = demoTrack.guideTitle,
  bio = demoTrack.guideBio,
  compact = false,
}: GuideProfileCardProps) {
  return (
    <Card padding={compact ? "sm" : "md"}>
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white text-xl font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-600 mb-1">
            Your Guide
          </p>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{title}</p>
          {!compact && (
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{bio}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
