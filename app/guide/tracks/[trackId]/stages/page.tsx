import { PageContainer } from "@/components/layout/Nav";
import { AddStageForm } from "@/components/tracks/AddStageForm";
import { StageCard } from "@/components/tracks/StageCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  ELEMENT_TYPE_LABELS,
  filterBuilderVisibleElements,
} from "@/lib/constants/element-types";
import { getElementsForStage } from "@/lib/actions/stage-elements";
import { getStagesForTrack } from "@/lib/actions/stages";
import { getActionTrackById } from "@/lib/actions/tracks";
import Link from "next/link";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function StagesListPage({ params }: PageProps) {
  const { trackId } = await params;
  const { track, error: trackError } = await getActionTrackById(trackId);

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
    <PageContainer>
      <div className="mb-6">
        <Link
          href={`/guide/tracks/${trackId}/edit`}
          className="text-sm text-gray-500 hover:text-teal-700"
        >
          ← Back to Edit Track
        </Link>
      </div>

      <SectionHeader
        title="Manage Stages"
        description={`${track.title} — ${stages.length} stage${stages.length === 1 ? "" : "s"}`}
        className="mb-6"
      />

      {stagesError && (
        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          {stagesError}
        </p>
      )}

      <AddStageForm trackId={trackId} />

      {stagesWithElements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No stages yet</h2>
          <p className="mt-2 text-sm text-gray-600">
            Use the form above to add your first stage. It will become Stage 1.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
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
    </PageContainer>
  );
}
