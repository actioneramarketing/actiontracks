import { PageContainer } from "@/components/layout/Nav";
import { CompletePageClient } from "@/components/tracks/CompletePageClient";
import { getStagesForTrack } from "@/lib/actions/stages";
import { getActionTrackBySlug } from "@/lib/actions/tracks";

interface PageProps {
  params: Promise<{ trackSlug: string }>;
}

export default async function CompletePage({ params }: PageProps) {
  const { trackSlug } = await params;
  const { track, error } = await getActionTrackBySlug(trackSlug);

  if (!track) {
    return (
      <PageContainer wide>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Track not found</h1>
          <p className="mt-2 text-gray-600">
            {error ?? "We could not find an Action Track with that link."}
          </p>
        </div>
      </PageContainer>
    );
  }

  const { stages } = await getStagesForTrack(track.id);

  return (
    <PageContainer wide>
      <CompletePageClient track={track} stageCount={stages.length} />
    </PageContainer>
  );
}
