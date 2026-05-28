export type TrackStatus = "active" | "draft" | "archived";

export interface DemoTrack {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  primaryOutcome: string;
  whoThisIsFor: string;
  durationWeeks: number;
  trackType: string;
  guideName: string;
  guideTitle: string;
  guideBio: string;
  status: TrackStatus;
  startDate: string;
  endDate: string;
  philosophy: string;
}

export interface DemoStage {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  goal: string;
  shortGoal: string;
  elements: string[];
  nextActionTitle: string;
  nextActionDescription: string;
}

export interface LibraryTrack {
  slug: string;
  title: string;
  shortDescription: string;
  guideName: string;
  durationWeeks: number;
  status: TrackStatus;
}

export const demoTrack: DemoTrack = {
  id: "demo-track",
  slug: "podcast-launch-track",
  title: "Podcast Launch Action Track",
  shortDescription:
    "A guided 6-stage journey to define, create, and launch your podcast with confidence.",
  primaryOutcome: "Launch a polished podcast with your first 3 episodes live.",
  whoThisIsFor: "Creators and entrepreneurs ready to share their voice with the world.",
  durationWeeks: 8,
  trackType: "Cohort",
  guideName: "Sarah Chen",
  guideTitle: "Podcast Strategist & Coach",
  guideBio:
    "Sarah has helped 200+ creators launch successful podcasts. She specializes in content strategy and audience growth.",
  status: "active",
  startDate: "2026-06-15",
  endDate: "2026-08-10",
  philosophy:
    "Progress over perfection. Each stage builds momentum — show up, do the work, and trust the process.",
};

export const libraryTracks: LibraryTrack[] = [
  {
    slug: "podcast-launch-track",
    title: "Podcast Launch Action Track",
    shortDescription:
      "Define your topic, build content, record, polish, and launch your podcast in 8 weeks.",
    guideName: "Sarah Chen",
    durationWeeks: 8,
    status: "active",
  },
  {
    slug: "course-creator-track",
    title: "Online Course Creator Track",
    shortDescription:
      "Transform your expertise into a structured online course with live support at every step.",
    guideName: "Marcus Rivera",
    durationWeeks: 10,
    status: "active",
  },
  {
    slug: "newsletter-growth-track",
    title: "Newsletter Growth Action Track",
    shortDescription:
      "Build, grow, and monetize your newsletter with proven frameworks and accountability.",
    guideName: "Elena Park",
    durationWeeks: 6,
    status: "draft",
  },
];

export const demoStages: DemoStage[] = [
  {
    id: "stage-1",
    slug: "define-your-topic",
    number: 1,
    title: "Define Your Topic",
    subtitle: "Clarify your podcast niche and audience",
    goal: "Identify your unique angle and ideal listener profile.",
    shortGoal: "Clarify niche and audience",
    elements: ["Live Call", "Commitment Builder", "AI Mentor", "Reflection Journal"],
    nextActionTitle: "Complete Your Topic Worksheet",
    nextActionDescription: "Fill out the topic clarity worksheet before your kickoff call.",
  },
  {
    id: "stage-2",
    slug: "build-your-content",
    number: 2,
    title: "Build Your Content",
    subtitle: "Outline your first episodes and content pillars",
    goal: "Create a content roadmap for your first 10 episodes.",
    shortGoal: "Outline first 10 episodes",
    elements: ["Task List", "Resources", "AI Mentor", "Track Feed"],
    nextActionTitle: "Submit Episode Outlines",
    nextActionDescription: "Share your top 3 episode outlines for guide feedback.",
  },
  {
    id: "stage-3",
    slug: "record-and-edit",
    number: 3,
    title: "Record & Edit",
    subtitle: "Capture and refine your first recordings",
    goal: "Record and edit your first 3 podcast episodes.",
    shortGoal: "Record first 3 episodes",
    elements: ["Live Call", "Task List", "Resources", "Completion Submission"],
    nextActionTitle: "Upload Raw Recordings",
    nextActionDescription: "Upload your first raw recording for technical review.",
  },
  {
    id: "stage-4",
    slug: "polish-and-review",
    number: 4,
    title: "Polish & Review",
    subtitle: "Refine audio quality and episode structure",
    goal: "Finalize production quality and episode show notes.",
    shortGoal: "Finalize production quality",
    elements: ["Task List", "AI Mentor", "Reflection Journal", "Resources"],
    nextActionTitle: "Submit Polished Episodes",
    nextActionDescription: "Upload your edited episodes for final review.",
  },
  {
    id: "stage-5",
    slug: "launch-strategy",
    number: 5,
    title: "Launch Strategy",
    subtitle: "Plan your go-to-market approach",
    goal: "Build a launch plan with distribution channels and promotion tactics.",
    shortGoal: "Build launch plan",
    elements: ["Live Call", "Commitment Builder", "Track Feed", "Resources"],
    nextActionTitle: "Share Launch Plan",
    nextActionDescription: "Post your launch strategy in the track feed for peer feedback.",
  },
  {
    id: "stage-6",
    slug: "go-live",
    number: 6,
    title: "Go Live",
    subtitle: "Publish and celebrate your launch",
    goal: "Publish your podcast and activate your launch reward.",
    shortGoal: "Publish and celebrate",
    elements: ["Completion Submission", "Reward Activation", "Track Feed", "Reflection Journal"],
    nextActionTitle: "Submit Launch Proof",
    nextActionDescription: "Share your live podcast link to complete the track.",
  },
];

export const stageElements = [
  {
    id: "live-call",
    name: "Live Call",
    description: "Schedule and host live group or 1:1 calls with participants.",
    icon: "📞",
  },
  {
    id: "commitment-builder",
    name: "Commitment Builder",
    description: "Help participants set and track personal commitments for the stage.",
    icon: "🎯",
  },
  {
    id: "task-list",
    name: "Task List",
    description: "Structured checklist of actions participants should complete.",
    icon: "✅",
  },
  {
    id: "ai-mentor",
    name: "AI Mentor",
    description: "AI-powered coaching assistant tailored to the stage context.",
    icon: "🤖",
  },
  {
    id: "reflection-journal",
    name: "Reflection Journal",
    description: "Guided prompts for participants to reflect on their progress.",
    icon: "📝",
  },
  {
    id: "resources",
    name: "Resources",
    description: "Curated links, templates, and downloadable materials.",
    icon: "📚",
  },
  {
    id: "track-feed",
    name: "Track Feed",
    description: "Community feed for updates, wins, and peer interaction.",
    icon: "💬",
  },
  {
    id: "completion-submission",
    name: "Completion Submission",
    description: "Collect work submissions for guide review and approval.",
    icon: "📤",
  },
  {
    id: "reward-activation",
    name: "Reward Activation",
    description: "Unlock rewards or certificates upon stage or track completion.",
    icon: "🏆",
  },
];

export const welcomeChecklist = [
  { id: "1", label: "Review your track schedule and key dates", done: true },
  { id: "2", label: "Set up your workspace and tools", done: true },
  { id: "3", label: "Introduce yourself in the Track Feed", done: false },
  { id: "4", label: "Complete your Commitment Builder for Stage 1", done: false },
];

export const participantStageElements = [
  { name: "Live Kickoff Call", description: "Join your guide for a live kickoff to align on goals.", status: "scheduled" as const },
  { name: "Commitment Builder", description: "Set your personal commitment for this stage.", status: "active" as const },
  { name: "Task List", description: "4 tasks to complete before moving forward.", status: "active" as const },
  { name: "AI Mentor", description: "Ask questions and get guidance anytime.", status: "active" as const },
  { name: "Reflection Journal", description: "Capture insights as you progress.", status: "available" as const },
  { name: "Track Feed", description: "Share updates and connect with fellow participants.", status: "active" as const },
  { name: "Resources", description: "Templates, guides, and reference materials.", status: "active" as const },
];

export const completionStats = [
  { label: "Stages Completed", value: "6/6" },
  { label: "Tasks Finished", value: "24/24" },
  { label: "Days Active", value: "56" },
  { label: "Reflections Written", value: "8" },
];

export function getStageBySlug(slug: string): DemoStage | undefined {
  return demoStages.find((s) => s.slug === slug || s.id === slug);
}

export function getStageById(id: string): DemoStage | undefined {
  return demoStages.find((s) => s.id === id);
}
