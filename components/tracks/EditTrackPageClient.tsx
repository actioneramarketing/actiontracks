"use client";

import { updateActionTrack } from "@/lib/actions/tracks";
import { NormalizedActionTrack } from "@/lib/utils/normalize-action-track";
import { PageContainer } from "@/components/layout/Nav";
import { BuilderComingSoonCard } from "@/components/tracks/BuilderComingSoonCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useState, useTransition } from "react";

const tabs = [
  "Track Details",
  "Welcome Page",
  "Completion Page",
  "Preview",
] as const;

type Tab = (typeof tabs)[number];

interface EditTrackPageClientProps {
  track: NormalizedActionTrack;
  trackId: string;
}

export function EditTrackPageClient({ track, trackId }: EditTrackPageClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Track Details");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateActionTrack(trackId, formData);
        setMessage("Changes saved.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to save track.");
      }
    });
  }

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
          <p className="text-gray-600">{track.title || "Untitled Action Track"}</p>
        </div>
        <div className="flex gap-2">
          <Button href={`/guide/tracks/${trackId}/stages`} variant="secondary">
            Manage Stages
          </Button>
          <Button href={`/guide/tracks/${trackId}/preview`} variant="accent">
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
          <form action={handleSave} className="space-y-5">
            <FormField label="Track Title" name="title" defaultValue={track.title} />
            <FormField
              label="Short Description"
              name="short_description"
              defaultValue={track.short_description}
              textarea
            />
            <FormField
              label="Primary Outcome"
              name="primary_outcome"
              defaultValue={track.primary_outcome}
              textarea
            />
            <FormField
              label="Who This Is For"
              name="who_this_is_for"
              defaultValue={track.who_this_is_for}
              textarea
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField
                label="Duration (Weeks)"
                name="duration_weeks"
                type="number"
                defaultValue={
                  track.duration_weeks > 0 ? String(track.duration_weeks) : ""
                }
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Track Type
                </label>
                <select
                  name="track_type"
                  defaultValue={track.track_type}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-white"
                >
                  <option value="live_guided">Live Guided</option>
                  <option value="cohort">Cohort</option>
                  <option value="self-paced">Self-Paced</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField
                label="Start Date"
                name="start_date"
                type="date"
                defaultValue={track.start_date}
              />
              <FormField
                label="End Date"
                name="end_date"
                type="date"
                defaultValue={track.end_date}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                name="status"
                defaultValue={track.status}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
              {message && (
                <span className="text-sm text-gray-600">{message}</span>
              )}
            </div>
          </form>
        </Card>
      )}

      {activeTab === "Welcome Page" && (
        <BuilderComingSoonCard trackId={trackId} />
      )}

      {activeTab === "Completion Page" && (
        <BuilderComingSoonCard trackId={trackId} />
      )}

      {activeTab === "Preview" && (
        <Card padding="lg" className="text-center">
          <p className="text-gray-600 mb-4">
            Preview how participants will experience this track.
          </p>
          {track.slug ? (
            <Button href={`/track/${track.slug}/welcome`} variant="accent">
              Open Participant Preview
            </Button>
          ) : (
            <p className="text-sm text-gray-500">
              Preview will be available once this track has a slug.
            </p>
          )}
        </Card>
      )}
    </PageContainer>
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
  defaultValue: string;
  type?: string;
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
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      )}
    </div>
  );
}
