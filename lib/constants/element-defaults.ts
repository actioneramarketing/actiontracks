import { StageElementType } from "@/lib/types/database";

export interface ElementDefaults {
  title: string;
  description: string;
  settings_json: Record<string, unknown>;
}

export const ELEMENT_DEFAULTS: Record<StageElementType, ElementDefaults> = {
  live_call: {
    title: "Live Call",
    description:
      "Schedule and host a live group or 1:1 call with participants.",
    settings_json: {
      call_type: "kickoff",
      call_date: "",
      start_time: "",
      end_time: "",
      join_url: "",
      replay_url: "",
      button_text: "Join Live Call",
    },
  },
  commitment_builder: {
    title: "Commitment Builder",
    description:
      "Help participants define what they are committing to create and why it matters.",
    settings_json: {
      questions: [
        "What are you committing to create?",
        "Why is this important to you?",
        "What obstacles might get in your way?",
        "When will you work on this each week?",
        "What support or accountability do you need?",
      ],
    },
  },
  task_list: {
    title: "Task List",
    description:
      "Give participants a clear checklist of actions to complete for this stage.",
    settings_json: {
      tasks: [
        {
          title: "Complete the main action for this stage",
          description: "",
          priority: "medium",
          required: true,
        },
      ],
    },
  },
  ai_mentor: {
    title: "AI Mentor",
    description:
      "Embed an AI Mentor from Mentor Studio to support participants through this stage.",
    settings_json: {
      mentor_name: "",
      mentor_purpose: "",
      embed_code: "",
    },
  },
  reflection_journal: {
    title: "Reflection Journal",
    description:
      "Give participants a private place to capture insights, progress, and reflections.",
    settings_json: {
      prompts: ["What did you learn or notice during this stage?"],
      supporting_guidance: "",
      estimated_time: "5-10 minutes",
    },
  },
  resources: {
    title: "Resources",
    description:
      "Share links, videos, templates, worksheets, or tools for this stage.",
    settings_json: {
      resources: [
        {
          title: "Helpful Resource",
          type: "link",
          url: "",
          description: "",
        },
      ],
    },
  },
  track_feed: {
    title: "Track Feed",
    description:
      "Give participants a place to share updates, wins, questions, and progress.",
    settings_json: {
      feed_prompt:
        "Share your progress, questions, or wins for this stage.",
      allow_images: true,
      allow_links: true,
      allow_videos: true,
    },
  },
  completion_submission: {
    title: "Completion Submission",
    description:
      "Collect participant work for guide review or final completion.",
    settings_json: {
      submission_instructions: "Submit your completed work for review.",
      submission_deadline: "",
      require_url: true,
      require_notes: true,
      button_text: "Submit for Review",
      checklist_items: [
        "I completed the required work for this stage.",
        "I reviewed my work before submitting.",
      ],
    },
  },
  reward_activation: {
    title: "Reward Activation",
    description:
      "Unlock rewards, badges, certificates, or next steps after completion.",
    settings_json: {
      reward_name: "",
      reward_description: "",
      badge_name: "Action Track Completion",
      certificate_enabled: false,
      unlock_condition: "after_guide_approval",
    },
  },
};

export function getElementDefaults(type: StageElementType): ElementDefaults {
  const defaults = ELEMENT_DEFAULTS[type];
  return {
    title: defaults.title,
    description: defaults.description,
    settings_json: JSON.parse(JSON.stringify(defaults.settings_json)),
  };
}
