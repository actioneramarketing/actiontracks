"use client";

import { MentorEmbedPreview } from "@/components/tracks/MentorEmbedPreview";
import { ELEMENT_TYPE_LABELS } from "@/lib/constants/element-types";
import { StageElement } from "@/lib/types/database";
import {
  asRecord,
  asString,
  asStringArray,
  getReflectionJournalPrompts,
} from "@/lib/utils/element-settings";
import { CommitmentBuilderElement } from "./elements/CommitmentBuilderElement";
import { ResourcesElement } from "./elements/ResourcesElement";
import { TaskListElement } from "./elements/TaskListElement";
import type { ParticipantCommitmentView } from "@/lib/utils/commitment";
import type { ParticipantTaskRowView } from "@/lib/utils/participant-tasks";

export interface ElementContentHandlers {
  onOpenAiMentor?: (element: StageElement) => void;
  onOpenJournal?: (element: StageElement) => void;
}

export interface CommitmentElementContext {
  trackId: string;
  stageId: string;
  trackSlug: string;
  stageSlug: string;
  savedCommitment?: ParticipantCommitmentView;
}

export interface TaskListElementContext {
  trackId: string;
  stageId: string;
  trackSlug: string;
  stageSlug: string;
  savedTasks: ParticipantTaskRowView[];
}

export function StageElementContent({
  element,
  handlers = {},
  commitmentContext,
  taskListContext,
}: {
  element: StageElement;
  handlers?: ElementContentHandlers;
  commitmentContext?: CommitmentElementContext;
  taskListContext?: TaskListElementContext;
}) {
  const settings = asRecord(element.settings_json);

  switch (element.element_type) {
    case "live_call":
      return <LiveCallElementContent settings={settings} element={element} />;
    case "commitment_builder":
      if (!commitmentContext) {
        return (
          <div className="px-6 pb-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
            Commitment Builder is unavailable.
          </div>
        );
      }
      return (
        <CommitmentBuilderElement
          element={element}
          trackId={commitmentContext.trackId}
          stageId={commitmentContext.stageId}
          trackSlug={commitmentContext.trackSlug}
          stageSlug={commitmentContext.stageSlug}
          savedCommitment={
            commitmentContext.savedCommitment?.elementId === element.id
              ? commitmentContext.savedCommitment
              : undefined
          }
        />
      );
    case "task_list":
      if (!taskListContext) {
        return (
          <div className="px-6 pb-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
            Task List is unavailable.
          </div>
        );
      }
      return (
        <TaskListElement
          element={element}
          trackId={taskListContext.trackId}
          stageId={taskListContext.stageId}
          trackSlug={taskListContext.trackSlug}
          stageSlug={taskListContext.stageSlug}
          savedTasks={taskListContext.savedTasks}
        />
      );
    case "ai_mentor":
      return (
        <AiMentorElementContent
          settings={settings}
          element={element}
          onOpen={() => handlers.onOpenAiMentor?.(element)}
        />
      );
    case "reflection_journal":
      return (
        <ReflectionJournalElementContent
          settings={settings}
          element={element}
          onOpen={() => handlers.onOpenJournal?.(element)}
        />
      );
    case "resources":
      return <ResourcesElement element={element} />;
    case "completion_submission":
      return <CompletionSubmissionElementContent settings={settings} element={element} />;
    case "reward_activation":
      return <RewardActivationElementContent settings={settings} />;
    default:
      return (
        <GenericElementContent
          element={element}
          label={ELEMENT_TYPE_LABELS[element.element_type] ?? element.element_type}
        />
      );
  }
}

function LiveCallElementContent({
  settings,
  element,
}: {
  settings: Record<string, unknown>;
  element: StageElement;
}) {
  const callDate = asString(settings.call_date);
  const startTime = asString(settings.start_time);
  const endTime = asString(settings.end_time);
  const joinUrl = asString(settings.join_url);
  const buttonText = asString(settings.button_text, "Join Call");
  const callType = asString(settings.call_type);

  const dateLine = [callDate, startTime].filter(Boolean).join(" at ");
  const duration =
    startTime && endTime ? `${startTime} – ${endTime}` : endTime ? endTime : "";

  return (
    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
      {(dateLine || duration || callType) && (
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          {dateLine ? (
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-regular fa-calendar text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">{dateLine}</span>
            </div>
          ) : null}
          {duration ? (
            <div className="flex items-center gap-3">
              <i className="fa-regular fa-clock text-slate-400" />
              <span className="text-sm text-slate-600">{duration}</span>
            </div>
          ) : null}
          {callType ? (
            <p className="text-xs text-slate-500 mt-2 capitalize">{callType.replace(/_/g, " ")}</p>
          ) : null}
        </div>
      )}
      {element.description ? (
        <p className="text-sm text-slate-600 mb-4">{element.description}</p>
      ) : null}
      {joinUrl ? (
        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors inline-flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-arrow-up-right-from-square" /> {buttonText}
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-400 font-semibold rounded-xl cursor-not-allowed inline-flex items-center justify-center gap-2 border border-slate-200"
        >
          <i className="fa-solid fa-arrow-up-right-from-square" /> {buttonText}
        </button>
      )}
    </div>
  );
}

function AiMentorElementContent({
  settings,
  element,
  onOpen,
}: {
  settings: Record<string, unknown>;
  element: StageElement;
  onOpen: () => void;
}) {
  const mentorName = asString(settings.mentor_name);
  const purpose = asString(settings.mentor_purpose);
  const embedCode = asString(settings.embed_code);

  return (
    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border border-indigo-100">
        {mentorName ? (
          <p className="text-sm font-semibold text-indigo-900 mb-1">{mentorName}</p>
        ) : null}
        {purpose ? (
          <p className="text-sm text-indigo-800 mb-3">{purpose}</p>
        ) : (
          <p className="text-sm text-indigo-900 mb-3">
            <strong>Your AI Mentor can help you:</strong>
          </p>
        )}
        {!purpose ? (
          <ul className="space-y-1.5 text-sm text-indigo-800">
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-indigo-500 mt-0.5" />
              <span>Brainstorm and refine your topic ideas</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-indigo-500 mt-0.5" />
              <span>Overcome creative blocks and obstacles</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-indigo-500 mt-0.5" />
              <span>Get personalized action plans</span>
            </li>
          </ul>
        ) : null}
      </div>
      {element.description ? (
        <p className="text-sm text-slate-600 mb-4">{element.description}</p>
      ) : null}
      <button
        type="button"
        onClick={onOpen}
        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-comments" /> Open AI Mentor
      </button>
      {!embedCode.trim() ? (
        <p className="text-xs text-slate-500 mt-3">AI Mentor embed coming soon.</p>
      ) : null}
    </div>
  );
}

function ReflectionJournalElementContent({
  settings,
  element,
  onOpen,
}: {
  settings: Record<string, unknown>;
  element: StageElement;
  onOpen: () => void;
}) {
  const prompts = getReflectionJournalPrompts(settings);
  const time = asString(settings.estimated_time);

  return (
    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
      <div className="bg-pink-50 rounded-xl p-4 mb-4 border border-pink-100">
        <p className="text-sm font-semibold text-pink-900 mb-2">Today&apos;s Prompt:</p>
        <p className="text-sm text-pink-800 italic">&quot;{prompts[0]}&quot;</p>
      </div>
      {time ? (
        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
          <i className="fa-regular fa-clock" /> {time}
        </p>
      ) : null}
      {element.description ? (
        <p className="text-sm text-slate-600 mb-4">{element.description}</p>
      ) : null}
      <button
        type="button"
        onClick={onOpen}
        className="w-full sm:w-auto px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-pen-to-square" /> Open Full Journal
      </button>
    </div>
  );
}

function CompletionSubmissionElementContent({
  settings,
  element,
}: {
  settings: Record<string, unknown>;
  element: StageElement;
}) {
  const instructions = asString(settings.submission_instructions);
  const checklist = asStringArray(settings.checklist_items, 5).filter(Boolean);
  const buttonText = asString(settings.button_text, "Submit for Review");

  return (
    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
      {instructions ? (
        <p className="text-sm text-slate-600 mb-4">{instructions}</p>
      ) : null}
      {element.description ? (
        <p className="text-sm text-slate-600 mb-4">{element.description}</p>
      ) : null}
      {checklist.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {checklist.map((item, index) => (
            <li
              key={index}
              className="flex items-center p-3 rounded-lg border border-slate-200 bg-slate-50"
            >
              <input type="checkbox" readOnly className="w-5 h-5 rounded border-slate-300 mr-3" />
              <span className="text-sm text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        disabled
        className="w-full sm:w-auto px-6 py-3 bg-violet-600/60 text-white font-semibold rounded-xl cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {buttonText}
      </button>
      <p className="text-xs text-slate-500 mt-2">Submission saving is coming soon.</p>
    </div>
  );
}

function RewardActivationElementContent({
  settings,
}: {
  settings: Record<string, unknown>;
}) {
  const rewardName = asString(settings.reward_name);
  const rewardDescription = asString(settings.reward_description);
  const badgeName = asString(settings.badge_name, "Action Track Completion");
  const unlockCondition = asString(settings.unlock_condition, "after_guide_approval");
  const certificateEnabled = settings.certificate_enabled === true;

  return (
    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-semibold text-slate-800">
              {rewardName || badgeName}
            </p>
            {rewardDescription ? (
              <p className="text-sm text-slate-600 mt-1">{rewardDescription}</p>
            ) : null}
            <p className="text-xs text-slate-500 mt-2 capitalize">
              Unlocks: {unlockCondition.replace(/_/g, " ")}
            </p>
            {certificateEnabled ? (
              <p className="text-xs text-yellow-700 mt-1">Certificate included</p>
            ) : null}
            <button
              type="button"
              disabled
              className="mt-3 px-4 py-2 bg-yellow-600/50 text-white text-sm font-semibold rounded-lg cursor-not-allowed"
            >
              Locked — complete requirements first
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericElementContent({
  element,
  label,
}: {
  element: StageElement;
  label: string;
}) {
  return (
    <div className="px-6 pb-6 border-t border-slate-100 pt-4">
      {element.description ? (
        <p className="text-sm text-slate-600 mb-3">{element.description}</p>
      ) : null}
      <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
        {label}
      </span>
    </div>
  );
}

export function getAiMentorEmbedCode(element: StageElement): string {
  return asString(asRecord(element.settings_json).embed_code);
}

export function getJournalPrompts(element: StageElement): string[] {
  return getReflectionJournalPrompts(asRecord(element.settings_json));
}
