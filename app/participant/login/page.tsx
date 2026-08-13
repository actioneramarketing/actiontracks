import { PageContainer } from "@/components/layout/PageContainer";
import { ParticipantLoginForm } from "@/components/auth/ParticipantLoginForm";
import { getSafeReturnPath } from "@/lib/utils/safe-return-path";

interface PageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function ParticipantLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawReturnTo = Array.isArray(params.returnTo)
    ? params.returnTo[0]
    : params.returnTo;
  const returnTo = getSafeReturnPath(rawReturnTo);

  return (
    <PageContainer>
      <div className="max-w-md mx-auto mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Participant Login</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to access your Action Tracks.
        </p>
      </div>
      <ParticipantLoginForm returnTo={returnTo} />
    </PageContainer>
  );
}
