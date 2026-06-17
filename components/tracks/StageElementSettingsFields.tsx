import { StageElementType } from "@/lib/types/database";
import {
  asResourceArray,
  asString,
  asStringArray,
  asTaskArray,
} from "@/lib/utils/element-settings";

interface StageElementSettingsFieldsProps {
  elementType: StageElementType;
  settings: Record<string, unknown>;
}

export function StageElementSettingsFields({
  elementType,
  settings,
}: StageElementSettingsFieldsProps) {
  switch (elementType) {
    case "live_call":
      return <LiveCallFields settings={settings} />;
    case "commitment_builder":
      return <CommitmentBuilderFields settings={settings} />;
    case "task_list":
      return <TaskListFields settings={settings} />;
    case "ai_mentor":
      return <AiMentorFields settings={settings} />;
    case "reflection_journal":
      return <ReflectionJournalFields settings={settings} />;
    case "resources":
      return <ResourcesFields settings={settings} />;
    case "track_feed":
      return <TrackFeedFields settings={settings} />;
    case "completion_submission":
      return <CompletionSubmissionFields settings={settings} />;
    case "reward_activation":
      return <RewardActivationFields settings={settings} />;
    default:
      return null;
  }
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={2}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}

function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="rounded border-gray-300"
      />
      {label}
    </label>
  );
}

function LiveCallFields({ settings }: { settings: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      <Field label="Call Type" name="call_type" defaultValue={asString(settings.call_type, "kickoff")} />
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Call Date" name="call_date" type="date" defaultValue={asString(settings.call_date)} />
        <Field label="Start Time" name="start_time" type="time" defaultValue={asString(settings.start_time)} />
        <Field label="End Time" name="end_time" type="time" defaultValue={asString(settings.end_time)} />
      </div>
      <Field label="Join URL" name="join_url" defaultValue={asString(settings.join_url)} />
      <Field label="Replay URL" name="replay_url" defaultValue={asString(settings.replay_url)} />
      <Field label="Button Text" name="button_text" defaultValue={asString(settings.button_text, "Join Live Call")} />
    </div>
  );
}

function CommitmentBuilderFields({ settings }: { settings: Record<string, unknown> }) {
  const questions = asStringArray(settings.questions, 5);
  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <Field
          key={index}
          label={`Question ${index + 1}`}
          name={`question_${index}`}
          defaultValue={question}
          textarea
        />
      ))}
    </div>
  );
}

function TaskListFields({ settings }: { settings: Record<string, unknown> }) {
  const tasks = asTaskArray(settings.tasks, 5);
  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div key={index} className="rounded-lg border border-gray-100 p-3 space-y-2">
          <p className="text-xs font-medium text-gray-500">Task {index + 1}</p>
          <Field label="Title" name={`task_${index}_title`} defaultValue={task.title} />
          <Field label="Description" name={`task_${index}_description`} defaultValue={task.description} textarea />
          <div className="grid sm:grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <select
                name={`task_${index}_priority`}
                defaultValue={task.priority}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Checkbox label="Required" name={`task_${index}_required`} defaultChecked={task.required} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AiMentorFields({ settings }: { settings: Record<string, unknown> }) {
  const prompts = asStringArray(settings.suggested_prompts, 3);
  return (
    <div className="space-y-3">
      <Field label="Mentor Name" name="mentor_name" defaultValue={asString(settings.mentor_name)} />
      <Field label="Mentor URL" name="mentor_url" defaultValue={asString(settings.mentor_url)} />
      <Field label="Button Text" name="button_text" defaultValue={asString(settings.button_text, "Open AI Mentor")} />
      <Field label="Mentor Purpose" name="mentor_purpose" defaultValue={asString(settings.mentor_purpose)} textarea />
      {prompts.map((prompt, index) => (
        <Field
          key={index}
          label={`Suggested Prompt ${index + 1}`}
          name={`prompt_${index}`}
          defaultValue={prompt}
          textarea
        />
      ))}
    </div>
  );
}

function ReflectionJournalFields({ settings }: { settings: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      <Field label="Prompt" name="prompt" defaultValue={asString(settings.prompt)} textarea />
      <Field label="Supporting Guidance" name="supporting_guidance" defaultValue={asString(settings.supporting_guidance)} textarea />
      <Field label="Estimated Time" name="estimated_time" defaultValue={asString(settings.estimated_time, "5-10 minutes")} />
    </div>
  );
}

function ResourcesFields({ settings }: { settings: Record<string, unknown> }) {
  const resources = asResourceArray(settings.resources, 5);
  const resourceTypes = [
    "link",
    "video",
    "pdf",
    "document",
    "worksheet",
    "template",
    "external_tool",
  ];

  return (
    <div className="space-y-4">
      {resources.map((resource, index) => (
        <div key={index} className="rounded-lg border border-gray-100 p-3 space-y-2">
          <p className="text-xs font-medium text-gray-500">Resource {index + 1}</p>
          <Field label="Title" name={`resource_${index}_title`} defaultValue={resource.title} />
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select
              name={`resource_${index}_type`}
              defaultValue={resource.type}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
            >
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <Field label="URL" name={`resource_${index}_url`} defaultValue={resource.url} />
          <Field label="Description" name={`resource_${index}_description`} defaultValue={resource.description} textarea />
        </div>
      ))}
    </div>
  );
}

function TrackFeedFields({ settings }: { settings: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      <Field label="Feed Prompt" name="feed_prompt" defaultValue={asString(settings.feed_prompt)} textarea />
      <Checkbox label="Allow Images" name="allow_images" defaultChecked={settings.allow_images !== false} />
      <Checkbox label="Allow Links" name="allow_links" defaultChecked={settings.allow_links !== false} />
      <Checkbox label="Allow Videos" name="allow_videos" defaultChecked={settings.allow_videos !== false} />
    </div>
  );
}

function CompletionSubmissionFields({ settings }: { settings: Record<string, unknown> }) {
  const checklist = asStringArray(settings.checklist_items, 5);
  return (
    <div className="space-y-3">
      <Field label="Submission Instructions" name="submission_instructions" defaultValue={asString(settings.submission_instructions)} textarea />
      <Field label="Submission Deadline" name="submission_deadline" type="date" defaultValue={asString(settings.submission_deadline)} />
      <Checkbox label="Require URL" name="require_url" defaultChecked={settings.require_url !== false} />
      <Checkbox label="Require Notes" name="require_notes" defaultChecked={settings.require_notes !== false} />
      <Field label="Button Text" name="button_text" defaultValue={asString(settings.button_text, "Submit for Review")} />
      {checklist.map((item, index) => (
        <Field
          key={index}
          label={`Checklist Item ${index + 1}`}
          name={`checklist_${index}`}
          defaultValue={item}
        />
      ))}
    </div>
  );
}

function RewardActivationFields({ settings }: { settings: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      <Field label="Reward Name" name="reward_name" defaultValue={asString(settings.reward_name)} />
      <Field label="Reward Description" name="reward_description" defaultValue={asString(settings.reward_description)} textarea />
      <Field label="Badge Name" name="badge_name" defaultValue={asString(settings.badge_name, "Action Track Completion")} />
      <Checkbox label="Certificate Enabled" name="certificate_enabled" defaultChecked={settings.certificate_enabled === true} />
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Unlock Condition</label>
        <select
          name="unlock_condition"
          defaultValue={asString(settings.unlock_condition, "after_guide_approval")}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
        >
          <option value="after_submission">After Submission</option>
          <option value="after_guide_approval">After Guide Approval</option>
          <option value="after_all_required_elements_complete">After All Required Elements Complete</option>
          <option value="manual_unlock">Manual Unlock</option>
        </select>
      </div>
    </div>
  );
}
