import { PageContainer } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { demoTrack, demoStages } from "@/lib/demo-data";
import Link from "next/link";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function TrackPreviewPage({ params }: PageProps) {
  const { trackId } = await params;

  return (
    <PageContainer>
      <div className="mb-6">
        <Link
          href={`/guide/tracks/${trackId}/edit`}
          className="text-sm text-gray-500 hover:text-teal-700"
        >
          ← Back to Edit Track
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Preview</h1>
      <p className="text-gray-600 mb-8">
        Preview the participant experience for {demoTrack.title}.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-2">Welcome Page</h3>
          <p className="text-sm text-gray-600 mb-4">
            The first page participants see when joining the track.
          </p>
          <Button
            href={`/track/${demoTrack.slug}/welcome`}
            variant="primary"
            size="sm"
          >
            Preview Welcome
          </Button>
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-900 mb-2">Completion Page</h3>
          <p className="text-sm text-gray-600 mb-4">
            The final page after completing all stages.
          </p>
          <Button
            href={`/track/${demoTrack.slug}/complete`}
            variant="primary"
            size="sm"
          >
            Preview Completion
          </Button>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Stage Previews</h3>
        <div className="space-y-2">
          {demoStages.map((stage) => (
            <div
              key={stage.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Stage {stage.number}: {stage.title}
                </span>
                <p className="text-xs text-gray-500">{stage.shortGoal}</p>
              </div>
              <Button
                href={`/track/${demoTrack.slug}/stages/${stage.slug}`}
                variant="secondary"
                size="sm"
              >
                Preview
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
