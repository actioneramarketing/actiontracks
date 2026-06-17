"use client";

import {
  createStageElement,
  deleteStageElement,
  updateStageElement,
} from "@/lib/actions/stage-elements";
import { updateStage } from "@/lib/actions/stages";
import {
  ELEMENT_TYPE_ICONS,
  ELEMENT_TYPE_LABELS,
  STAGE_ELEMENT_TYPES,
} from "@/lib/constants/element-types";
import { ActionTrack, ActionTrackStage, StageElement } from "@/lib/types/database";
import { PageContainer } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface StageBuilderClientProps {
  track: ActionTrack;
  stage: ActionTrackStage;
  elements: StageElement[];
  trackId: string;
  stageId: string;
}

export function StageBuilderClient({
  track,
  stage,
  elements,
  trackId,
  stageId,
}: StageBuilderClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [stageMessage, setStageMessage] = useState<string | null>(null);
  const [elementType, setElementType] = useState(STAGE_ELEMENT_TYPES[0]);
  const [elementMessages, setElementMessages] = useState<Record<string, string>>({});

  async function handleStageSave(formData: FormData) {
    setStageMessage(null);
    startTransition(async () => {
      try {
        await updateStage(stageId, formData);
        setStageMessage("Stage saved.");
        router.refresh();
      } catch (error) {
        setStageMessage(
          error instanceof Error ? error.message : "Failed to save stage."
        );
      }
    });
  }

  async function handleAddElement() {
    startTransition(async () => {
      try {
        await createStageElement(stageId, trackId, elementType);
        router.refresh();
      } catch (error) {
        setStageMessage(
          error instanceof Error ? error.message : "Failed to add element."
        );
      }
    });
  }

  async function handleElementSave(elementId: string, formData: FormData) {
    setElementMessages((prev) => ({ ...prev, [elementId]: "" }));
    startTransition(async () => {
      try {
        await updateStageElement(elementId, formData);
        setElementMessages((prev) => ({ ...prev, [elementId]: "Saved." }));
        router.refresh();
      } catch (error) {
        setElementMessages((prev) => ({
          ...prev,
          [elementId]:
            error instanceof Error ? error.message : "Failed to save element.",
        }));
      }
    });
  }

  async function handleDeleteElement(elementId: string) {
    startTransition(async () => {
      try {
        await deleteStageElement(elementId, trackId, stageId);
        router.refresh();
      } catch (error) {
        setStageMessage(
          error instanceof Error ? error.message : "Failed to delete element."
        );
      }
    });
  }

  const enabledElements = elements.filter((el) => el.is_enabled);

  return (
    <PageContainer wide>
      <div className="mb-6">
        <Link
          href={`/guide/tracks/${trackId}/stages`}
          className="text-sm text-gray-500 hover:text-teal-700"
        >
          ← Back to Stages
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Stage {stage.stage_number}: {stage.title}
        </h1>
        <p className="text-gray-600">{track.title}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Stage Settings
            </h2>
            <form action={handleStageSave} className="space-y-4">
              <input type="hidden" name="track_id" value={trackId} />
              <FormField label="Stage Title" name="title" defaultValue={stage.title} />
              <FormField
                label="Stage Subtitle"
                name="subtitle"
                defaultValue={stage.subtitle ?? ""}
              />
              <FormField
                label="Stage Goal"
                name="stage_goal"
                defaultValue={stage.stage_goal ?? ""}
                textarea
              />
              <FormField
                label="What You'll Accomplish"
                name="what_youll_accomplish"
                defaultValue={stage.what_youll_accomplish ?? ""}
                textarea
              />
              <FormField
                label="Next Action Title"
                name="next_action_title"
                defaultValue={stage.next_action_title ?? ""}
              />
              <FormField
                label="Next Action Description"
                name="next_action_description"
                defaultValue={stage.next_action_description ?? ""}
                textarea
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="is_final_stage"
                  defaultChecked={stage.is_final_stage}
                  className="rounded border-gray-300"
                />
                Final stage
              </label>
              <div className="pt-2 flex items-center gap-3">
                <Button type="submit" variant="primary" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Stage"}
                </Button>
                {stageMessage && (
                  <span className="text-sm text-gray-600">{stageMessage}</span>
                )}
              </div>
            </form>
          </Card>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Stage Elements
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={elementType}
                  onChange={(e) => setElementType(e.target.value as typeof elementType)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
                >
                  {STAGE_ELEMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {ELEMENT_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="accent"
                  size="sm"
                  disabled={isPending}
                  onClick={handleAddElement}
                >
                  Add Element
                </Button>
              </div>
            </div>

            {elements.length === 0 ? (
              <Card className="text-sm text-gray-500">
                No elements yet. Add one using the dropdown above.
              </Card>
            ) : (
              <div className="space-y-3">
                {elements.map((element) => (
                  <ElementEditorCard
                    key={element.id}
                    element={element}
                    trackId={trackId}
                    stageId={stageId}
                    isPending={isPending}
                    message={elementMessages[element.id]}
                    onSave={handleElementSave}
                    onDelete={handleDeleteElement}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-teal-50 to-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Stage Preview
            </h2>
            <div className="rounded-lg bg-white p-4 border border-teal-100">
              <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">
                Stage {stage.stage_number}
              </p>
              <h3 className="font-semibold text-gray-900 mt-1">{stage.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {stage.subtitle ?? stage.stage_goal}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {enabledElements.map((el) => (
                  <span
                    key={el.id}
                    className="text-xs bg-gray-50 px-2 py-0.5 rounded ring-1 ring-gray-200"
                  >
                    {el.title ?? ELEMENT_TYPE_LABELS[el.element_type]}
                  </span>
                ))}
              </div>
            </div>
            <Button
              href={`/track/${track.slug}/stages/${stage.slug}`}
              variant="outline"
              size="sm"
              className="w-full mt-4"
            >
              View Participant Preview
            </Button>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Builder Help
            </h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-teal-600">1.</span>
                Configure stage settings to define the participant experience.
              </li>
              <li className="flex gap-2">
                <span className="text-teal-600">2.</span>
                Add and configure support elements for this stage.
              </li>
              <li className="flex gap-2">
                <span className="text-teal-600">3.</span>
                Use the preview to see how participants will experience the stage.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function ElementEditorCard({
  element,
  trackId,
  stageId,
  isPending,
  message,
  onSave,
  onDelete,
}: {
  element: StageElement;
  trackId: string;
  stageId: string;
  isPending: boolean;
  message?: string;
  onSave: (elementId: string, formData: FormData) => void;
  onDelete: (elementId: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const label = ELEMENT_TYPE_LABELS[element.element_type];
  const icon = ELEMENT_TYPE_ICONS[element.element_type];
  const settingsValue =
    element.settings_json && Object.keys(element.settings_json).length > 0
      ? JSON.stringify(element.settings_json, null, 2)
      : "";

  return (
    <div
      className={`rounded-xl border bg-white ${
        element.is_enabled ? "border-teal-200 shadow-sm" : "border-gray-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className="text-xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900">
              {element.title ?? label}
            </h4>
            {element.is_enabled && (
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
                Enabled
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        </div>
        <span className="text-gray-400 text-lg">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <form
          action={(formData) => onSave(element.id, formData)}
          className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3"
        >
          <input type="hidden" name="track_id" value={trackId} />
          <input type="hidden" name="stage_id" value={stageId} />
          <FormField
            label="Title"
            name="title"
            defaultValue={element.title ?? label}
          />
          <FormField
            label="Description"
            name="description"
            defaultValue={element.description ?? ""}
            textarea
          />
          <FormField
            label="Settings JSON"
            name="settings_json"
            defaultValue={settingsValue}
            textarea
          />
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="is_required"
                defaultChecked={element.is_required}
                className="rounded border-gray-300"
              />
              Required
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="is_enabled"
                defaultChecked={element.is_enabled}
                className="rounded border-gray-300"
              />
              Enabled
            </label>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" variant="secondary" size="sm" disabled={isPending}>
              Save Element
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => onDelete(element.id)}
            >
              Delete
            </Button>
            {message && <span className="text-xs text-gray-600">{message}</span>}
          </div>
        </form>
      )}
    </div>
  );
}

function FormField({
  label,
  name,
  defaultValue,
  textarea = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={2}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
        />
      )}
    </div>
  );
}
