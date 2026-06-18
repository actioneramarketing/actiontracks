import { PageContainer } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface TrackEditStatusCardProps {
  title: string;
  body: string;
  trackId?: string;
  showLogHint?: boolean;
  buttonLabel?: string;
  buttonHref?: string;
}

export function TrackEditStatusCard({
  title,
  body,
  trackId,
  showLogHint = false,
  buttonLabel = "Back to Manage Action Tracks",
  buttonHref = "/guide/tracks",
}: TrackEditStatusCardProps) {
  return (
    <PageContainer>
      <Card padding="lg" className="max-w-xl mx-auto text-center">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{body}</p>
        {trackId ? (
          <p className="mt-3 text-xs text-gray-500 font-mono">Track ID: {trackId}</p>
        ) : null}
        {showLogHint ? (
          <p className="mt-2 text-xs text-gray-500">
            Check Vercel server logs for the detailed error.
          </p>
        ) : null}
        <Button href={buttonHref} variant="primary" className="mt-6">
          {buttonLabel}
        </Button>
      </Card>
    </PageContainer>
  );
}
