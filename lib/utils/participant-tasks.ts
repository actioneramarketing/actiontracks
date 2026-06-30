import { slugify } from "@/lib/utils/slug";
import { SidebarTaskItem } from "@/lib/participant/stage-page-model";
import { StageElement } from "@/lib/types/database";
import {
  asBoolean,
  asRecord,
  asString,
} from "@/lib/utils/element-settings";

export type TaskSource = "guide" | "participant";

export interface GuideTaskDefinition {
  guideTaskKey: string;
  title: string;
  description: string;
  priority: string;
  required: boolean;
  dueDate: string;
}

export interface ParticipantTaskRowView {
  id: string;
  trackId: string;
  stageId: string;
  elementId: string;
  taskSource: TaskSource;
  guideTaskKey: string | null;
  title: string;
  description: string | null;
  priority: string;
  dueDate: string | null;
  isCompleted: boolean;
  sortOrder: number | null;
}

export function buildGuideTaskKey(index: number, title: string, raw?: Record<string, unknown>): string {
  const id = raw ? asString(raw.id).trim() : "";
  if (id) {
    return id;
  }
  const key = raw ? asString(raw.key).trim() : "";
  if (key) {
    return key;
  }
  const slug = slugify(title) || "task";
  return `guide-${index}-${slug}`;
}

export function parseGuideTasksFromSettings(
  settings: Record<string, unknown>
): GuideTaskDefinition[] {
  const rawTasks = Array.isArray(settings.tasks) ? settings.tasks : [];
  const tasks: GuideTaskDefinition[] = [];

  for (let index = 0; index < rawTasks.length; index++) {
    const raw = rawTasks[index];
    if (!raw || typeof raw !== "object") {
      continue;
    }
    const task = raw as Record<string, unknown>;
    const title = asString(task.title).trim();
    if (!title) {
      continue;
    }
    tasks.push({
      guideTaskKey: buildGuideTaskKey(index, title, task),
      title,
      description: asString(task.description),
      priority: asString(task.priority, "medium"),
      required: asBoolean(task.required),
      dueDate: asString(task.due_date),
    });
  }

  return tasks;
}

export function mapParticipantTaskRow(raw: {
  id: string;
  track_id: string;
  stage_id: string;
  element_id: string;
  task_source: string;
  guide_task_key: string | null;
  title: string;
  description: string | null;
  priority: string | null;
  due_date: string | null;
  is_completed: boolean;
  sort_order: number | null;
}): ParticipantTaskRowView {
  return {
    id: raw.id,
    trackId: raw.track_id,
    stageId: raw.stage_id,
    elementId: raw.element_id,
    taskSource: raw.task_source === "participant" ? "participant" : "guide",
    guideTaskKey: raw.guide_task_key,
    title: raw.title,
    description: raw.description,
    priority: raw.priority ?? "medium",
    dueDate: raw.due_date,
    isCompleted: Boolean(raw.is_completed),
    sortOrder: raw.sort_order,
  };
}

export function getTasksForElement(
  elementId: string,
  allTasks: ParticipantTaskRowView[]
): ParticipantTaskRowView[] {
  return allTasks.filter((task) => task.elementId === elementId);
}

export function getGuideTaskCompletion(
  elementId: string,
  guideTaskKey: string,
  allTasks: ParticipantTaskRowView[]
): ParticipantTaskRowView | undefined {
  return allTasks.find(
    (task) =>
      task.elementId === elementId &&
      task.taskSource === "guide" &&
      task.guideTaskKey === guideTaskKey
  );
}

export function buildSidebarPendingTasks(
  elements: StageElement[],
  savedRows: ParticipantTaskRowView[]
): SidebarTaskItem[] {
  const pending: SidebarTaskItem[] = [];

  for (const element of elements) {
    if (element.element_type !== "task_list" || !element.is_enabled) {
      continue;
    }

    const settings = asRecord(element.settings_json);
    const guideTasks = parseGuideTasksFromSettings(settings);
    const guideRowsByKey = new Map(
      savedRows
        .filter(
          (row) => row.elementId === element.id && row.taskSource === "guide"
        )
        .map((row) => [row.guideTaskKey ?? "", row])
    );

    for (const guideTask of guideTasks) {
      const saved = guideRowsByKey.get(guideTask.guideTaskKey);
      if (saved?.isCompleted) {
        continue;
      }
      pending.push({
        title: guideTask.title,
        description: guideTask.description,
        priority: guideTask.priority,
        dueDate: guideTask.dueDate || saved?.dueDate || "",
      });
    }

    for (const row of savedRows) {
      if (
        row.elementId === element.id &&
        row.taskSource === "participant" &&
        !row.isCompleted
      ) {
        pending.push({
          title: row.title,
          description: row.description ?? "",
          priority: row.priority,
          dueDate: row.dueDate ?? "",
        });
      }
    }
  }

  return pending;
}
