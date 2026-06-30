import { ELEMENT_TYPE_LABELS } from "@/lib/constants/element-types";
import {
  ActionTrackStage,
  GuideProfile,
  StageElement,
} from "@/lib/types/database";
import { NormalizedActionTrack } from "@/lib/utils/normalize-action-track";
import {
  asRecord,
  asString,
  asTaskArray,
  getReflectionJournalPrompts,
} from "@/lib/utils/element-settings";

export interface LiveCallEventItem {
  id: string;
  title: string;
  callDate: string;
  startTime: string;
  endTime: string;
  joinUrl: string;
  buttonText: string;
  stageNumber: number;
}

export interface SidebarTaskItem {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
}

export interface StageNavLink {
  stage: ActionTrackStage;
  href: string;
}

export interface StageNavigationState {
  currentIndex: number;
  totalStages: number;
  stageLabel: string;
  previous: StageNavLink | null;
  next: StageNavLink | null;
  allStages: StageNavLink[];
}

export function getOrderedStages(stages: ActionTrackStage[]): ActionTrackStage[] {
  return [...stages].sort((a, b) => a.stage_number - b.stage_number);
}

function buildStageHref(trackSlug: string, stage: ActionTrackStage): string | null {
  const slug = stage.slug?.trim();
  if (!slug || !trackSlug.trim()) {
    return null;
  }
  return `/track/${trackSlug}/stages/${slug}`;
}

export function getStageNavigation(
  trackSlug: string,
  currentStage: ActionTrackStage,
  stages: ActionTrackStage[]
): StageNavigationState {
  const ordered = getOrderedStages(stages);
  const totalStages = ordered.length;

  const allStages = ordered
    .map((item) => {
      const href = buildStageHref(trackSlug, item);
      if (!href) {
        return null;
      }
      return { stage: item, href };
    })
    .filter((item): item is StageNavLink => item != null);

  const currentIndex = ordered.findIndex(
    (item) => item.id === currentStage.id || item.slug === currentStage.slug
  );

  const stageLabel =
    totalStages > 0
      ? `Stage ${currentStage.stage_number} of ${totalStages}`
      : `Stage ${currentStage.stage_number}`;

  if (currentIndex === -1) {
    return {
      currentIndex: -1,
      totalStages,
      stageLabel,
      previous: null,
      next: null,
      allStages,
    };
  }

  const previousStage = currentIndex > 0 ? ordered[currentIndex - 1] : null;
  const nextStage =
    currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : null;

  const previousHref = previousStage ? buildStageHref(trackSlug, previousStage) : null;
  const nextHref = nextStage ? buildStageHref(trackSlug, nextStage) : null;

  return {
    currentIndex,
    totalStages,
    stageLabel,
    previous:
      previousStage && previousHref
        ? { stage: previousStage, href: previousHref }
        : null,
    next: nextStage && nextHref ? { stage: nextStage, href: nextHref } : null,
    allStages,
  };
}

export function getStageTagline(
  stage: ActionTrackStage,
  track: NormalizedActionTrack
): string {
  return (
    stage.subtitle?.trim() ||
    stage.stage_summary?.trim() ||
    stage.stage_goal?.trim() ||
    stage.what_youll_accomplish?.trim() ||
    track.short_description?.trim() ||
    ""
  );
}

export function getStageAccomplishmentText(
  stage: ActionTrackStage,
  track: NormalizedActionTrack
): string {
  return (
    stage.what_youll_accomplish?.trim() ||
    stage.stage_goal?.trim() ||
    stage.stage_summary?.trim() ||
    track.primary_outcome?.trim() ||
    "Work through each action in this stage to move your Action Track forward."
  );
}

export function getStartHereBody(stage: ActionTrackStage): string {
  return (
    stage.stage_summary?.trim() ||
    stage.subtitle?.trim() ||
    stage.stage_goal?.trim() ||
    "Begin with the first action below. Everything else will unlock as you go. Take it one step at a time."
  );
}

export function getUnlockSubtitle(
  stage: ActionTrackStage,
  stages: ActionTrackStage[]
): string {
  const sorted = [...stages].sort((a, b) => a.stage_number - b.stage_number);
  const nextStage = sorted.find((s) => s.stage_number > stage.stage_number);
  if (nextStage) {
    return `Complete all actions to unlock Stage ${nextStage.stage_number}`;
  }
  return "Complete this final stage to finish the Action Track";
}

export function getVisibleStageElements(elements: StageElement[]): StageElement[] {
  return elements.filter((el) => el.is_enabled && el.element_type !== "track_feed");
}

export function getNextActionCopy(
  stage: ActionTrackStage,
  elements: StageElement[]
): { title: string; description: string } {
  if (stage.next_action_title?.trim()) {
    return {
      title: stage.next_action_title.trim(),
      description: stage.next_action_description?.trim() || "",
    };
  }

  const firstRequired = elements.find((el) => el.is_required && el.is_enabled);
  if (firstRequired) {
    return {
      title:
        firstRequired.title?.trim() ||
        ELEMENT_TYPE_LABELS[firstRequired.element_type],
      description: firstRequired.description?.trim() || "",
    };
  }

  const first = elements.find((el) => el.is_enabled && el.element_type !== "track_feed");
  if (first) {
    return {
      title: first.title?.trim() || ELEMENT_TYPE_LABELS[first.element_type],
      description: first.description?.trim() || "",
    };
  }

  return {
    title: "Start with the first action in this stage",
    description: "Work through each element below to complete this stage.",
  };
}

export function collectLiveCallEvents(
  stages: ActionTrackStage[],
  trackElements: StageElement[]
): LiveCallEventItem[] {
  const stageById = new Map(stages.map((s) => [s.id, s]));
  const events: LiveCallEventItem[] = [];

  for (const element of trackElements) {
    if (element.element_type !== "live_call" || !element.is_enabled) {
      continue;
    }
    const settings = asRecord(element.settings_json);
    const stage = stageById.get(element.stage_id);
    events.push({
      id: element.id,
      title: element.title?.trim() || "Live Call",
      callDate: asString(settings.call_date),
      startTime: asString(settings.start_time),
      endTime: asString(settings.end_time),
      joinUrl: asString(settings.join_url),
      buttonText: asString(settings.button_text, "Join Call"),
      stageNumber: stage?.stage_number ?? 0,
    });
  }

  return events.sort((a, b) => {
    const dateA = `${a.callDate} ${a.startTime}`;
    const dateB = `${b.callDate} ${b.startTime}`;
    return dateA.localeCompare(dateB);
  });
}

export function collectSidebarTasks(elements: StageElement[]): SidebarTaskItem[] {
  const tasks: SidebarTaskItem[] = [];

  for (const element of elements) {
    if (element.element_type !== "task_list" || !element.is_enabled) {
      continue;
    }
    const settings = asRecord(element.settings_json);
    const rawTasks = Array.isArray(settings.tasks) ? settings.tasks : [];
    for (const raw of rawTasks) {
      if (!raw || typeof raw !== "object") {
        continue;
      }
      const task = raw as Record<string, unknown>;
      const title = asString(task.title).trim();
      if (!title) {
        continue;
      }
      tasks.push({
        title,
        description: asString(task.description),
        priority: asString(task.priority, "medium"),
        dueDate: asString(task.due_date),
      });
    }
  }

  return tasks;
}

export function getAiMentorElement(elements: StageElement[]): StageElement | null {
  return elements.find((el) => el.element_type === "ai_mentor" && el.is_enabled) ?? null;
}

export function getJournalElement(elements: StageElement[]): StageElement | null {
  return (
    elements.find((el) => el.element_type === "reflection_journal" && el.is_enabled) ??
    null
  );
}

export function getJournalPromptPreview(element: StageElement | null): string {
  if (!element) {
    return "";
  }
  const prompts = getReflectionJournalPrompts(asRecord(element.settings_json));
  return prompts[0] ?? "";
}

export function serializeGuideForParticipant(
  guide: GuideProfile | null
): GuideProfile | null {
  if (!guide) {
    return null;
  }
  return JSON.parse(JSON.stringify(guide)) as GuideProfile;
}
