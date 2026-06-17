import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface BuilderComingSoonCardProps {
  trackId: string;
}

export function BuilderComingSoonCard({ trackId }: BuilderComingSoonCardProps) {
  return (
    <Card
      padding="lg"
      className="max-w-xl mx-auto text-center bg-gradient-to-br from-gray-50 to-white border-gray-200"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-2xl">
        🚧
      </div>
      <h2 className="text-xl font-semibold text-gray-900">Coming Soon</h2>
      <p className="mt-2 text-sm font-medium text-teal-700">
        This section is being prepared for the next version of the Action Track
        builder.
      </p>
      <p className="mt-4 text-sm text-gray-600 leading-relaxed">
        Soon you&apos;ll be able to customize the welcome experience and
        completion experience for this Action Track. For now, continue building
        your track details, stages, and stage elements.
      </p>
      <Button
        href={`/guide/tracks/${trackId}/stages`}
        variant="primary"
        className="mt-6"
      >
        Manage Stages
      </Button>
    </Card>
  );
}
