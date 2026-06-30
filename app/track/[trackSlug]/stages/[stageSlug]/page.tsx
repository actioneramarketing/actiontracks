import { ParticipantStageDashboard } from "@/components/stage-preview/ParticipantStageDashboard";
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
import { getStageCommitmentSummary } from "@/lib/utils/commitment";
import {
  getVisibleStageElements,
  serializeGuideForParticipant,
} from "@/lib/participant/stage-page-model";
import { serializeActionTrackForClient } from "@/lib/utils/normalize-action-track";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ trackSlug: string; stageSlug: string }>;
}

export default async function ParticipantStagePage({ params }: PageProps) {
  const { trackSlug, stageSlug } = await params;
  const { track } = await getActionTrackBySlug(trackSlug);

  if (!track) {
    notFound();
  }

  const { stage } = await getStageBySlug(track.id, stageSlug);

  if (!stage) {
    notFound();
  }

  const [{ stages }, { elements: stageElements }, { elements: trackElements }] =
    await Promise.all([
      getStagesForTrack(track.id),
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
    />
  );
}
