import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function SiteAdminLoginRequiredCard() {
  return (
    <PageContainer>
      <Card padding="lg" className="max-w-xl mx-auto text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Site Admin Login Required
        </h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          Sign in with an approved internal account to access the Site Admin
          area.
        </p>
        <Button href="/login" variant="primary" className="mt-6">
          Go to Login
        </Button>
      </Card>
    </PageContainer>
  );
}

export function SiteAdminAccessDeniedCard() {
  return (
    <PageContainer>
      <Card padding="lg" className="max-w-xl mx-auto text-center">
        <h1 className="text-xl font-semibold text-gray-900">Access Denied</h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          You do not have access to this admin area.
        </p>
        <Button href="/" variant="primary" className="mt-6">
          Back to Home
        </Button>
      </Card>
    </PageContainer>
  );
}
