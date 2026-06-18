import { EditTrackPageClient } from "@/components/tracks/EditTrackPageClient";
import { TrackEditStatusCard } from "@/components/tracks/TrackEditStatusCard";
import { getActionTrackById } from "@/lib/actions/tracks";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function EditTrackPage({ params }: PageProps) {
  const { trackId } = await params;
  const { track, error } = await getActionTrackById(trackId);

  if (error) {
    return (
      <TrackEditStatusCard
        title="Unable to load Action Track"
        body="There was a problem loading this Action Track. Please go back and try again."
      />
    );
  }

  if (!track) {
    return (
      <TrackEditStatusCard
        title="Action Track not found"
        body="This Action Track could not be found or may have been removed."
      />
    );
  }

  return <EditTrackPageClient track={track} trackId={trackId} />;
}
