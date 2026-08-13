import { JoinTrackButton } from "@/components/join/JoinTrackButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getTrackInitials } from "@/lib/utils/action-track-assets";
import { withReturnToQuery } from "@/lib/utils/safe-return-path";

export type TrackJoinGuideView = {
  fullName: string;
  profileHeadline: string;
  imageUrl: string;
};

export type TrackJoinViewModel = {
  title: string;
  slug: string;
  shortDescription: string;
  primaryOutcome: string;
  startDateLabel: string | null;
  trackImageUrl: string;
  trackIconUrl: string;
  guide: TrackJoinGuideView | null;
  joinPath: string;
};

type TrackJoinViewProps = {
  track: TrackJoinViewModel;
  mode:
    | { kind: "anonymous" }
    | { kind: "join" }
    | { kind: "continue"; href: string }
    | { kind: "waiting"; releaseLabel: string | null }
    | { kind: "no_stages" }
    | { kind: "revoked" };
};

function formatStartDate(value: string): string | null {
  if (!value.trim()) {
    return null;
  }
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return value;
    }
    return new Date(parsed).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return new Date(`${match[1]}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTrackStartDate(value: string): string | null {
  return formatStartDate(value);
}

export function TrackJoinView({ track, mode }: TrackJoinViewProps) {
  const initials = getTrackInitials(track.title);

  return (
    <Card padding="none" className="mx-auto max-w-2xl overflow-hidden shadow-md">
      <div className="relative aspect-[16/9] bg-gradient-to-br from-teal-50 via-gray-50 to-violet-50 border-b border-gray-100">
        {track.trackImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.trackImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-4xl mb-2 opacity-80" aria-hidden>
              🎯
            </span>
            <p className="text-sm font-medium text-gray-500">
              Track image coming soon
            </p>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-teal-50 text-base font-bold text-teal-700">
            {track.trackIconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={track.trackIconUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Join {track.title}
            </h1>
            {track.shortDescription ? (
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                {track.shortDescription}
              </p>
            ) : null}
          </div>
        </div>

        {track.primaryOutcome ? (
          <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
              Primary outcome
            </p>
            <p className="mt-1 text-sm text-teal-950 leading-relaxed">
              {track.primaryOutcome}
            </p>
          </div>
        ) : null}

        {track.guide ? (
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600">
              {track.guide.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.guide.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                getTrackInitials(track.guide.fullName || "Guide")
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                {track.guide.fullName || "Guide"}
              </p>
              {track.guide.profileHeadline ? (
                <p className="text-xs text-gray-500 truncate">
                  {track.guide.profileHeadline}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {track.startDateLabel ? (
          <p className="mt-4 text-sm text-gray-500">
            Starts {track.startDateLabel}
          </p>
        ) : null}

        <div className="mt-8 pt-6 border-t border-gray-100">
          {mode.kind === "anonymous" ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                href={withReturnToQuery("/participant/register", track.joinPath)}
                variant="primary"
                size="lg"
                className="w-full sm:flex-1"
              >
                Create Participant Account
              </Button>
              <Button
                href={withReturnToQuery("/participant/login", track.joinPath)}
                variant="secondary"
                size="lg"
                className="w-full sm:flex-1"
              >
                Participant Login
              </Button>
            </div>
          ) : null}

          {mode.kind === "join" ? (
            <JoinTrackButton trackSlug={track.slug} />
          ) : null}

          {mode.kind === "continue" ? (
            <Button href={mode.href} variant="primary" size="lg" className="w-full">
              Continue Action Track
            </Button>
          ) : null}

          {mode.kind === "waiting" ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                You&apos;re enrolled. The first stage has not opened yet.
              </p>
              {mode.releaseLabel ? (
                <p className="mt-2 text-sm text-teal-800">
                  Opens {mode.releaseLabel}
                </p>
              ) : null}
              <Button href="/my-tracks" variant="secondary" className="mt-4">
                Back to My Tracks
              </Button>
            </div>
          ) : null}

          {mode.kind === "no_stages" ? (
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              This Action Track does not have stages available yet.
            </p>
          ) : null}

          {mode.kind === "revoked" ? (
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              Your access to this Action Track is not currently active.
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
