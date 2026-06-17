import { StageBuilderClient } from "@/components/tracks/StageBuilderClient";
import { getElementsForStage } from "@/lib/actions/stage-elements";
import { getStageById } from "@/lib/actions/stages";
import { getActionTrackById } from "@/lib/actions/tracks";
import { notFound } from "next/navigation";

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

  if (!track || !stage || stage.action_track_id !== trackId) {
    if (trackError || stageError) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Unable to load stage
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {trackError ?? stageError}
          </p>
        </div>
      );
    }
    notFound();
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
