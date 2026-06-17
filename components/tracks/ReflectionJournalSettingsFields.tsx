"use client";

import {
  asString,
  getReflectionJournalPrompts,
} from "@/lib/utils/element-settings";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface ReflectionJournalSettingsFieldsProps {
  settings: Record<string, unknown>;
}

export function ReflectionJournalSettingsFields({
  settings,
}: ReflectionJournalSettingsFieldsProps) {
  const [prompts, setPrompts] = useState<string[]>(() =>
    getReflectionJournalPrompts(settings)
  );

  function addPrompt() {
    setPrompts((current) => [...current, ""]);
  }

  function updatePrompt(index: number, value: string) {
    setPrompts((current) =>
      current.map((prompt, i) => (i === index ? value : prompt))
    );
  }

  function removePrompt(index: number) {
    if (prompts.length <= 1) {
      return;
    }
    setPrompts((current) => current.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="prompt_count" value={prompts.length} />

      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          Journal Prompts
        </p>
        <div className="space-y-3">
          {prompts.map((prompt, index) => (
            <div key={index} className="rounded-lg border border-gray-100 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="block text-xs font-medium text-gray-600">
                  Prompt {index + 1}
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={prompts.length <= 1}
                  onClick={() => removePrompt(index)}
                  className="px-2 py-1 text-xs text-gray-500"
                >
                  Remove
                </Button>
              </div>
              <textarea
                name={`journal_prompt_${index}`}
                value={prompt}
                onChange={(e) => updatePrompt(index, e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPrompt}
          className="mt-3"
        >
          + Add Journal Prompt
        </Button>
      </div>

      <Field
        label="Supporting Guidance"
        name="supporting_guidance"
        defaultValue={asString(settings.supporting_guidance)}
        textarea
      />
      <Field
        label="Estimated Time"
        name="estimated_time"
        defaultValue={asString(settings.estimated_time, "5-10 minutes")}
      />
    </div>
  );
}

function Field({
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
          name={name}
          defaultValue={defaultValue}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}
