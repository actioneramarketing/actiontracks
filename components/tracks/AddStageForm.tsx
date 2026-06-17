"use client";

import { createStage } from "@/lib/actions/stages";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface AddStageFormProps {
  trackId: string;
}

function FormField({
  label,
  name,
  placeholder,
  textarea = false,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={2}
          required={required}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      ) : (
        <input
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      )}
    </div>
  );
}

export function AddStageForm({ trackId }: AddStageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        await createStage(trackId, formData);
        setSuccess("Stage created.");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create stage.");
      }
    });
  }

  return (
    <Card className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Stage</h2>
      <form action={handleSubmit} className="space-y-4">
        <FormField
          label="Stage Title"
          name="title"
          placeholder="e.g. Define Your Topic"
          required
        />
        <FormField
          label="Subtitle"
          name="subtitle"
          placeholder="Short supporting line for this stage"
        />
        <FormField
          label="Stage Goal"
          name="stage_goal"
          placeholder="What should participants achieve in this stage?"
          textarea
        />
        <FormField
          label="What You'll Accomplish"
          name="what_youll_accomplish"
          placeholder="Participant-facing accomplishment summary"
          textarea
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="Next Action Title"
            name="next_action_title"
            placeholder="e.g. Complete your worksheet"
          />
          <FormField
            label="Next Action Description"
            name="next_action_description"
            placeholder="Brief instructions for the next action"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="is_final_stage"
            className="rounded border-gray-300"
          />
          Final stage
        </label>
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <Button type="submit" variant="accent" disabled={isPending}>
            {isPending ? "Adding..." : "Add Stage"}
          </Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
          {success && <span className="text-sm text-teal-700">{success}</span>}
        </div>
      </form>
    </Card>
  );
}
