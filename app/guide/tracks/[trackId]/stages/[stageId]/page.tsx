"use client";

import { PageContainer } from "@/components/layout/Nav";
import {
  ElementBlock,
  ElementConfigField,
} from "@/components/tracks/ElementBlock";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getStageById, stageElements, demoTrack } from "@/lib/demo-data";
import Link from "next/link";
import { use } from "react";

interface PageProps {
  params: Promise<{ trackId: string; stageId: string }>;
}

export default function StageBuilderPage({ params }: PageProps) {
  const { trackId, stageId } = use(params);
  const stage = getStageById(stageId) ?? getStageById("stage-1")!;

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
          Stage {stage.number}: {stage.title}
        </h1>
        <p className="text-gray-600">{demoTrack.title}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Stage Settings
            </h2>
            <div className="space-y-4">
              {[
                { label: "Stage Title", value: stage.title },
                { label: "Stage Subtitle", value: stage.subtitle },
                { label: "Stage Goal", value: stage.goal, textarea: true },
                { label: "Next Action Title", value: stage.nextActionTitle },
                {
                  label: "Next Action Description",
                  value: stage.nextActionDescription,
                  textarea: true,
                },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label}
                  </label>
                  {field.textarea ? (
                    <textarea
                      defaultValue={field.value}
                      rows={2}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                      readOnly
                    />
                  ) : (
                    <input
                      defaultValue={field.value}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                      readOnly
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Stage Elements
              </h2>
              <Button variant="accent" size="sm" disabled className="opacity-60 cursor-not-allowed">
                Add Element
              </Button>
            </div>
            <div className="space-y-3">
              {stageElements.map((el) => {
                const isEnabled = stage.elements.includes(el.name);
                return (
                  <ElementBlock
                    key={el.id}
                    name={el.name}
                    description={el.description}
                    icon={el.icon}
                    enabled={isEnabled}
                  >
                    <ElementConfigField
                      label="Display Title"
                      placeholder={el.name}
                    />
                    <ElementConfigField
                      label="Instructions"
                      placeholder={`Configure ${el.name.toLowerCase()} settings...`}
                      type="textarea"
                    />
                  </ElementBlock>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-teal-50 to-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Stage Preview
            </h2>
            <div className="rounded-lg bg-white p-4 border border-teal-100">
              <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">
                Stage {stage.number}
              </p>
              <h3 className="font-semibold text-gray-900 mt-1">{stage.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{stage.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {stage.elements.map((el) => (
                  <span
                    key={el}
                    className="text-xs bg-gray-50 px-2 py-0.5 rounded ring-1 ring-gray-200"
                  >
                    {el}
                  </span>
                ))}
              </div>
            </div>
            <Button
              href={`/track/${demoTrack.slug}/stages/${stage.slug}`}
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
                Enable and configure support elements for this stage.
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
