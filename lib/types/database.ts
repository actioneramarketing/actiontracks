export type TrackStatus = "active" | "draft" | "archived";

export type StageElementType =
  | "live_call"
  | "commitment_builder"
  | "task_list"
  | "ai_mentor"
  | "reflection_journal"
  | "resources"
  | "track_feed"
  | "completion_submission"
  | "reward_activation";

export interface ActionTrackGuide {
  id: string;
  name: string | null;
  title: string | null;
  bio: string | null;
}

export interface ActionTrack {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  primary_outcome: string;
  who_this_is_for: string;
  current_struggle: string;
  duration_weeks: number;
  track_type: string;
  status: TrackStatus;
  start_date: string;
  end_date: string;
  visibility: string;
  hero_image_url: string;
  reward_title: string;
  philosophy: string;
  guide_id: string;
  welcome_headline: string;
  completion_headline: string;
  settings_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ActionTrackStage {
  id: string;
  track_id: string;
  stage_number: number;
  slug: string;
  title: string;
  subtitle: string | null;
  stage_goal: string | null;
  stage_summary: string | null;
  what_youll_accomplish: string | null;
  next_action_title: string | null;
  next_action_description: string | null;
  unlock_type: string | null;
  is_final_stage: boolean;
  settings_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface StageElement {
  id: string;
  stage_id: string;
  track_id: string;
  element_type: StageElementType;
  title: string | null;
  description: string | null;
  is_required: boolean;
  is_enabled: boolean;
  settings_json: Record<string, unknown> | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface ActionTrackListItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  guideName: string;
  durationWeeks: number;
  status: TrackStatus;
}
