import { StageBuilderClient } from "@/components/tracks/StageBuilderClient";
import { getElementsForStage } from "@/lib/actions/stage-elements";
import { getStageById } from "@/lib/actions/stages";
import { AccessPendingCard } from "@/components/auth/AccessPendingCard";
import { TrackAccessDeniedCard } from "@/components/auth/TrackAccessDeniedCard";
import { GuideBuilderPageContainer } from "@/components/auth/GuideBuilderGate";
import { requireGuideTrackAccess } from "@/lib/auth/guide";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ trackId: string; stageId: string }>;
}

export default async function StageBuilderPage({ params }: PageProps) {
  const { trackId, stageId } = await params;

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
        <div className="py-16 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Track not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            {access.error ?? "We could not find this Action Track."}
          </p>
          <Link
            href="/guide/tracks"
            className="mt-4 inline-block text-sm text-teal-700 hover:underline"
          >
            Back to Manage Action Tracks
          </Link>
        </div>
      </GuideBuilderPageContainer>
    );
  }

  const { stage, error: stageError } = await getStageById(stageId);

  if (!stage || stage.track_id !== trackId) {
    return (
      <GuideBuilderPageContainer>
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
      </GuideBuilderPageContainer>
    );
  }

  const { elements } = await getElementsForStage(stageId);

  return (
    <StageBuilderClient
      track={access.track}
      stage={stage}
      elements={elements}
      trackId={trackId}
      stageId={stageId}
    />
  );
}
