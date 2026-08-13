import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface TrackEnrollmentRequiredCardProps {
  trackTitle: string;
  showLogin?: boolean;
  loginHref?: string;
  variant?: "denied" | "error";
}

export function TrackEnrollmentRequiredCard({
  trackTitle,
  showLogin = false,
  loginHref = "/participant/login",
  variant = "denied",
}: TrackEnrollmentRequiredCardProps) {
  const isError = variant === "error";

  return (
    <PageContainer>
      <Card padding="lg" className="max-w-xl mx-auto text-center">
        <h1 className="text-xl font-semibold text-gray-900">Access Required</h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          {isError
            ? "We couldn't verify your access to this Action Track. Please try again."
            : "You don't currently have access to this Action Track."}
        </p>
        <p className="mt-2 text-sm font-medium text-gray-900">{trackTitle}</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/my-tracks" variant="primary">
            My Tracks
          </Button>
          {showLogin ? (
            <Button href={loginHref} variant="secondary">
              Participant Login
            </Button>
          ) : null}
        </div>
      </Card>
    </PageContainer>
  );
}
