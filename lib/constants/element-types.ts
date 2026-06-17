import { StageElementType } from "@/lib/types/database";

/** All element types that may exist in the database (including legacy rows). */
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

/** Element types guides can add via the builder dropdown. */
export const ADDABLE_STAGE_ELEMENT_TYPES = STAGE_ELEMENT_TYPES.filter(
  (type) => type !== "track_feed"
) as Exclude<StageElementType, "track_feed">[];

export type AddableStageElementType = (typeof ADDABLE_STAGE_ELEMENT_TYPES)[number];

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

export function isAddableStageElementType(
  value: string
): value is AddableStageElementType {
  return ADDABLE_STAGE_ELEMENT_TYPES.includes(value as AddableStageElementType);
}

export function isBuilderVisibleElement(element: {
  element_type: StageElementType;
}): boolean {
  return element.element_type !== "track_feed";
}

export function filterBuilderVisibleElements<T extends { element_type: StageElementType }>(
  elements: T[]
): T[] {
  return elements.filter(isBuilderVisibleElement);
}
