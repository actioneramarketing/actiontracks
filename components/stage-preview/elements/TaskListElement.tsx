"use client";

import {
  createParticipantTask,
  deleteParticipantTask,
  toggleTaskCompletion,
} from "@/lib/actions/participant-tasks";
import { StageElement } from "@/lib/types/database";
import { asRecord } from "@/lib/utils/element-settings";
import {
  getGuideTaskCompletion,
  getTasksForElement,
  GuideTaskDefinition,
  parseGuideTasksFromSettings,
  ParticipantTaskRowView,
} from "@/lib/utils/participant-tasks";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  priorityBadgeClass,
  priorityIconClass,
} from "../element-ux-styles";

interface TaskListElementProps {
  element: StageElement;
  trackId: string;
  stageId: string;
  trackSlug: string;
  stageSlug: string;
  savedTasks: ParticipantTaskRowView[];
}

function formatDueDate(value: string | null | undefined): string | null {
  if (!value?.trim()) {
    return null;
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }
  return new Date(parsed).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function PriorityBadge({ priority }: { priority: string }) {
  const label = priority.charAt(0).toUpperCase() + priority.slice(1);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${priorityBadgeClass(priority)}`}
    >
      <i className={`fa-solid ${priorityIconClass(priority)} mr-1 text-[9px]`} />
      {label}
    </span>
  );
}

function GuideTaskRow({
  task,
  isCompleted,
  context,
}: {
  task: GuideTaskDefinition;
  isCompleted: boolean;
  context: Omit<TaskListElementProps, "element" | "savedTasks"> & { elementId: string };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleToggle(nextCompleted: boolean) {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const formData = new FormData(form);
    formData.set("is_completed", nextCompleted ? "true" : "false");

    startTransition(async () => {
      const result = await toggleTaskCompletion(formData);
      if (!result.error) {
        router.refresh();
      }
    });
  }

  const dueDate = formatDueDate(task.dueDate);

  return (
    <form ref={formRef} className="contents">
      <input type="hidden" name="track_id" value={context.trackId} />
      <input type="hidden" name="stage_id" value={context.stageId} />
      <input type="hidden" name="element_id" value={context.elementId} />
      <input type="hidden" name="track_slug" value={context.trackSlug} />
      <input type="hidden" name="stage_slug" value={context.stageSlug} />
      <input type="hidden" name="task_source" value="guide" />
      <input type="hidden" name="guide_task_key" value={task.guideTaskKey} />
      <input type="hidden" name="title" value={task.title} />
      <input type="hidden" name="description" value={task.description} />
      <input type="hidden" name="priority" value={task.priority} />
      <input type="hidden" name="due_date" value={task.dueDate} />
      <input type="hidden" name="is_completed" value={isCompleted ? "true" : "false"} />

      <div
        className={`flex items-start p-3 rounded-lg border transition-colors ${
          isCompleted
            ? "border-slate-200 bg-slate-50"
            : "border-slate-200 hover:border-teal-300 hover:bg-teal-50/30"
        } ${isPending ? "opacity-60" : ""}`}
      >
        <input
          type="checkbox"
          checked={isCompleted}
          disabled={isPending}
          onChange={(event) => handleToggle(event.target.checked)}
          className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mr-3 mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`text-sm font-medium ${
                isCompleted ? "text-slate-400 line-through" : "text-slate-700"
              }`}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {task.priority ? <PriorityBadge priority={task.priority} /> : null}
              {dueDate ? (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <i className="fa-regular fa-calendar text-[10px]" /> {dueDate}
                </span>
              ) : null}
            </div>
          </div>
          {task.description ? (
            <p
              className={`text-xs mt-1 ${
                isCompleted ? "text-slate-400 line-through" : "text-slate-500"
              }`}
            >
              {task.description}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function PersonalTaskRow({
  task,
  context,
}: {
  task: ParticipantTaskRowView;
  context: Omit<TaskListElementProps, "element" | "savedTasks"> & { elementId: string };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleToggle(nextCompleted: boolean) {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const formData = new FormData(form);
    formData.set("is_completed", nextCompleted ? "true" : "false");

    startTransition(async () => {
      const result = await toggleTaskCompletion(formData);
      if (!result.error) {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    const form = formRef.current;
    if (!form) {
      return;
    }

    startTransition(async () => {
      const result = await deleteParticipantTask(new FormData(form));
      if (!result.error) {
        router.refresh();
      }
    });
  }

  const dueDate = formatDueDate(task.dueDate);

  return (
    <form ref={formRef} className="contents">
      <input type="hidden" name="track_id" value={context.trackId} />
      <input type="hidden" name="stage_id" value={context.stageId} />
      <input type="hidden" name="element_id" value={context.elementId} />
      <input type="hidden" name="track_slug" value={context.trackSlug} />
      <input type="hidden" name="stage_slug" value={context.stageSlug} />
      <input type="hidden" name="task_source" value="participant" />
      <input type="hidden" name="participant_task_id" value={task.id} />
      <input type="hidden" name="is_completed" value={task.isCompleted ? "true" : "false"} />

      <div
        className={`flex items-start p-3 rounded-lg border transition-colors ${
          task.isCompleted
            ? "border-slate-200 bg-slate-50"
            : "border-slate-200 hover:border-teal-300 hover:bg-teal-50/30"
        } ${isPending ? "opacity-60" : ""}`}
      >
        <input
          type="checkbox"
          checked={task.isCompleted}
          disabled={isPending}
          onChange={(event) => handleToggle(event.target.checked)}
          className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mr-3 mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`text-sm font-medium ${
                task.isCompleted ? "text-slate-400 line-through" : "text-slate-700"
              }`}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {task.priority ? <PriorityBadge priority={task.priority} /> : null}
              {dueDate ? (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <i className="fa-regular fa-calendar text-[10px]" /> {dueDate}
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                aria-label="Delete task"
              >
                <i className="fa-solid fa-trash-can text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export function TaskListElement({
  element,
  trackId,
  stageId,
  trackSlug,
  stageSlug,
  savedTasks,
}: TaskListElementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const settings = asRecord(element.settings_json);
  const guideTasks = parseGuideTasksFromSettings(settings);
  const elementTasks = getTasksForElement(element.id, savedTasks);
  const personalTasks = elementTasks
    .filter((task) => task.taskSource === "participant")
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const context = {
    trackId,
    stageId,
    trackSlug,
    stageSlug,
    elementId: element.id,
  };

  function handleCreate(formData: FormData) {
    setError(null);
    formData.set("track_id", trackId);
    formData.set("stage_id", stageId);
    formData.set("element_id", element.id);
    formData.set("track_slug", trackSlug);
    formData.set("stage_slug", stageSlug);
    formData.set("title", title.trim());
    formData.set("priority", priority);

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    startTransition(async () => {
      const result = await createParticipantTask(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setTitle("");
      setPriority("medium");
      router.refresh();
    });
  }

  return (
    <div className="px-6 border-t border-slate-100 pt-4 pb-6">
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Stage Tasks
        </p>
        {guideTasks.length === 0 ? (
          <p className="text-sm text-slate-500">No stage tasks configured yet.</p>
        ) : (
          <div className="space-y-2">
            {guideTasks.map((task) => {
              const saved = getGuideTaskCompletion(element.id, task.guideTaskKey, savedTasks);
              return (
                <GuideTaskRow
                  key={task.guideTaskKey}
                  task={task}
                  isCompleted={saved?.isCompleted ?? false}
                  context={context}
                />
              );
            })}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          My Tasks
        </p>
        {personalTasks.length > 0 ? (
          <div className="space-y-2 mb-3">
            {personalTasks.map((task) => (
              <PersonalTaskRow key={task.id} task={task} context={context} />
            ))}
          </div>
        ) : null}

        <form action={handleCreate} className="flex flex-wrap gap-2">
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a new task..."
            disabled={isPending}
            className="flex-1 min-w-[180px] px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          />
          <select
            name="priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            disabled={isPending}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-60"
          >
            <i className="fa-solid fa-plus" />
          </button>
        </form>
        {error ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
      </div>
    </div>
  );
}
