import { PageContainer } from "@/components/layout/PageContainer";
import {
  TrackJoinView,
  formatTrackStartDate,
} from "@/components/join/TrackJoinView";
import { getEnrollmentForTrackUser } from "@/lib/actions/enrollments";
import { getGuideById } from "@/lib/actions/guides";
import { getStagesForTrack } from "@/lib/actions/stages";
import { getActionTrackBySlug } from "@/lib/actions/tracks";
import { getCurrentUser } from "@/lib/auth/guide";
import { requireParticipant } from "@/lib/auth/participant";
import {
  formatReleaseDateTime,
  getFirstAvailableStage,
  getNextUpcomingReleaseAt,
} from "@/lib/stages/release";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ trackSlug: string }>;
}

export default async function TrackJoinPage({ params }: PageProps) {
  const { trackSlug } = await params;
  const { track } = await getActionTrackBySlug(trackSlug);

  if (!track) {
    notFound();
  }

  const joinPath = `/join/${track.slug}`;
  const [guide, stagesResult, user] = await Promise.all([
    track.guide_id ? getGuideById(track.guide_id) : Promise.resolve(null),
    getStagesForTrack(track.id),
    getCurrentUser(),
  ]);

  const stages = stagesResult.stages;
  const firstReleased = getFirstAvailableStage(stages);
  const continueHref =
    firstReleased?.slug?.trim()
      ? `/track/${track.slug}/stages/${firstReleased.slug.trim()}`
      : null;
  const waitingReleaseLabel = formatReleaseDateTime(
    getNextUpcomingReleaseAt(stages)
  );

  const trackView = {
    title: track.title,
    slug: track.slug,
    shortDescription: track.short_description,
    primaryOutcome: track.primary_outcome,
    startDateLabel: formatTrackStartDate(track.start_date),
    trackImageUrl: track.track_image_url,
    trackIconUrl: track.track_icon_url,
    joinPath,
    guide: guide
      ? {
          fullName: guide.full_name,
          profileHeadline: guide.profile_headline,
          imageUrl: guide.profile_image_url || guide.avatar_url,
        }
      : null,
  };

  if (!user?.email) {
    return (
      <PageContainer>
        <TrackJoinView track={trackView} mode={{ kind: "anonymous" }} />
      </PageContainer>
    );
  }

  let participantResult;
  try {
    participantResult = await requireParticipant();
  } catch (error) {
    console.error("[TrackJoinPage] Participant profile setup failed", {
      trackSlug,
      userId: user.id,
      error,
    });
    return (
      <PageContainer>
        <TrackJoinView track={trackView} mode={{ kind: "join" }} />
      </PageContainer>
    );
  }

  if (participantResult.status === "unauthenticated") {
    return (
      <PageContainer>
        <TrackJoinView track={trackView} mode={{ kind: "anonymous" }} />
      </PageContainer>
    );
  }

  const { enrollment, error } = await getEnrollmentForTrackUser(
    track.id,
    participantResult.user.id
  );

  if (error) {
    console.error("[TrackJoinPage] Enrollment lookup failed", {
      trackSlug,
      userId: participantResult.user.id,
    });
  }

  if (enrollment && enrollment.status.trim().toLowerCase() !== "active") {
    return (
      <PageContainer>
        <TrackJoinView track={trackView} mode={{ kind: "revoked" }} />
      </PageContainer>
    );
  }

  if (enrollment) {
    if (!stages.length) {
      return (
        <PageContainer>
          <TrackJoinView track={trackView} mode={{ kind: "no_stages" }} />
        </PageContainer>
      );
    }

    if (!continueHref) {
      return (
        <PageContainer>
          <TrackJoinView
            track={trackView}
            mode={{ kind: "waiting", releaseLabel: waitingReleaseLabel }}
          />
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <TrackJoinView
          track={trackView}
          mode={{ kind: "continue", href: continueHref }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TrackJoinView track={trackView} mode={{ kind: "join" }} />
    </PageContainer>
  );
}
