"use client";

import {
  createStageElement,
  deleteStageElement,
  moveStageElement,
  updateStageElement,
} from "@/lib/actions/stage-elements";
import {
  ADDABLE_STAGE_ELEMENT_TYPES,
  ELEMENT_TYPE_ICONS,
  ELEMENT_TYPE_LABELS,
  filterBuilderVisibleElements,
  type AddableStageElementType,
} from "@/lib/constants/element-types";
import { StageElement } from "@/lib/types/database";
import { asRecord, getReflectionJournalPrompts } from "@/lib/utils/element-settings";
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
  const [elementType, setElementType] = useState<AddableStageElementType>("live_call");
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [openElementId, setOpenElementId] = useState<string | null>(null);

  const builderElements = filterBuilderVisibleElements(elements);

  async function handleAddElement() {
    setSectionError(null);
    startTransition(async () => {
      try {
        const newElementId = await createStageElement(stageId, trackId, elementType);
        setOpenElementId(newElementId);
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Stage Elements</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track Feed is included automatically on every stage.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={elementType}
            onChange={(e) =>
              setElementType(e.target.value as AddableStageElementType)
            }
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white"
          >
            {ADDABLE_STAGE_ELEMENT_TYPES.map((type) => (
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

      {builderElements.length === 0 ? (
        <Card className="text-sm text-gray-500">
          No elements yet. Choose a type and click Add Element.
        </Card>
      ) : (
        <div className="space-y-3">
          {builderElements.map((element, index) => (
            <StageElementEditorCard
              key={element.id}
              element={element}
              trackId={trackId}
              stageId={stageId}
              isPending={isPending}
              isFirst={index === 0}
              isLast={index === builderElements.length - 1}
              isOpen={openElementId === element.id}
              onToggle={() =>
                setOpenElementId((current) =>
                  current === element.id ? null : element.id
                )
              }
              onCollapse={() => setOpenElementId(null)}
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
  isFirst,
  isLast,
  isOpen,
  onToggle,
  onCollapse,
}: {
  element: StageElement;
  trackId: string;
  stageId: string;
  isPending: boolean;
  isFirst: boolean;
  isLast: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onCollapse: () => void;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [localPending, startTransition] = useTransition();

  const label = ELEMENT_TYPE_LABELS[element.element_type];
  const icon = ELEMENT_TYPE_ICONS[element.element_type];
  const pending = isPending || localPending;
  const orderNumber = element.sort_order ?? 0;
  const journalPromptCount =
    element.element_type === "reflection_journal"
      ? getReflectionJournalPrompts(asRecord(element.settings_json)).length
      : 0;
  const collapsedSummary =
    element.element_type === "reflection_journal"
      ? `${journalPromptCount} journal prompt${journalPromptCount === 1 ? "" : "s"}`
      : null;

  async function handleSave(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateStageElement(element.id, formData);
        setMessage("Saved.");
        onCollapse();
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
        onCollapse();
        router.refresh();
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to delete element."
        );
      }
    });
  }

  async function handleMove(direction: "up" | "down") {
    setMessage(null);
    startTransition(async () => {
      try {
        await moveStageElement(element.id, direction);
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to reorder.");
      }
    });
  }

  return (
    <div
      className={`rounded-xl border bg-white ${
        element.is_enabled ? "border-teal-200" : "border-gray-200"
      } ${isOpen ? "shadow-sm" : ""}`}
    >
      <div className="flex items-start gap-2 p-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-start gap-3 text-left min-w-0"
        >
          <span className="text-xl shrink-0">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-gray-100 px-1.5 text-xs font-medium text-gray-600">
                {orderNumber}
              </span>
              <h4 className="font-medium text-gray-900">
                {element.title ?? label}
              </h4>
              <span className="text-xs text-gray-400">{label}</span>
              {element.is_enabled ? (
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
                  Enabled
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  Disabled
                </span>
              )}
              {element.is_required && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                  Required
                </span>
              )}
            </div>
            {!isOpen && collapsedSummary && (
              <p className="text-sm text-teal-700 mt-0.5">{collapsedSummary}</p>
            )}
            {!isOpen && !collapsedSummary && element.description && (
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                {element.description}
              </p>
            )}
          </div>
          <span className="text-gray-400 text-lg shrink-0">{isOpen ? "−" : "+"}</span>
        </button>

        <div className="flex flex-col gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending || isFirst}
            onClick={() => handleMove("up")}
            className="px-2 py-1 text-xs"
          >
            ↑
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending || isLast}
            onClick={() => handleMove("down")}
            className="px-2 py-1 text-xs"
          >
            ↓
          </Button>
        </div>
      </div>

      {isOpen && (
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
