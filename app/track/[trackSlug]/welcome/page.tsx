import { PageContainer } from "@/components/layout/Nav";
import { GuideProfileCard } from "@/components/tracks/GuideProfileCard";
import { Roadmap } from "@/components/tracks/Roadmap";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getStagesForTrack } from "@/lib/actions/stages";
import { getActionTrackBySlug } from "@/lib/actions/tracks";
import { welcomeChecklist } from "@/lib/demo-data";

interface PageProps {
  params: Promise<{ trackSlug: string }>;
}

export default async function WelcomePage({ params }: PageProps) {
  const { trackSlug } = await params;
  const { track, error } = await getActionTrackBySlug(trackSlug);

  if (!track) {
    return (
      <PageContainer>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Track not found</h1>
          <p className="mt-2 text-gray-600">
            {error ?? "We could not find an Action Track with that link."}
          </p>
        </div>
      </PageContainer>
    );
  }

  const { stages } = await getStagesForTrack(track.id);
  const firstStage = stages[0];
  const roadmapStages = stages.map((stage) => ({
    id: stage.id,
    slug: stage.slug,
    number: stage.stage_number,
    title: stage.title,
    subtitle: stage.subtitle ?? "",
    goal: stage.stage_goal ?? "",
    shortGoal: stage.subtitle ?? stage.stage_goal ?? "",
    elements: [],
    nextActionTitle: stage.next_action_title ?? "",
    nextActionDescription: stage.next_action_description ?? "",
  }));

  const welcomeHeadline =
    track.welcome_headline ?? "Welcome to Your Action Track";

  return (
    <PageContainer wide>
      <div className="text-center mb-10">
        <Badge variant="purple" className="mb-4">
          Action Track
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {welcomeHeadline}
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          You&apos;re about to begin a guided journey. Take a moment to review
          what&apos;s ahead.
        </p>
      </div>

      <Card padding="lg" className="mb-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white border-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-teal-100 text-sm font-medium">Your Track</p>
            <h2 className="text-2xl font-bold mt-1">{track.title}</h2>
            <p className="text-teal-100 mt-2 max-w-xl">
              {track.short_description}
            </p>
          </div>
          {firstStage && (
            <Button
              href={`/track/${trackSlug}/stages/${firstStage.slug}`}
              variant="secondary"
              size="lg"
              className="shrink-0 bg-white text-teal-700 hover:bg-teal-50"
            >
              Begin Stage 1
            </Button>
          )}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {track.start_date && (
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⏱️</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Track Schedule</h3>
                  <p className="text-sm text-gray-500">
                    Track starts {track.start_date}
                    {track.end_date ? ` · ends ${track.end_date}` : ""}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {roadmapStages.length > 0 && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Your Journey Roadmap</h3>
              <Roadmap stages={roadmapStages} currentStage={1} />
            </Card>
          )}

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Before We Begin</h3>
            <ul className="space-y-3">
              {welcomeChecklist.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      item.done
                        ? "bg-teal-100 text-teal-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {item.done ? "✓" : "○"}
                  </span>
                  <span
                    className={`text-sm ${
                      item.done ? "text-gray-500 line-through" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <GuideProfileCard />

          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">
              What You&apos;ll Achieve
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {track.primary_outcome}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Duration
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {track.duration_weeks ?? "—"} weeks · {stages.length} stages
              </p>
            </div>
          </Card>

          {track.philosophy && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Track Philosophy</h3>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                &ldquo;{track.philosophy}&rdquo;
              </p>
            </Card>
          )}

          <Card className="bg-gradient-to-br from-violet-50 to-white border-violet-100">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🤖</span>
              <h3 className="font-semibold text-gray-900">Ask Your AI Mentor</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Have questions about the track? Your AI mentor is here to help you
              get started.
            </p>
            <Button variant="accent" size="sm" disabled className="opacity-60 cursor-not-allowed">
              Chat with AI Mentor
            </Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
