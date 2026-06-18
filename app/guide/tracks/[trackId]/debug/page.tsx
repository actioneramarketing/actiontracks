import { PageContainer } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getActionTrackDebugInfo } from "@/lib/actions/tracks";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function TrackDebugPage({ params }: PageProps) {
  const { trackId } = await params;
  const info = await getActionTrackDebugInfo(trackId);

  return (
    <PageContainer>
      <Card padding="lg" className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Action Track Debug
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Temporary diagnostic view for edit-page loading issues.
          </p>
        </div>

        <dl className="space-y-3 text-sm">
          <DebugRow label="Track ID" value={info.trackId} />
          <DebugRow
            label="Track found"
            value={info.found ? "Yes" : "No"}
          />
        </dl>

        {info.configError ? (
          <DebugSection title="Configuration error">
            <p className="text-sm text-red-700">{info.configError}</p>
          </DebugSection>
        ) : null}

        {info.supabaseError ? (
          <DebugSection title="Supabase error">
            <dl className="space-y-2 text-sm">
              <DebugRow label="Message" value={info.supabaseError.message} />
              <DebugRow label="Code" value={info.supabaseError.code ?? "(none)"} />
              <DebugRow
                label="Details"
                value={info.supabaseError.details ?? "(none)"}
              />
              <DebugRow label="Hint" value={info.supabaseError.hint ?? "(none)"} />
            </dl>
          </DebugSection>
        ) : null}

        {info.fields ? (
          <DebugSection title="Track fields">
            <dl className="space-y-2 text-sm">
              {Object.entries(info.fields).map(([key, value]) => (
                <DebugRow key={key} label={key} value={value} mono />
              ))}
            </dl>
          </DebugSection>
        ) : null}

        {info.nullFields ? (
          <DebugSection title="Null fields in database row">
            <dl className="space-y-2 text-sm">
              {Object.entries(info.nullFields).map(([key, isNull]) => (
                <DebugRow
                  key={key}
                  label={key}
                  value={isNull ? "null" : "has value"}
                />
              ))}
            </dl>
          </DebugSection>
        ) : null}

        <DebugSection title="settings_json">
          <dl className="space-y-2 text-sm">
            <DebugRow
              label="Is plain object"
              value={info.settingsJsonIsObject ? "Yes" : "No"}
            />
            <DebugRow label="Raw typeof" value={info.settingsJsonType} />
          </dl>
        </DebugSection>

        <Button href={`/guide/tracks/${trackId}/edit`} variant="secondary">
          Open Edit Page
        </Button>
        <Button href="/guide/tracks" variant="primary" className="ml-2">
          Back to Tracks
        </Button>
      </Card>
    </PageContainer>
  );
}

function DebugSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">{title}</h2>
      {children}
    </section>
  );
}

function DebugRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4">
      <dt className="sm:w-40 shrink-0 font-medium text-gray-600">{label}</dt>
      <dd className={`text-gray-900 break-all ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
