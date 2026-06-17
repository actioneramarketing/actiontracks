import { PageContainer } from "@/components/layout/Nav";
import { DemoTrackCard } from "@/components/tracks/DemoTrackCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getActionTracks } from "@/lib/actions/tracks";
import { libraryTracks } from "@/lib/demo-data";

export default async function GuideTracksPage() {
  const { tracks, error } = await getActionTracks();
  const useDemoFallback = tracks.length === 0 && Boolean(error);
  const displayTracks = useDemoFallback
    ? libraryTracks.slice(0, 2).map((track) => ({
        id: "demo-track",
        slug: track.slug,
        title: track.title,
        shortDescription: track.shortDescription,
        guideName: track.guideName,
        durationWeeks: track.durationWeeks,
        status: track.status,
      }))
    : tracks;

  return (
    <PageContainer>
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

      {error && !useDemoFallback && (
        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {displayTracks.length === 0 ? (
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
        <>
          {useDemoFallback && (
            <p className="mb-4 text-sm text-gray-500">
              Showing demo tracks because Supabase is unavailable.
            </p>
          )}
          <div className="grid sm:grid-cols-2 gap-6">
            {displayTracks.map((track) => (
              <DemoTrackCard key={track.id} track={track} variant="guide" />
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
