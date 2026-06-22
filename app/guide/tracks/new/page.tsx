import { BuilderPageHeader } from "@/components/builder/BuilderPageHeader";
import { BuilderFormField, BuilderSelectField } from "@/components/builder/BuilderFormField";
import { FormSection } from "@/components/builder/FormSection";
import { HelpCard } from "@/components/builder/HelpCard";
import { ActionTrackAssetsSection } from "@/components/tracks/ActionTrackAssetsSection";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GuideBuilderPageContainer } from "@/components/auth/GuideBuilderGate";
import { createActionTrack } from "@/lib/actions/tracks";

export default function NewTrackPage() {
  return (
    <GuideBuilderPageContainer className="max-w-5xl">
      <BuilderPageHeader
        backHref="/guide/tracks"
        backLabel="Back to Manage Action Tracks"
        title="Create New Action Track"
        subtitle="Set up the foundation for your guided implementation journey."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card padding="lg" className="shadow-sm">
          <form action={createActionTrack} className="space-y-8">
            <FormSection
              title="Basic Details"
              description="Give your track a clear name and short summary participants will recognize."
            >
              <BuilderFormField
                label="Track Title"
                name="title"
                placeholder="e.g. Podcast Launch Action Track"
                required
                hint="Use a specific, outcome-oriented title."
              />
              <BuilderFormField
                label="Short Description"
                name="short_description"
                placeholder="A brief summary of what participants will achieve..."
                textarea
                hint="This appears on your guide dashboard and future library listings."
              />
            </FormSection>

            <FormSection
              title="Outcome & Audience"
              description="Help participants understand the promise and who this track is for."
            >
              <BuilderFormField
                label="Primary Outcome"
                name="primary_outcome"
                placeholder="What will participants have accomplished when they finish?"
                textarea
              />
              <BuilderFormField
                label="Who This Is For"
                name="who_this_is_for"
                placeholder="Describe your ideal participant..."
                textarea
              />
            </FormSection>

            <FormSection
              title="Track Setup"
              description="Configure duration, format, and schedule for this journey."
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <BuilderFormField
                  label="Duration in Weeks"
                  name="duration_weeks"
                  placeholder="8"
                  type="number"
                  hint="Typical tracks run 4–12 weeks."
                />
                <BuilderSelectField
                  label="Track Type"
                  name="track_type"
                  defaultValue="live_guided"
                  hint="How participants will move through the track."
                >
                  <option value="live_guided">Live Guided</option>
                  <option value="cohort">Cohort</option>
                  <option value="self-paced">Self-Paced</option>
                  <option value="hybrid">Hybrid</option>
                </BuilderSelectField>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <BuilderFormField label="Start Date" name="start_date" type="date" />
                <BuilderFormField label="End Date" name="end_date" type="date" />
              </div>
            </FormSection>

            <FormSection
              title="Action Track Assets"
              description="Optional visuals for your dashboard and future participant-facing pages."
            >
              <ActionTrackAssetsSection trackId="new" />
              <p className="text-xs text-gray-500">
                Assets are optional. You can also add or replace them after saving
                from the track editor.
              </p>
            </FormSection>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
              <Button type="submit" variant="primary">
                Save Action Track
              </Button>
              <Button href="/guide/tracks" variant="secondary">
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <HelpCard title="Getting started">
            <p>
              Start with a clear title and outcome. You can add stages and
              elements after saving.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Pick a duration that matches your live call cadence.</li>
              <li>Dates are optional but help participants plan ahead.</li>
              <li>You can edit all details later from the track editor.</li>
            </ul>
          </HelpCard>
        </div>
      </div>
    </GuideBuilderPageContainer>
  );
}
