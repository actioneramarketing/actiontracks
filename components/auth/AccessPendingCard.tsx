import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function AccessPendingCard() {
  return (
    <PageContainer>
      <Card padding="lg" className="max-w-xl mx-auto text-center">
        <h1 className="text-xl font-semibold text-gray-900">Access Pending</h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          Your guide account is awaiting approval. You&apos;ll be able to access
          the Action Track builder once your account has been approved.
        </p>
        <Button href="/" variant="secondary" className="mt-6">
          Back to Home
        </Button>
      </Card>
    </PageContainer>
  );
}
