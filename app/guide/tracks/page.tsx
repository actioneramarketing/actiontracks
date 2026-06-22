import { DemoTrackCard } from "@/components/tracks/DemoTrackCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
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
      <SectionHeader
        title="Manage Action Tracks"
        description="Create and manage your guided implementation journeys."
        action={
          <Button href="/guide/tracks/new" variant="primary">
            Create New Action Track
          </Button>
        }
        className="mb-8"
      />

      {error && (
        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {tracks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No Action Tracks yet
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your first Action Track to start building stages and elements.
          </p>
          <Button href="/guide/tracks/new" variant="primary" className="mt-6">
            Create Your First Action Track
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {tracks.map((track) => (
            <DemoTrackCard key={track.id} track={track} variant="guide" />
          ))}
        </div>
      )}
    </>
  );
}

export default async function GuideTracksPage() {
  return (
    <GuideBuilderPageContainer>
      <GuideTracksContent />
    </GuideBuilderPageContainer>
  );
}
