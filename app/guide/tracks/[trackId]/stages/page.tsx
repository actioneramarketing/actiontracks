import { PageContainer } from "@/components/layout/Nav";
import { AddStageForm } from "@/components/tracks/AddStageForm";
import { StageCard } from "@/components/tracks/StageCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getElementsForStage } from "@/lib/actions/stage-elements";
import { getStagesForTrack } from "@/lib/actions/stages";
import { getActionTrackById } from "@/lib/actions/tracks";
import { ELEMENT_TYPE_LABELS } from "@/lib/constants/element-types";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function StagesListPage({ params }: PageProps) {
  const { trackId } = await params;
  const { track, error: trackError } = await getActionTrackById(trackId);

  if (!track) {
    if (trackError) {
      return (
        <PageContainer>
          <p className="text-sm text-gray-600">{trackError}</p>
        </PageContainer>
      );
    }
    notFound();
  }

  const { stages, error: stagesError } = await getStagesForTrack(trackId);

  const stagesWithElements = await Promise.all(
    stages.map(async (stage) => {
      const { elements } = await getElementsForStage(stage.id);
      const elementLabels = elements
        .filter((el) => el.is_enabled)
        .map((el) => el.title ?? ELEMENT_TYPE_LABELS[el.element_type]);

      return {
        id: stage.id,
        number: stage.stage_number,
        title: stage.title,
        subtitle: stage.subtitle,
        stageGoal: stage.stage_goal,
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
        description={`${track.title} — ${stages.length} stages`}
        action={<AddStageForm trackId={trackId} />}
        className="mb-8"
      />

      {stagesError && (
        <p className="mb-4 text-sm text-amber-700">{stagesError}</p>
      )}

      {stagesWithElements.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-600">
          No stages yet. Click Add Stage to create the first one.
        </div>
      ) : (
        <div className="space-y-4">
          {stagesWithElements.map((stage) => (
            <StageCard key={stage.id} stage={stage} trackId={trackId} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
