import { AddStageForm } from "@/components/tracks/AddStageForm";
import { StageCard } from "@/components/tracks/StageCard";
import { BuilderPageHeader } from "@/components/builder/BuilderPageHeader";
import { EmptyState } from "@/components/builder/EmptyState";
import { AccessPendingCard } from "@/components/auth/AccessPendingCard";
import { TrackAccessDeniedCard } from "@/components/auth/TrackAccessDeniedCard";
import { GuideBuilderPageContainer } from "@/components/auth/GuideBuilderGate";
import {
  ELEMENT_TYPE_LABELS,
  filterBuilderVisibleElements,
} from "@/lib/constants/element-types";
import { getElementsForStage } from "@/lib/actions/stage-elements";
import { getStagesForTrack } from "@/lib/actions/stages";
import { requireGuideTrackAccess } from "@/lib/auth/guide";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function StagesListPage({ params }: PageProps) {
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
      <GuideBuilderPageContainer className="max-w-5xl">
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

  const track = access.track;
  const { stages, error: stagesError } = await getStagesForTrack(trackId);

  const stagesWithElements = await Promise.all(
    stages.map(async (stage) => {
      const { elements } = await getElementsForStage(stage.id);
      const elementLabels = filterBuilderVisibleElements(elements)
        .filter((el) => el.is_enabled)
        .map((el) => el.title ?? ELEMENT_TYPE_LABELS[el.element_type]);

      return {
        id: stage.id,
        number: stage.stage_number,
        title: stage.title,
        subtitle: stage.subtitle,
        stageGoal: stage.stage_goal,
        whatYoullAccomplish: stage.what_youll_accomplish,
        nextActionTitle: stage.next_action_title,
        isFinalStage: stage.is_final_stage,
        elements: elementLabels,
      };
    })
  );

  return (
    <GuideBuilderPageContainer className="max-w-5xl">
      <BuilderPageHeader
        backHref={`/guide/tracks/${trackId}/edit`}
        backLabel="Back to Edit Track"
        title="Manage Stages"
        subtitle={`${track.title} — ${stages.length} stage${stages.length === 1 ? "" : "s"}`}
        actions={
          <Button href={`/guide/tracks/${trackId}/preview`} variant="secondary">
            Preview Track
          </Button>
        }
      />

      {stagesError && (
        <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          {stagesError}
        </p>
      )}

      <AddStageForm
        trackId={trackId}
        defaultExpanded={stagesWithElements.length === 0}
      />

      {stagesWithElements.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title="No stages yet"
          description="Use the form above to add your first stage. It will become Stage 1 in your participant journey."
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Your Stages
          </h2>
          {stagesWithElements.map((stage, index) => (
            <StageCard
              key={stage.id}
              stage={stage}
              trackId={trackId}
              isFirst={index === 0}
              isLast={index === stagesWithElements.length - 1}
            />
          ))}
        </div>
      )}
    </GuideBuilderPageContainer>
  );
}
