import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/builder/EmptyState";
import { EnrolledTrackCard } from "@/components/tracks/EnrolledTrackCard";
import { getEnrolledTracksForParticipant } from "@/lib/actions/enrollments";
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
  const { tracks, error } = await getEnrolledTracksForParticipant(auth.user.id);

  return (
    <PageContainer className="max-w-6xl">
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

      {error ? (
        <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          We couldn't load all of your enrollments. Please try again.
        </p>
      ) : null}

      {tracks.length === 0 && !error ? (
        <EmptyState
          icon="🎯"
          title="You don't have any Action Tracks yet."
          description="When you're enrolled in an Action Track, it will appear here."
        />
      ) : tracks.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="Unable to load enrollments"
          description="Please try again in a moment."
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {tracks.map((item) => (
            <EnrolledTrackCard key={item.enrollment.id} item={item} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
