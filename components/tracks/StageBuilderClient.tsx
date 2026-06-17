"use client";

import { updateStage } from "@/lib/actions/stages";
import { ELEMENT_TYPE_LABELS } from "@/lib/constants/element-types";
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
              <FormField label="Stage Title" name="title" defaultValue={stage.title} required />
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
                label="Stage Summary"
                name="stage_summary"
                defaultValue={stage.stage_summary ?? ""}
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
              <FormField
                label="Unlock Type"
                name="unlock_type"
                defaultValue={stage.unlock_type ?? ""}
                placeholder="e.g. sequential, immediate"
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

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Stage Elements
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Element configuration is coming soon. Existing elements are shown
              below as placeholders.
            </p>
            {elements.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                No elements configured for this stage yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {elements.map((el) => (
                  <span
                    key={el.id}
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs ring-1 ${
                      el.is_enabled
                        ? "bg-teal-50 text-teal-700 ring-teal-200"
                        : "bg-gray-50 text-gray-500 ring-gray-200"
                    }`}
                  >
                    {el.title ?? ELEMENT_TYPE_LABELS[el.element_type]}
                  </span>
                ))}
              </div>
            )}
          </Card>
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
              {stage.what_youll_accomplish && (
                <p className="text-sm text-gray-600 mt-2">
                  {stage.what_youll_accomplish}
                </p>
              )}
              {stage.next_action_title && (
                <p className="text-sm text-gray-700 mt-2 font-medium">
                  Next: {stage.next_action_title}
                </p>
              )}
              {stage.is_final_stage && (
                <p className="text-xs text-violet-700 mt-2 font-medium">
                  Final Stage
                </p>
              )}
              {enabledElements.length > 0 && (
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
              )}
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
                Stage elements will be configurable in a future release.
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

function FormField({
  label,
  name,
  defaultValue,
  placeholder,
  textarea = false,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
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
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={2}
          required={required}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
        />
      )}
    </div>
  );
}
