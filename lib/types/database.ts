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
  short_description: string | null;
  primary_outcome: string | null;
  who_this_is_for: string | null;
  duration_weeks: number | null;
  track_type: string | null;
  status: TrackStatus;
  start_date: string | null;
  end_date: string | null;
  philosophy: string | null;
  guide_id: string | null;
  welcome_headline: string | null;
  completion_headline: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActionTrackStage {
  id: string;
  action_track_id: string;
  stage_number: number;
  slug: string;
  title: string;
  subtitle: string | null;
  stage_goal: string | null;
  what_youll_accomplish: string | null;
  next_action_title: string | null;
  next_action_description: string | null;
  is_final_stage: boolean;
  created_at: string;
}

export interface StageElement {
  id: string;
  action_track_stage_id: string;
  action_track_id: string;
  element_type: StageElementType;
  title: string | null;
  description: string | null;
  is_required: boolean;
  is_enabled: boolean;
  settings_json: Record<string, unknown> | null;
  display_order: number | null;
  created_at: string;
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
