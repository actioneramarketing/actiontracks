import { EditTrackPageClient } from "@/components/tracks/EditTrackPageClient";
import { TrackEditStatusCard } from "@/components/tracks/TrackEditStatusCard";
import { AccessPendingCard } from "@/components/auth/AccessPendingCard";
import { TrackAccessDeniedCard } from "@/components/auth/TrackAccessDeniedCard";
import { requireGuideTrackAccess } from "@/lib/auth/guide";
import { serializeActionTrackForClient } from "@/lib/utils/normalize-action-track";
import { logEditTrackError } from "@/lib/utils/edit-track-logging";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function EditTrackPage({ params }: PageProps) {
  let trackId = "";

  try {
    const resolvedParams = await params;
    trackId = resolvedParams.trackId;

    const access = await requireGuideTrackAccess(trackId);
    if (access.type === "redirect") {
      redirect(access.to);
    }
    if (access.type === "pending") {
      return <AccessPendingCard />;
    }
    if (access.type === "denied") {
      return <TrackAccessDeniedCard />;
    }
    if (access.type === "not_found") {
      return (
        <TrackEditStatusCard
          title="Action Track not found"
          body={
            access.error ??
            "This Action Track could not be found or may have been removed."
          }
          trackId={trackId}
        />
      );
    }

    let normalizedTrack;
    try {
      normalizedTrack = serializeActionTrackForClient(access.track);
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

    return (
      <EditTrackPageClient track={normalizedTrack} trackId={trackId} />
    );
  } catch (error) {
    logEditTrackError({
      trackId: trackId || "(unknown)",
      step: "loading related data",
      error,
    });
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
