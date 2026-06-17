"use client";

import {
  createStageElement,
  deleteStageElement,
  updateStageElement,
} from "@/lib/actions/stage-elements";
import {
  ELEMENT_TYPE_ICONS,
  ELEMENT_TYPE_LABELS,
  STAGE_ELEMENT_TYPES,
} from "@/lib/constants/element-types";
import { StageElement, StageElementType } from "@/lib/types/database";
import {
  asRecord,
  asResourceArray,
  asString,
  asStringArray,
  asTaskArray,
} from "@/lib/utils/element-settings";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { StageElementSettingsFields } from "./StageElementSettingsFields";

interface StageElementsSectionProps {
  elements: StageElement[];
  trackId: string;
  stageId: string;
}

export function StageElementsSection({
  elements,
  trackId,
  stageId,
}: StageElementsSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [elementType, setElementType] = useState<StageElementType>("live_call");
  const [sectionError, setSectionError] = useState<string | null>(null);

  async function handleAddElement() {
    setSectionError(null);
    startTransition(async () => {
      try {
        await createStageElement(stageId, trackId, elementType);
        router.refresh();
      } catch (error) {
        setSectionError(
          error instanceof Error ? error.message : "Failed to add element."
        );
      }
    });
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Stage Elements</h2>
        <div className="flex items-center gap-2">
          <select
            value={elementType}
            onChange={(e) => setElementType(e.target.value as StageElementType)}
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

      {sectionError && (
        <p className="mb-3 text-sm text-red-600">{sectionError}</p>
      )}

      {elements.length === 0 ? (
        <Card className="text-sm text-gray-500">
          No elements yet. Choose a type and click Add Element.
        </Card>
      ) : (
        <div className="space-y-3">
          {elements.map((element) => (
            <StageElementEditorCard
              key={element.id}
              element={element}
              trackId={trackId}
              stageId={stageId}
              isPending={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StageElementEditorCard({
  element,
  trackId,
  stageId,
  isPending,
}: {
  element: StageElement;
  trackId: string;
  stageId: string;
  isPending: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [localPending, startTransition] = useTransition();

  const label = ELEMENT_TYPE_LABELS[element.element_type];
  const icon = ELEMENT_TYPE_ICONS[element.element_type];
  const pending = isPending || localPending;

  async function handleSave(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateStageElement(element.id, formData);
        setMessage("Saved.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to save.");
      }
    });
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${element.title ?? label}"?`)) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteStageElement(element.id);
        router.refresh();
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to delete element."
        );
      }
    });
  }

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
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-gray-900">
              {element.title ?? label}
            </h4>
            <span className="text-xs text-gray-400">{label}</span>
            {element.is_enabled && (
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
                Enabled
              </span>
            )}
            {element.is_required && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                Required
              </span>
            )}
          </div>
          {element.description && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
              {element.description}
            </p>
          )}
        </div>
        <span className="text-gray-400 text-lg">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <form
          action={handleSave}
          className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-4"
        >
          <input type="hidden" name="track_id" value={trackId} />
          <input type="hidden" name="stage_id" value={stageId} />
          <input type="hidden" name="element_type" value={element.element_type} />

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

          <div className="flex flex-wrap gap-4">
            <CheckboxField
              label="Required"
              name="is_required"
              defaultChecked={element.is_required}
            />
            <CheckboxField
              label="Enabled"
              name="is_enabled"
              defaultChecked={element.is_enabled}
            />
          </div>

          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              {label} Settings
            </p>
            <StageElementSettingsFields
              elementType={element.element_type}
              settings={asRecord(element.settings_json)}
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" variant="secondary" size="sm" disabled={pending}>
              Save Element
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={handleDelete}
            >
              Delete Element
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
  type = "text",
  textarea = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={2}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}

function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="rounded border-gray-300"
      />
      {label}
    </label>
  );
}