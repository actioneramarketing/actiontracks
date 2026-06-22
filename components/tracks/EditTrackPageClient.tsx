"use client";

import { updateActionTrack } from "@/lib/actions/tracks";
import { NormalizedActionTrack } from "@/lib/utils/normalize-action-track";
import { BuilderPageHeader } from "@/components/builder/BuilderPageHeader";
import { BuilderFormField, BuilderSelectField } from "@/components/builder/BuilderFormField";
import { FormSection } from "@/components/builder/FormSection";
import { BuilderComingSoonCard } from "@/components/tracks/BuilderComingSoonCard";
import { ActionTrackAssetsSection } from "@/components/tracks/ActionTrackAssetsSection";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Track Details");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateActionTrack(trackId, formData);
        router.refresh();
        setMessage("Changes saved.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Failed to save track.");
      }
    });
  }

  return (
    <PageContainer wide className="max-w-5xl">
      <BuilderPageHeader
        backHref="/guide/tracks"
        backLabel="Back to Dashboard"
        title={track.title || "Untitled Action Track"}
        subtitle="Edit track details, schedule, and participant-facing settings."
        status={track.status}
        trackIconUrl={track.track_icon_url || undefined}
        actions={
          <>
            <Button href={`/guide/tracks/${trackId}/stages`} variant="secondary">
              Manage Stages
            </Button>
            <Button href={`/guide/tracks/${trackId}/preview`} variant="accent">
              Preview Track
            </Button>
          </>
        }
      />

      <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
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
        <Card padding="lg" className="shadow-sm">
          <form action={handleSave} className="space-y-8">
            <FormSection
              title="Track Identity"
              description="Core details that define this Action Track."
            >
              <BuilderFormField
                label="Track Title"
                name="title"
                defaultValue={track.title}
              />
              <BuilderFormField
                label="Short Description"
                name="short_description"
                defaultValue={track.short_description}
                textarea
              />
            </FormSection>

            <FormSection
              title="Audience & Promise"
              description="What participants will achieve and who this track serves."
            >
              <BuilderFormField
                label="Primary Outcome"
                name="primary_outcome"
                defaultValue={track.primary_outcome}
                textarea
              />
              <BuilderFormField
                label="Who This Is For"
                name="who_this_is_for"
                defaultValue={track.who_this_is_for}
                textarea
              />
            </FormSection>

            <FormSection
              title="Schedule & Access"
              description="Duration, format, dates, and publication status."
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <BuilderFormField
                  label="Duration (Weeks)"
                  name="duration_weeks"
                  type="number"
                  defaultValue={
                    track.duration_weeks > 0 ? String(track.duration_weeks) : ""
                  }
                />
                <BuilderSelectField
                  label="Track Type"
                  name="track_type"
                  defaultValue={track.track_type}
                >
                  <option value="live_guided">Live Guided</option>
                  <option value="cohort">Cohort</option>
                  <option value="self-paced">Self-Paced</option>
                  <option value="hybrid">Hybrid</option>
                </BuilderSelectField>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <BuilderFormField
                  label="Start Date"
                  name="start_date"
                  type="date"
                  defaultValue={track.start_date}
                />
                <BuilderFormField
                  label="End Date"
                  name="end_date"
                  type="date"
                  defaultValue={track.end_date}
                />
              </div>
              <BuilderSelectField label="Status" name="status" defaultValue={track.status}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </BuilderSelectField>
            </FormSection>

            <FormSection
              title="Action Track Assets"
              description="Upload a cover image and icon for this Action Track."
            >
              <ActionTrackAssetsSection
                trackId={trackId}
                trackImageUrl={track.track_image_url}
                trackIconUrl={track.track_icon_url}
              />
            </FormSection>

            <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3">
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
              {message && (
                <span className="text-sm text-teal-700">{message}</span>
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
        <Card padding="lg" className="text-center shadow-sm max-w-xl mx-auto">
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
