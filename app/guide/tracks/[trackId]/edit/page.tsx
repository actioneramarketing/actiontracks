import { EditTrackPageClient } from "@/components/tracks/EditTrackPageClient";
import { TrackEditStatusCard } from "@/components/tracks/TrackEditStatusCard";
import { getActionTrackById } from "@/lib/actions/tracks";
import { serializeActionTrackForClient } from "@/lib/utils/normalize-action-track";
import { logEditTrackError } from "@/lib/utils/edit-track-logging";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function EditTrackPage({ params }: PageProps) {
  let trackId = "";

  try {
    let resolvedParams: { trackId: string };
    try {
      resolvedParams = await params;
      trackId = resolvedParams.trackId;
    } catch (error) {
      logEditTrackError({ trackId: "(unknown)", step: "reading params", error });
      return (
        <TrackEditStatusCard
          title="Unable to load Action Track"
          body="A server error occurred while loading this Action Track."
          trackId={trackId || undefined}
          showLogHint
        />
      );
    }

    let loadResult: Awaited<ReturnType<typeof getActionTrackById>>;
    try {
      loadResult = await getActionTrackById(trackId);
    } catch (error) {
      logEditTrackError({ trackId, step: "loading track", error });
      return (
        <TrackEditStatusCard
          title="Unable to load Action Track"
          body="A server error occurred while loading this Action Track."
          trackId={trackId}
          showLogHint
        />
      );
    }

    const { track, error } = loadResult;

    if (error) {
      logEditTrackError({
        trackId,
        step: "loading track",
        error: new Error(error),
      });
      return (
        <TrackEditStatusCard
          title="Unable to load Action Track"
          body="There was a problem loading this Action Track. Please go back and try again."
          trackId={trackId}
          showLogHint
        />
      );
    }

    if (!track) {
      return (
        <TrackEditStatusCard
          title="Action Track not found"
          body="This Action Track could not be found or may have been removed."
          trackId={trackId}
        />
      );
    }

    let normalizedTrack;
    try {
      normalizedTrack = serializeActionTrackForClient(track);
    } catch (error) {
      logEditTrackError({ trackId, step: "normalizing track", error });
      return (
        <TrackEditStatusCard
          title="Unable to load Action Track"
          body="A server error occurred while loading this Action Track."
          trackId={trackId}
          showLogHint
        />
      );
    }

    try {
      return (
        <EditTrackPageClient track={normalizedTrack} trackId={trackId} />
      );
    } catch (error) {
      logEditTrackError({ trackId, step: "rendering form data", error });
      return (
        <TrackEditStatusCard
          title="Unable to load Action Track"
          body="A server error occurred while loading this Action Track."
          trackId={trackId}
          showLogHint
        />
      );
    }
  } catch (error) {
    logEditTrackError({ trackId: trackId || "(unknown)", step: "loading related data", error });
    return (
      <TrackEditStatusCard
        title="Unable to load Action Track"
        body="A server error occurred while loading this Action Track."
        trackId={trackId || undefined}
        showLogHint
      />
    );
  }
}
