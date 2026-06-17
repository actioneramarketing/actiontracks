import { ParticipantElementCard } from "@/components/tracks/ParticipantElementCard";
import { PageContainer } from "@/components/layout/Nav";
import { GuideProfileCard } from "@/components/tracks/GuideProfileCard";
import { SidebarCard } from "@/components/tracks/SidebarCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getElementsForStage } from "@/lib/actions/stage-elements";
import { getStageBySlug, getStagesForTrack } from "@/lib/actions/stages";
import { getActionTrackBySlug } from "@/lib/actions/tracks";

interface PageProps {
  params: Promise<{ trackSlug: string; stageSlug: string }>;
}

export default async function ParticipantStagePage({ params }: PageProps) {
  const { trackSlug, stageSlug } = await params;
  const { track, error: trackError } = await getActionTrackBySlug(trackSlug);

  if (!track) {
    return (
      <PageContainer>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Track not found</h1>
          <p className="mt-2 text-gray-600">
            {trackError ?? "We could not find an Action Track with that link."}
          </p>
        </div>
      </PageContainer>
    );
  }

  const { stage, error: stageError } = await getStageBySlug(track.id, stageSlug);

  if (!stage) {
    return (
      <PageContainer>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Stage not found</h1>
          <p className="mt-2 text-gray-600">
            {stageError ?? "We could not find this stage for the track."}
          </p>
        </div>
      </PageContainer>
    );
  }

  const [{ stages }, { elements }] = await Promise.all([
    getStagesForTrack(track.id),
    getElementsForStage(stage.id),
  ]);

  const enabledElements = elements.filter((el) => el.is_enabled);

  return (
    <PageContainer wide>
      <div className="mb-8">
        <Badge variant="purple" className="mb-3">
          Stage {stage.stage_number} of {stages.length}
        </Badge>
        <h1 className="text-3xl font-bold text-gray-900">{stage.title}</h1>
        <p className="text-gray-600 mt-1">{stage.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {(stage.what_youll_accomplish || stage.stage_goal) && (
            <Card className="bg-teal-50 border-teal-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                What You&apos;ll Accomplish
              </h3>
              <p className="text-sm text-gray-700">
                {stage.what_youll_accomplish ?? stage.stage_goal}
              </p>
            </Card>
          )}

          <Card>
            <h3 className="font-semibold text-gray-900 mb-2">
              Welcome to Stage {stage.stage_number}
            </h3>
            <p className="text-sm text-gray-600">
              {stage.stage_goal ??
                "Work through each element below at your own pace, and reach out to your guide or AI mentor if you need support."}
            </p>
          </Card>

          <div className="space-y-4">
            {enabledElements.length === 0 ? (
              <Card padding="sm" className="text-sm text-gray-500">
                No stage elements configured yet.
              </Card>
            ) : (
              enabledElements.map((el) => (
                <ParticipantElementCard key={el.id} element={el} />
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          {(stage.next_action_title || stage.next_action_description) && (
            <SidebarCard title="Next Action" icon="➡️">
              {stage.next_action_title && (
                <p className="font-medium text-gray-900">{stage.next_action_title}</p>
              )}
              {stage.next_action_description && (
                <p className="mt-1">{stage.next_action_description}</p>
              )}
            </SidebarCard>
          )}

          <GuideProfileCard compact />
        </div>
      </div>
    </PageContainer>
  );
}
