import { ParticipantStageDashboard } from "@/components/stage-preview/ParticipantStageDashboard";
import { StageLockedCard } from "@/components/auth/StageLockedCard";
import { TrackEnrollmentRequiredCard } from "@/components/auth/TrackEnrollmentRequiredCard";
import {
  getCommitmentsForStage,
} from "@/lib/actions/commitments";
import { getParticipantKeyFromCookies } from "@/lib/participant/get-participant-key";
import {
  getJournalEntriesForTrack,
} from "@/lib/actions/journal-entries";
import {
  getParticipantTasksForStage,
} from "@/lib/actions/participant-tasks";
import { getEnabledElementsForTrack, getElementsForStage } from "@/lib/actions/stage-elements";
import { getGuideById } from "@/lib/actions/guides";
import { getStageBySlug, getStagesForTrack } from "@/lib/actions/stages";
import { getActionTrackBySlug } from "@/lib/actions/tracks";
import { requireTrackEnrollment } from "@/lib/auth/track-access";
import {
  formatReleaseDateTime,
  getNextAvailableStageLink,
  isStageReleased,
} from "@/lib/stages/release";
import { getStageCommitmentSummary } from "@/lib/utils/commitment";
import { getSafeReturnPath } from "@/lib/utils/safe-return-path";
import {
  getVisibleStageElements,
  serializeGuideForParticipant,
} from "@/lib/participant/stage-page-model";
import { serializeActionTrackForClient } from "@/lib/utils/normalize-action-track";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ trackSlug: string; stageSlug: string }>;
}

export default async function ParticipantStagePage({ params }: PageProps) {
  const { trackSlug, stageSlug } = await params;
  const { track } = await getActionTrackBySlug(trackSlug);

  if (!track) {
    notFound();
  }

  const stagePath = `/track/${trackSlug}/stages/${stageSlug}`;
  let access;
  try {
    access = await requireTrackEnrollment(track);
  } catch (error) {
    console.error("[ParticipantStagePage] Access check failed", {
      trackSlug,
      stageSlug,
      error,
    });
    return (
      <TrackEnrollmentRequiredCard
        trackTitle={track.title}
        variant="error"
      />
    );
  }

  if (access.type === "unauthenticated") {
    const returnTo = getSafeReturnPath(stagePath, "/my-tracks");
    redirect(
      `/participant/login?returnTo=${encodeURIComponent(returnTo)}`
    );
  }

  if (access.type === "denied") {
    return <TrackEnrollmentRequiredCard trackTitle={track.title} />;
  }

  if (access.type === "error") {
    return (
      <TrackEnrollmentRequiredCard
        trackTitle={track.title}
        variant="error"
      />
    );
  }

  const { stage } = await getStageBySlug(track.id, stageSlug);

  if (!stage) {
    notFound();
  }

  const { stages } = await getStagesForTrack(track.id);
  const bypassReleaseGate =
    access.type === "preview" || access.type === "site_admin_preview";

  if (!bypassReleaseGate && !isStageReleased(stage)) {
    return (
      <StageLockedCard
        trackTitle={track.title}
        stageTitle={`Stage ${stage.stage_number}: ${stage.title}`}
        releaseLabel={formatReleaseDateTime(stage.release_at)}
        availableStageHref={getNextAvailableStageLink(trackSlug, stages)}
      />
    );
  }

  const [{ elements: stageElements }, { elements: trackElements }] =
    await Promise.all([
      getElementsForStage(stage.id),
      getEnabledElementsForTrack(track.id),
    ]);

  const guide = track.guide_id ? await getGuideById(track.guide_id) : null;

  const enabledElements = getVisibleStageElements(
    stageElements.filter((el) => el.is_enabled)
  );

  const commitmentElementIds = enabledElements
    .filter((el) => el.element_type === "commitment_builder")
    .map((el) => el.id);

  const participantKey = await getParticipantKeyFromCookies();
  const [{ commitments }, { tasks: participantTasks }, { entries: trackJournalEntries }] =
    await Promise.all([
      getCommitmentsForStage(
        stage.id,
        participantKey,
        commitmentElementIds.length > 0 ? commitmentElementIds : undefined
      ),
      getParticipantTasksForStage(track.id, stage.id, participantKey),
      getJournalEntriesForTrack(track.id, participantKey),
    ]);

  const commitmentSummary = getStageCommitmentSummary(commitments);

  return (
    <ParticipantStageDashboard
      track={serializeActionTrackForClient(track)}
      stage={JSON.parse(JSON.stringify(stage)) as typeof stage}
      stages={JSON.parse(JSON.stringify(stages)) as typeof stages}
      elements={JSON.parse(JSON.stringify(enabledElements)) as typeof enabledElements}
      trackElements={JSON.parse(JSON.stringify(trackElements)) as typeof trackElements}
      guide={serializeGuideForParticipant(guide)}
      trackSlug={trackSlug}
      stageSlug={stageSlug}
      commitments={JSON.parse(JSON.stringify(commitments)) as typeof commitments}
      commitmentSummary={commitmentSummary}
      participantTasks={
        JSON.parse(JSON.stringify(participantTasks)) as typeof participantTasks
      }
      trackJournalEntries={
        JSON.parse(JSON.stringify(trackJournalEntries)) as typeof trackJournalEntries
      }
      isGuidePreview={access.type === "preview"}
      isSiteAdminPreview={access.type === "site_admin_preview"}
    />
  );
}
