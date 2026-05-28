import { PageContainer } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

function FormField({
  label,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  placeholder: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          readOnly
        />
      ) : type === "select" ? (
        <select
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
          defaultValue=""
          disabled
        >
          <option value="">Select track type</option>
          <option value="cohort">Cohort</option>
          <option value="self-paced">Self-Paced</option>
          <option value="hybrid">Hybrid</option>
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          readOnly
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
        <div className="space-y-5">
          <FormField label="Track Title" placeholder="e.g. Podcast Launch Action Track" />
          <FormField
            label="Short Description"
            placeholder="A brief summary of what participants will achieve..."
            type="textarea"
          />
          <FormField
            label="Primary Outcome"
            placeholder="What will participants have accomplished when they finish?"
            type="textarea"
          />
          <FormField
            label="Who This Is For"
            placeholder="Describe your ideal participant..."
            type="textarea"
          />
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Duration in Weeks" placeholder="8" type="number" />
            <FormField label="Track Type" placeholder="" type="select" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Start Date" placeholder="" type="date" />
            <FormField label="End Date" placeholder="" type="date" />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 pt-6 border-t border-gray-100">
          <Button disabled className="opacity-60 cursor-not-allowed">
            Save Action Track
          </Button>
          <span className="text-xs text-gray-400">
            Saving will be enabled in a future release
          </span>
        </div>
      </Card>
    </PageContainer>
  );
}
