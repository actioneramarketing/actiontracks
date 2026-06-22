import { GuideTrackCard } from "@/components/builder/GuideTrackCard";
import { BuilderPageHeader } from "@/components/builder/BuilderPageHeader";
import { EmptyState } from "@/components/builder/EmptyState";
import { Button } from "@/components/ui/Button";
import { GuideBuilderPageContainer } from "@/components/auth/GuideBuilderGate";
import { requireGuide } from "@/lib/auth/guide";
import { getActionTracksForGuide } from "@/lib/actions/tracks";

async function GuideTracksContent() {
  const auth = await requireGuide();
  if (auth.status !== "approved") {
    return null;
  }

  const { tracks, error } = await getActionTracksForGuide(auth.guide.id);

  return (
    <>
      <BuilderPageHeader
        title="Manage Action Tracks"
        subtitle="Create and manage the guided journeys connected to your guide profile."
        actions={
          <Button href="/guide/tracks/new" variant="primary">
            Create New Action Track
          </Button>
        }
      />

      {error && (
        <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {tracks.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No Action Tracks yet"
          description="Create your first Action Track to start building stages, elements, and participant journeys."
          actionLabel="Create Your First Action Track"
          actionHref="/guide/tracks/new"
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <GuideTrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </>
  );
}

export default async function GuideTracksPage() {
  return (
    <GuideBuilderPageContainer className="max-w-6xl">
      <GuideTracksContent />
    </GuideBuilderPageContainer>
  );
}
