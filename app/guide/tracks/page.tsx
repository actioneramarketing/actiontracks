import { PageContainer } from "@/components/layout/Nav";
import { DemoTrackCard } from "@/components/tracks/DemoTrackCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { libraryTracks } from "@/lib/demo-data";

export default function GuideTracksPage() {
  const guideTracks = libraryTracks.slice(0, 2);

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

      <div className="grid sm:grid-cols-2 gap-6">
        {guideTracks.map((track) => (
          <DemoTrackCard
            key={track.slug}
            track={track}
            variant="guide"
            trackId="demo-track"
          />
        ))}
      </div>
    </PageContainer>
  );
}
