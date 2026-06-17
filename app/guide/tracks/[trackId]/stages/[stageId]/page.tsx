import { StageBuilderClient } from "@/components/tracks/StageBuilderClient";
import { getElementsForStage } from "@/lib/actions/stage-elements";
import { getStageById } from "@/lib/actions/stages";
import { getActionTrackById } from "@/lib/actions/tracks";
import { PageContainer } from "@/components/layout/Nav";
import Link from "next/link";

interface PageProps {
  params: Promise<{ trackId: string; stageId: string }>;
}

export default async function StageBuilderPage({ params }: PageProps) {
  const { trackId, stageId } = await params;

  const [{ track, error: trackError }, { stage, error: stageError }] =
    await Promise.all([
      getActionTrackById(trackId),
      getStageById(stageId),
    ]);

  if (!track) {
    return (
      <PageContainer>
        <div className="py-16 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Track not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            {trackError ?? "We could not find this Action Track."}
          </p>
          <Link
            href="/guide/tracks"
            className="mt-4 inline-block text-sm text-teal-700 hover:underline"
          >
            Back to Manage Action Tracks
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (!stage || stage.track_id !== trackId) {
    return (
      <PageContainer>
        <div className="py-16 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Stage not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            {stageError ?? "We could not find this stage for the track."}
          </p>
          <Link
            href={`/guide/tracks/${trackId}/stages`}
            className="mt-4 inline-block text-sm text-teal-700 hover:underline"
          >
            Back to Stages
          </Link>
        </div>
      </PageContainer>
    );
  }

  const { elements } = await getElementsForStage(stageId);

  return (
    <StageBuilderClient
      track={track}
      stage={stage}
      elements={elements}
      trackId={trackId}
      stageId={stageId}
    />
  );
}
