import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function TrackAccessDeniedCard() {
  return (
    <PageContainer>
      <Card padding="lg" className="max-w-xl mx-auto text-center">
        <h1 className="text-xl font-semibold text-gray-900">Access Denied</h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          You do not have access to edit this Action Track.
        </p>
        <Button href="/guide/tracks" variant="primary" className="mt-6">
          Back to Manage Action Tracks
        </Button>
      </Card>
    </PageContainer>
  );
}
