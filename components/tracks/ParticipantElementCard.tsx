import { MentorEmbedPreview } from "@/components/tracks/MentorEmbedPreview";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ELEMENT_TYPE_LABELS } from "@/lib/constants/element-types";
import { StageElement } from "@/lib/types/database";
import {
  asRecord,
  asResourceArray,
  asString,
  asStringArray,
  asTaskArray,
  getReflectionJournalPrompts,
} from "@/lib/utils/element-settings";

interface ParticipantElementCardProps {
  element: StageElement;
}

export function ParticipantElementCard({ element }: ParticipantElementCardProps) {
  const settings = asRecord(element.settings_json);
  const title = element.title ?? ELEMENT_TYPE_LABELS[element.element_type];
  const description = element.description ?? "";

  return (
    <Card padding="sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 capitalize bg-teal-50 text-teal-700 ring-teal-200">
          {element.is_required ? "required" : "available"}
        </span>
      </div>
      <ElementPreviewContent element={element} settings={settings} />
    </Card>
  );
}

function ElementPreviewContent({
  element,
  settings,
}: {
  element: StageElement;
  settings: Record<string, unknown>;
}) {
  switch (element.element_type) {
    case "live_call":
      return <LiveCallPreview settings={settings} />;
    case "commitment_builder":
      return <CommitmentBuilderPreview settings={settings} />;
    case "task_list":
      return <TaskListPreview settings={settings} />;
    case "ai_mentor":
      return <AiMentorPreview settings={settings} />;
    case "reflection_journal":
      return <ReflectionJournalPreview settings={settings} />;
    case "resources":
      return <ResourcesPreview settings={settings} />;
    case "track_feed":
      return <TrackFeedPreview settings={settings} />;
    case "completion_submission":
      return <CompletionSubmissionPreview settings={settings} />;
    case "reward_activation":
      return <RewardActivationPreview settings={settings} />;
    default:
      return null;
  }
}

function LiveCallPreview({ settings }: { settings: Record<string, unknown> }) {
  const callDate = asString(settings.call_date);
  const startTime = asString(settings.start_time);
  const endTime = asString(settings.end_time);
  const joinUrl = asString(settings.join_url);
  const buttonText = asString(settings.button_text, "Join Live Call");

  return (
    <div className="space-y-2 text-sm">
      {(callDate || startTime) && (
        <p className="text-gray-600">
          {callDate}
          {startTime && ` · ${startTime}`}
          {endTime && ` – ${endTime}`}
        </p>
      )}
      {joinUrl ? (
        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors px-3 py-1.5 text-sm bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
        >
          {buttonText}
        </a>
      ) : (
        <Button variant="primary" size="sm" disabled className="opacity-60">
          {buttonText}
        </Button>
      )}
    </div>
  );
}

function CommitmentBuilderPreview({ settings }: { settings: Record<string, unknown> }) {
  const questions = asStringArray(settings.questions, 5).filter(Boolean);
  if (questions.length === 0) return null;

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <div key={index}>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {question}
          </label>
          <input
            disabled
            placeholder="Your answer..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50"
          />
        </div>
      ))}
    </div>
  );
}

function TaskListPreview({ settings }: { settings: Record<string, unknown> }) {
  const tasks = asTaskArray(settings.tasks, 5).filter((t) => t.title);

  return (
    <ul className="space-y-2">
      {tasks.map((task, index) => (
        <li key={index} className="flex items-start gap-2 text-sm">
          <input type="checkbox" disabled className="mt-1 rounded border-gray-300" />
          <div>
            <p className="font-medium text-gray-900">{task.title}</p>
            {task.description && (
              <p className="text-gray-500">{task.description}</p>
            )}
            <p className="text-xs text-gray-400 capitalize mt-0.5">
              {task.priority} priority{task.required ? " · required" : ""}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AiMentorPreview({ settings }: { settings: Record<string, unknown> }) {
  const mentorName = asString(settings.mentor_name);
  const purpose = asString(settings.mentor_purpose);
  const embedCode = asString(settings.embed_code);

  return (
    <div className="space-y-3 text-sm">
      {mentorName && (
        <p className="font-medium text-gray-900">{mentorName}</p>
      )}
      {purpose && <p className="text-gray-600">{purpose}</p>}
      <MentorEmbedPreview
        embedCode={embedCode}
        emptyMessage="AI Mentor embed coming soon."
      />
    </div>
  );
}

function ReflectionJournalPreview({ settings }: { settings: Record<string, unknown> }) {
  const prompts = getReflectionJournalPrompts(settings);
  const guidance = asString(settings.supporting_guidance);
  const time = asString(settings.estimated_time);

  return (
    <div className="space-y-4 text-sm">
      {guidance && <p className="text-gray-500">{guidance}</p>}
      {time && <p className="text-xs text-gray-400">Estimated time: {time}</p>}
      {prompts.map((prompt, index) => (
        <div key={index}>
          <p className="font-medium text-gray-700">{prompt}</p>
          <textarea
            disabled
            rows={3}
            placeholder="Write your reflection..."
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50"
          />
        </div>
      ))}
    </div>
  );
}

function ResourcesPreview({ settings }: { settings: Record<string, unknown> }) {
  const resources = asResourceArray(settings.resources, 5).filter(
    (r) => r.title || r.url
  );

  return (
    <ul className="space-y-2 text-sm">
      {resources.map((resource, index) => (
        <li key={index} className="rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200">
          <p className="font-medium text-gray-900">{resource.title || "Resource"}</p>
          {resource.description && (
            <p className="text-gray-500 mt-0.5">{resource.description}</p>
          )}
          {resource.url ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 text-xs mt-1 inline-block hover:underline"
            >
              Open {resource.type.replace("_", " ")}
            </a>
          ) : (
            <p className="text-xs text-gray-400 mt-1 capitalize">{resource.type}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function TrackFeedPreview({ settings }: { settings: Record<string, unknown> }) {
  const prompt = asString(settings.feed_prompt);

  return (
    <div className="space-y-2 text-sm">
      {prompt && <p className="text-gray-600">{prompt}</p>}
      <textarea
        disabled
        rows={2}
        placeholder="Share an update..."
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50"
      />
      <Button disabled size="sm" className="opacity-60">
        Post Update
      </Button>
    </div>
  );
}

function CompletionSubmissionPreview({ settings }: { settings: Record<string, unknown> }) {
  const instructions = asString(settings.submission_instructions);
  const checklist = asStringArray(settings.checklist_items, 5).filter(Boolean);
  const buttonText = asString(settings.button_text, "Submit for Review");

  return (
    <div className="space-y-3 text-sm">
      {instructions && <p className="text-gray-600">{instructions}</p>}
      {checklist.length > 0 && (
        <ul className="space-y-1">
          {checklist.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <input type="checkbox" disabled className="rounded border-gray-300" />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      )}
      <input
        disabled
        placeholder="Submission URL"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50"
      />
      <textarea
        disabled
        rows={2}
        placeholder="Notes..."
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50"
      />
      <Button disabled size="sm" className="opacity-60">
        {buttonText}
      </Button>
    </div>
  );
}

function RewardActivationPreview({ settings }: { settings: Record<string, unknown> }) {
  const rewardName = asString(settings.reward_name);
  const rewardDescription = asString(settings.reward_description);
  const badgeName = asString(settings.badge_name, "Action Track Completion");
  const unlockCondition = asString(settings.unlock_condition, "after_guide_approval");

  return (
    <div className="rounded-lg bg-amber-50 p-4 ring-1 ring-amber-100 text-sm">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🏆</span>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-gray-900">
              {rewardName || badgeName}
            </p>
            <Badge variant="default">Pending</Badge>
          </div>
          {rewardDescription && (
            <p className="text-gray-600 mt-1">{rewardDescription}</p>
          )}
          <p className="text-xs text-gray-500 mt-2 capitalize">
            Unlocks: {unlockCondition.replace(/_/g, " ")}
          </p>
          <Button disabled size="sm" className="mt-3 opacity-60">
            Activate Reward
          </Button>
        </div>
      </div>
    </div>
  );
}
