import { PageContainer } from "@/components/layout/Nav";
import { DemoTrackCard } from "@/components/tracks/DemoTrackCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { libraryTracks } from "@/lib/demo-data";

export default function LibraryPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Action Tracks Library"
        description="Browse available guided implementation journeys."
        action={
          <Button href="/guide/tracks" variant="accent">
            Manage / Create Action Track
          </Button>
        }
        className="mb-8"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraryTracks.map((track) => (
          <DemoTrackCard key={track.slug} track={track} variant="library" />
        ))}
      </div>
    </PageContainer>
  );
}
