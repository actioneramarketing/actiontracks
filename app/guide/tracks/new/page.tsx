import { PageContainer } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createActionTrack } from "@/lib/actions/tracks";
import Link from "next/link";

function FormField({
  label,
  name,
  placeholder,
  type = "text",
  hint,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={3}
          required={required}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      ) : type === "select" ? (
        <select
          name={name}
          defaultValue="live_guided"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
        >
          <option value="live_guided">Live Guided</option>
          <option value="cohort">Cohort</option>
          <option value="self-paced">Self-Paced</option>
          <option value="hybrid">Hybrid</option>
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      )}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export default function NewTrackPage() {
  return (
    <PageContainer>
      <div className="mb-6">
        <Link
          href="/guide/tracks"
          className="text-sm text-gray-500 hover:text-teal-700"
        >
          ← Back to Manage Action Tracks
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Create New Action Track
      </h1>
      <p className="text-gray-600 mb-8">
        Set up the foundation for your guided implementation journey.
      </p>

      <Card padding="lg" className="max-w-2xl">
        <form action={createActionTrack} className="space-y-5">
          <FormField
            label="Track Title"
            name="title"
            placeholder="e.g. Podcast Launch Action Track"
            required
          />
          <FormField
            label="Short Description"
            name="short_description"
            placeholder="A brief summary of what participants will achieve..."
            type="textarea"
          />
          <FormField
            label="Primary Outcome"
            name="primary_outcome"
            placeholder="What will participants have accomplished when they finish?"
            type="textarea"
          />
          <FormField
            label="Who This Is For"
            name="who_this_is_for"
            placeholder="Describe your ideal participant..."
            type="textarea"
          />
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField
              label="Duration in Weeks"
              name="duration_weeks"
              placeholder="8"
              type="number"
            />
            <FormField
              label="Track Type"
              name="track_type"
              placeholder=""
              type="select"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Start Date" name="start_date" placeholder="" type="date" />
            <FormField label="End Date" name="end_date" placeholder="" type="date" />
          </div>

          <div className="mt-8 flex items-center gap-3 pt-6 border-t border-gray-100">
            <Button type="submit" variant="primary">
              Save Action Track
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
