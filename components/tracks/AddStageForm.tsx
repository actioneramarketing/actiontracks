"use client";

import { createStage } from "@/lib/actions/stages";
import { BuilderFormField } from "@/components/builder/BuilderFormField";
import { FormSection } from "@/components/builder/FormSection";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface AddStageFormProps {
  trackId: string;
  defaultExpanded?: boolean;
}

export function AddStageForm({
  trackId,
  defaultExpanded = true,
}: AddStageFormProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(defaultExpanded);
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
    <Card padding="lg" className="mb-8 shadow-sm border-teal-100/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Add Stage</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create a new stage for this Action Track. Stages appear in order.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </div>

      {expanded ? (
        <form action={handleSubmit} className="mt-6 space-y-6">
          <FormSection title="Stage basics">
            <BuilderFormField
              label="Stage Title"
              name="title"
              placeholder="e.g. Define Your Topic"
              required
            />
            <BuilderFormField
              label="Subtitle"
              name="subtitle"
              placeholder="Short supporting line for this stage"
            />
            <BuilderFormField
              label="Stage Goal"
              name="stage_goal"
              placeholder="What should participants achieve in this stage?"
              textarea
              rows={2}
            />
          </FormSection>

          <FormSection title="Participant experience">
            <BuilderFormField
              label="What You'll Accomplish"
              name="what_youll_accomplish"
              placeholder="Participant-facing accomplishment summary"
              textarea
              rows={2}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <BuilderFormField
                label="Next Action Title"
                name="next_action_title"
                placeholder="e.g. Complete your worksheet"
              />
              <BuilderFormField
                label="Next Action Description"
                name="next_action_description"
                placeholder="Brief instructions for the next action"
              />
            </div>
          </FormSection>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="is_final_stage"
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            Mark as final stage
          </label>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
            <Button type="submit" variant="accent" disabled={isPending}>
              {isPending ? "Adding..." : "Add Stage"}
            </Button>
            {error && (
              <span className="text-sm text-red-600" role="alert">
                {error}
              </span>
            )}
            {success && <span className="text-sm text-teal-700">{success}</span>}
          </div>
        </form>
      ) : null}
    </Card>
  );
}
