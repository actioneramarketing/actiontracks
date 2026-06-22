import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AccessPendingCard } from "@/components/auth/AccessPendingCard";
import { TrackAccessDeniedCard } from "@/components/auth/TrackAccessDeniedCard";
import { GuideBuilderPageContainer } from "@/components/auth/GuideBuilderGate";
import { getStagesForTrack } from "@/lib/actions/stages";
import { requireGuideTrackAccess } from "@/lib/auth/guide";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function TrackPreviewPage({ params }: PageProps) {
  const { trackId } = await params;
  const access = await requireGuideTrackAccess(trackId);

  if (access.type === "redirect") {
    redirect(access.to);
  }
  if (access.type === "pending") {
    return <AccessPendingCard />;
  }
  if (access.type === "denied") {
    return <TrackAccessDeniedCard />;
  }
  if (access.type === "not_found") {
    return (
      <GuideBuilderPageContainer>
        <p className="text-sm text-gray-600">
          {access.error ?? "Track not found."}
        </p>
      </GuideBuilderPageContainer>
    );
  }

  const track = access.track;
  const { stages } = await getStagesForTrack(trackId);
  const firstStage = stages[0];

  return (
    <GuideBuilderPageContainer>
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
        Preview the participant experience for {track.title}.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-2">Welcome Page</h3>
          <p className="text-sm text-gray-600 mb-4">
            The first page participants see when joining the track.
          </p>
          <Button
            href={`/track/${track.slug}/welcome`}
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
            href={`/track/${track.slug}/complete`}
            variant="primary"
            size="sm"
          >
            Preview Completion
          </Button>
        </Card>
      </div>

      {firstStage && (
        <Card className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">First Stage</h3>
          <p className="text-sm text-gray-600 mb-4">
            Stage {firstStage.stage_number}: {firstStage.title}
          </p>
          <Button
            href={`/track/${track.slug}/stages/${firstStage.slug}`}
            variant="secondary"
            size="sm"
          >
            Preview First Stage
          </Button>
        </Card>
      )}

      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Stage Previews</h3>
        {stages.length === 0 ? (
          <p className="text-sm text-gray-500">No stages created yet.</p>
        ) : (
          <div className="space-y-2">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Stage {stage.stage_number}: {stage.title}
                  </span>
                  <p className="text-xs text-gray-500">
                    {stage.subtitle ?? stage.stage_goal}
                  </p>
                </div>
                <Button
                  href={`/track/${track.slug}/stages/${stage.slug}`}
                  variant="secondary"
                  size="sm"
                >
                  Preview
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </GuideBuilderPageContainer>
  );
}
