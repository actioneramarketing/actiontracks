import { StageElementType } from "@/lib/types/database";

export const STAGE_ELEMENT_TYPES: StageElementType[] = [
  "live_call",
  "commitment_builder",
  "task_list",
  "ai_mentor",
  "reflection_journal",
  "resources",
  "track_feed",
  "completion_submission",
  "reward_activation",
];

export const ELEMENT_TYPE_LABELS: Record<StageElementType, string> = {
  live_call: "Live Call",
  commitment_builder: "Commitment Builder",
  task_list: "Task List",
  ai_mentor: "AI Mentor",
  reflection_journal: "Reflection Journal",
  resources: "Resources",
  track_feed: "Track Feed",
  completion_submission: "Completion Submission",
  reward_activation: "Reward Activation",
};

export const ELEMENT_TYPE_ICONS: Record<StageElementType, string> = {
  live_call: "📞",
  commitment_builder: "🎯",
  task_list: "✅",
  ai_mentor: "🤖",
  reflection_journal: "📝",
  resources: "📚",
  track_feed: "💬",
  completion_submission: "📤",
  reward_activation: "🏆",
};

export function isStageElementType(value: string): value is StageElementType {
  return STAGE_ELEMENT_TYPES.includes(value as StageElementType);
}
