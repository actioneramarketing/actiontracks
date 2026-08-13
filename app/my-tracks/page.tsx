import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { requireParticipant } from "@/lib/auth/participant";
import { redirect } from "next/navigation";

export default async function MyTracksPage() {
  let auth;
  try {
    auth = await requireParticipant();
  } catch {
    return (
      <PageContainer className="max-w-4xl">
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Unable to load your tracks
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            There was a problem loading your participant profile. Please try
            again.
          </p>
        </div>
      </PageContainer>
    );
  }

  if (auth.status === "unauthenticated") {
    redirect("/participant/login");
  }

  const displayName = auth.participant.full_name.trim();

  return (
    <PageContainer className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Your Action Tracks
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          {displayName
            ? `Welcome back, ${displayName}.`
            : "Welcome back."}
        </p>
      </div>

      <Card
        padding="lg"
        className="text-center bg-gradient-to-br from-white to-gray-50 border-gray-200"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-3xl">
          🎯
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Enrolled Action Tracks will appear here soon.
        </h2>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
          You&apos;re signed in as a participant. Access and enrollment for live
          Action Tracks is coming next. Your saved preview activity on stage
          pages is unchanged.
        </p>
        <p className="mt-4 text-xs text-gray-500">
          Track enrollment, stage release dates, and progress tracking have not
          been enabled yet.
        </p>
      </Card>
    </PageContainer>
  );
}
