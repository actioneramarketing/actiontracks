"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ActionTrackStage, GuideProfile, StageElement } from "@/lib/types/database";
import { NormalizedActionTrack } from "@/lib/utils/normalize-action-track";
import {
  collectLiveCallEvents,
  getAiMentorElement,
  getJournalElement,
  getNextActionCopy,
  getStageAccomplishmentText,
  getStartHereBody,
  getUnlockSubtitle,
  getVisibleStageElements,
} from "@/lib/participant/stage-page-model";
import { buildSidebarPendingTasks } from "@/lib/utils/participant-tasks";
import type { ParticipantTaskRowView } from "@/lib/utils/participant-tasks";
import { ParticipantStageFeedPlaceholder } from "./ParticipantStageFeedPlaceholder";
import { ParticipantStageHeader } from "./ParticipantStageHeader";
import {
  ParticipantModalType,
  ParticipantStageModals,
} from "./ParticipantStageModals";
import { ParticipantStageSidebar } from "./ParticipantStageSidebar";
import { StageElementCard } from "./StageElementCard";
import type { ParticipantCommitmentView } from "@/lib/utils/commitment";
import {
  buildJournalReviewItems,
  type JournalEntryReviewItem,
  type ParticipantJournalEntryView,
} from "@/lib/utils/journal-entries";
import "./stage-dashboard-preview.css";

export interface ParticipantStageDashboardProps {
  track: NormalizedActionTrack;
  stage: ActionTrackStage;
  stages: ActionTrackStage[];
  elements: StageElement[];
  trackElements: StageElement[];
  guide: GuideProfile | null;
  trackSlug: string;
  stageSlug: string;
  commitments: ParticipantCommitmentView[];
  commitmentSummary: string | null;
  participantTasks: ParticipantTaskRowView[];
  trackJournalEntries: ParticipantJournalEntryView[];
}

export function ParticipantStageDashboard({
  track,
  stage,
  stages,
  elements,
  trackElements,
  guide,
  trackSlug,
  stageSlug,
  commitments,
  commitmentSummary,
  participantTasks,
  trackJournalEntries,
}: ParticipantStageDashboardProps) {
  const visibleElements = useMemo(() => getVisibleStageElements(elements), [elements]);

  const journalEntries = useMemo(
    () => trackJournalEntries.filter((entry) => entry.stageId === stage.id),
    [trackJournalEntries, stage.id]
  );

  const journalReviewEntries = useMemo(
    (): JournalEntryReviewItem[] =>
      buildJournalReviewItems(trackJournalEntries, stages, trackElements),
    [trackJournalEntries, stages, trackElements]
  );

  const commitmentByElementId = useMemo(
    () => Object.fromEntries(commitments.map((item) => [item.elementId, item])),
    [commitments]
  );

  const [expandedById, setExpandedById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(visibleElements.map((el) => [el.id, true]))
  );

  const [modal, setModal] = useState<{
    type: ParticipantModalType;
    element: StageElement;
  } | null>(null);

  const aiMentorElement = useMemo(() => getAiMentorElement(visibleElements), [visibleElements]);
  const journalElement = useMemo(() => getJournalElement(visibleElements), [visibleElements]);

  const accomplishmentText = getStageAccomplishmentText(stage, track);
  const startHereBody = getStartHereBody(stage);
  const unlockSubtitle = getUnlockSubtitle(stage, stages);
  const nextAction = getNextActionCopy(stage, visibleElements);
  const liveEvents = collectLiveCallEvents(stages, trackElements);
  const sidebarTasks = buildSidebarPendingTasks(visibleElements, participantTasks);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [modal]);

  const toggleElement = useCallback((id: string) => {
    setExpandedById((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const scrollToElement = useCallback((elementId: string) => {
    document.getElementById(`element-${elementId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const openAiMentor = useCallback(() => {
    if (aiMentorElement) {
      scrollToElement(aiMentorElement.id);
      setModal({ type: "ai-mentor", element: aiMentorElement });
    }
  }, [aiMentorElement, scrollToElement]);

  const openJournal = useCallback(() => {
    if (journalElement) {
      scrollToElement(journalElement.id);
      setModal({ type: "journal", element: journalElement });
    }
  }, [journalElement, scrollToElement]);

  const elementHandlers = {
    onOpenAiMentor: (element: StageElement) =>
      setModal({ type: "ai-mentor", element }),
    onOpenJournal: (element: StageElement) =>
      setModal({ type: "journal", element }),
  };

  return (
    <div className="stage-dashboard-preview w-full text-slate-800 overflow-x-hidden bg-[#f1f5f9] font-[family-name:var(--font-inter,'Inter',ui-sans-serif,system-ui,sans-serif)]">
      <div className="p-4 sm:p-8 w-full max-w-6xl mx-auto space-y-8">
        <ParticipantStageHeader
          trackSlug={trackSlug}
          stage={stage}
          stages={stages}
          totalStages={stages.length}
          unlockSubtitle={unlockSubtitle}
          accomplishmentText={accomplishmentText}
          startHereBody={startHereBody}
          actionCount={visibleElements.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              {visibleElements.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <i className="fa-solid fa-arrow-right text-[#14b8a6]" /> Your Next
                      Steps
                    </h3>
                    <span className="text-sm text-slate-500 font-medium">
                      {visibleElements.length} action
                      {visibleElements.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  {visibleElements.map((element) => (
                    <StageElementCard
                      key={element.id}
                      element={element}
                      expanded={expandedById[element.id] ?? true}
                      onToggle={() => toggleElement(element.id)}
                      handlers={elementHandlers}
                      commitmentContext={
                        element.element_type === "commitment_builder"
                          ? {
                              trackId: track.id,
                              stageId: stage.id,
                              trackSlug,
                              stageSlug,
                              savedCommitment: commitmentByElementId[element.id],
                            }
                          : undefined
                      }
                      taskListContext={
                        element.element_type === "task_list"
                          ? {
                              trackId: track.id,
                              stageId: stage.id,
                              trackSlug,
                              stageSlug,
                              savedTasks: participantTasks,
                            }
                          : undefined
                      }
                      journalContext={
                        element.element_type === "reflection_journal"
                          ? { savedEntries: journalEntries }
                          : undefined
                      }
                    />
                  ))}
                </>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                  No stage elements are configured for this stage yet.
                </div>
              )}
            </div>

            <ParticipantStageFeedPlaceholder />
          </div>

          <ParticipantStageSidebar
            nextActionTitle={nextAction.title}
            nextActionDescription={nextAction.description}
            liveEvents={liveEvents}
            sidebarTasks={sidebarTasks}
            guide={guide}
            commitmentSummary={commitmentSummary}
            journalReviewEntries={journalReviewEntries}
          />
        </div>
      </div>

      <ParticipantStageModals
        modal={modal}
        journalContext={{
          trackId: track.id,
          stageId: stage.id,
          trackSlug,
          stageSlug,
          savedEntries: journalEntries,
        }}
        onClose={() => setModal(null)}
      />
    </div>
  );
}
