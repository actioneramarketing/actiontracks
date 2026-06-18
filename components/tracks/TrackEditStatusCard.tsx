import { PageContainer } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface TrackEditStatusCardProps {
  title: string;
  body: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export function TrackEditStatusCard({
  title,
  body,
  buttonLabel = "Back to Manage Action Tracks",
  buttonHref = "/guide/tracks",
}: TrackEditStatusCardProps) {
  return (
    <PageContainer>
      <Card padding="lg" className="max-w-xl mx-auto text-center">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{body}</p>
        <Button href={buttonHref} variant="primary" className="mt-6">
          {buttonLabel}
        </Button>
      </Card>
    </PageContainer>
  );
}
