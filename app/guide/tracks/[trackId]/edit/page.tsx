"use client";

import { PageContainer } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { demoTrack } from "@/lib/demo-data";
import Link from "next/link";
import { useState } from "react";

const tabs = [
  "Track Details",
  "Welcome Page",
  "Completion Page",
  "Preview",
] as const;

type Tab = (typeof tabs)[number];

export default function EditTrackPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Track Details");

  return (
    <PageContainer wide>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/guide/tracks"
            className="text-sm text-gray-500 hover:text-teal-700"
          >
            ← Back to Manage Action Tracks
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Edit Action Track
          </h1>
          <p className="text-gray-600">{demoTrack.title}</p>
        </div>
        <div className="flex gap-2">
          <Button href="/guide/tracks/demo-track/stages" variant="secondary">
            Manage Stages
          </Button>
          <Button href="/guide/tracks/demo-track/preview" variant="accent">
            Preview Track
          </Button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Track Details" && (
        <Card padding="lg" className="max-w-2xl">
          <div className="space-y-5">
            {[
              { label: "Track Title", value: demoTrack.title },
              { label: "Short Description", value: demoTrack.shortDescription, textarea: true },
              { label: "Primary Outcome", value: demoTrack.primaryOutcome, textarea: true },
              { label: "Who This Is For", value: demoTrack.whoThisIsFor, textarea: true },
              { label: "Duration (Weeks)", value: String(demoTrack.durationWeeks) },
              { label: "Track Type", value: demoTrack.trackType },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {field.label}
                </label>
                {field.textarea ? (
                  <textarea
                    defaultValue={field.value}
                    rows={3}
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
      )}

      {activeTab === "Welcome Page" && (
        <Card padding="lg">
          <h3 className="font-semibold text-gray-900 mb-4">Welcome Page Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Welcome Headline
              </label>
              <input
                defaultValue="Welcome to Your Action Track"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Track Philosophy
              </label>
              <textarea
                defaultValue={demoTrack.philosophy}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Before We Begin Checklist Items
              </label>
              <textarea
                defaultValue="Review schedule, set up tools, introduce yourself, complete commitment"
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                readOnly
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === "Completion Page" && (
        <Card padding="lg">
          <h3 className="font-semibold text-gray-900 mb-4">Completion Page Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Completion Headline
              </label>
              <input
                defaultValue="Congratulations — You Did It!"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Submission Instructions
              </label>
              <textarea
                defaultValue="Share your live podcast link and final reflection to complete the track."
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reward Description
              </label>
              <textarea
                defaultValue="Unlock your Podcast Launch Certificate and exclusive alumni community access."
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
                readOnly
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === "Preview" && (
        <Card padding="lg" className="text-center">
          <p className="text-gray-600 mb-4">
            Preview how participants will experience this track.
          </p>
          <Button href="/track/podcast-launch-track/welcome" variant="accent">
            Open Participant Preview
          </Button>
        </Card>
      )}
    </PageContainer>
  );
}
