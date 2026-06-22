"use client";

import { updateStage } from "@/lib/actions/stages";
import {
  ELEMENT_TYPE_LABELS,
  filterBuilderVisibleElements,
} from "@/lib/constants/element-types";
import { ActionTrack, ActionTrackStage, StageElement } from "@/lib/types/database";
import { BuilderPageHeader } from "@/components/builder/BuilderPageHeader";
import { BuilderFormField } from "@/components/builder/BuilderFormField";
import { FormSection } from "@/components/builder/FormSection";
import { HelpCard } from "@/components/builder/HelpCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { StageElementsSection } from "@/components/tracks/StageElementEditor";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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

  const enabledElements = filterBuilderVisibleElements(
    elements.filter((el) => el.is_enabled)
  );

  return (
    <PageContainer wide className="max-w-6xl">
      <BuilderPageHeader
        backHref={`/guide/tracks/${trackId}/stages`}
        backLabel="Back to Stages"
        title={`Stage ${stage.stage_number}: ${stage.title}`}
        subtitle={track.title}
        actions={
          stage.is_final_stage ? (
            <Badge variant="purple">Final Stage</Badge>
          ) : undefined
        }
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
        <div className="space-y-6">
          <Card padding="lg" className="shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Stage Settings
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Configure how participants experience this stage.
            </p>
            <form action={handleStageSave} className="space-y-6">
              <input type="hidden" name="track_id" value={trackId} />

              <FormSection title="Basics">
                <BuilderFormField
                  label="Stage Title"
                  name="title"
                  defaultValue={stage.title}
                  required
                />
                <BuilderFormField
                  label="Stage Subtitle"
                  name="subtitle"
                  defaultValue={stage.subtitle ?? ""}
                />
                <BuilderFormField
                  label="Stage Goal"
                  name="stage_goal"
                  defaultValue={stage.stage_goal ?? ""}
                  textarea
                  rows={2}
                />
                <BuilderFormField
                  label="Stage Summary"
                  name="stage_summary"
                  defaultValue={stage.stage_summary ?? ""}
                  textarea
                  rows={2}
                  hint="Internal or participant-facing summary of this stage."
                />
              </FormSection>

              <FormSection title="Participant guidance">
                <BuilderFormField
                  label="What You'll Accomplish"
                  name="what_youll_accomplish"
                  defaultValue={stage.what_youll_accomplish ?? ""}
                  textarea
                  rows={2}
                />
                <BuilderFormField
                  label="Next Action Title"
                  name="next_action_title"
                  defaultValue={stage.next_action_title ?? ""}
                />
                <BuilderFormField
                  label="Next Action Description"
                  name="next_action_description"
                  defaultValue={stage.next_action_description ?? ""}
                  textarea
                  rows={2}
                />
              </FormSection>

              <FormSection title="Advanced">
                <BuilderFormField
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
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  Final stage
                </label>
              </FormSection>

              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <Button type="submit" variant="primary" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Stage"}
                </Button>
                {stageMessage && (
                  <span className="text-sm text-teal-700">{stageMessage}</span>
                )}
              </div>
            </form>
          </Card>

          <Card padding="lg" className="shadow-sm">
            <StageElementsSection
              elements={elements}
              trackId={trackId}
              stageId={stageId}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="lg" className="bg-gradient-to-br from-teal-50/80 to-white border-teal-100/80 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Stage Preview
            </h2>
            <div className="rounded-xl bg-white p-4 border border-teal-100 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                Stage {stage.stage_number}
              </p>
              <h3 className="font-semibold text-gray-900 mt-1">{stage.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {stage.subtitle ?? stage.stage_goal}
              </p>
              {stage.what_youll_accomplish ? (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {stage.what_youll_accomplish}
                </p>
              ) : null}
              {stage.next_action_title ? (
                <p className="text-sm text-gray-800 mt-3 font-medium">
                  Next: {stage.next_action_title}
                </p>
              ) : null}
              {stage.is_final_stage ? (
                <p className="text-xs text-violet-700 mt-3 font-semibold uppercase tracking-wide">
                  Final Stage
                </p>
              ) : null}
              {enabledElements.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {enabledElements.map((el) => (
                    <span
                      key={el.id}
                      className="text-xs bg-gray-50 px-2 py-0.5 rounded-full ring-1 ring-gray-200"
                    >
                      {el.title ?? ELEMENT_TYPE_LABELS[el.element_type]}
                    </span>
                  ))}
                </div>
              ) : null}
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

          <HelpCard title="Builder Help">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Configure stage settings to define the participant experience.</li>
              <li>Add and configure support elements for this stage.</li>
              <li>Use the preview to see how participants will experience the stage.</li>
            </ol>
          </HelpCard>
        </div>
      </div>
    </PageContainer>
  );
}
