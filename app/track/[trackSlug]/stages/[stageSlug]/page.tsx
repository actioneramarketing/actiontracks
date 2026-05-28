import { PageContainer } from "@/components/layout/Nav";
import { GuideProfileCard } from "@/components/tracks/GuideProfileCard";
import { SidebarCard } from "@/components/tracks/SidebarCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getStageBySlug, participantStageElements } from "@/lib/demo-data";

interface PageProps {
  params: Promise<{ trackSlug: string; stageSlug: string }>;
}

export default async function ParticipantStagePage({ params }: PageProps) {
  const { stageSlug } = await params;
  const stage = getStageBySlug(stageSlug) ?? getStageBySlug("define-your-topic")!;

  const statusColors = {
    scheduled: "bg-sky-50 text-sky-700 ring-sky-200",
    active: "bg-teal-50 text-teal-700 ring-teal-200",
    available: "bg-gray-50 text-gray-600 ring-gray-200",
  };

  return (
    <PageContainer wide>
      <div className="mb-8">
        <Badge variant="purple" className="mb-3">
          Stage {stage.number} of 6
        </Badge>
        <h1 className="text-3xl font-bold text-gray-900">{stage.title}</h1>
        <p className="text-gray-600 mt-1">{stage.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-teal-50 border-teal-100">
            <h3 className="font-semibold text-gray-900 mb-2">
              What You&apos;ll Accomplish
            </h3>
            <p className="text-sm text-gray-700">{stage.goal}</p>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-2">
              Welcome to Stage {stage.number}
            </h3>
            <p className="text-sm text-gray-600">
              This stage focuses on {stage.shortGoal.toLowerCase()}. Work through
              each element below at your own pace, and reach out to your guide or
              AI mentor if you need support.
            </p>
          </Card>

          <div className="space-y-4">
            {participantStageElements.map((el) => (
              <Card key={el.name} padding="sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{el.name}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">{el.description}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 capitalize ${statusColors[el.status]}`}
                  >
                    {el.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SidebarCard title="Your Commitment" icon="🎯">
            <p className="italic">
              &ldquo;I will define my podcast niche and complete the topic worksheet
              by Friday.&rdquo;
            </p>
          </SidebarCard>

          <SidebarCard title="Next Action" icon="➡️">
            <p className="font-medium text-gray-900">{stage.nextActionTitle}</p>
            <p className="mt-1">{stage.nextActionDescription}</p>
          </SidebarCard>

          <SidebarCard title="Upcoming Events" icon="📅">
            <ul className="space-y-2">
              <li>
                <p className="font-medium text-gray-900">Live Kickoff Call</p>
                <p className="text-xs text-gray-500">Jun 15, 2026 · 2:00 PM EST</p>
              </li>
              <li>
                <p className="font-medium text-gray-900">Office Hours</p>
                <p className="text-xs text-gray-500">Jun 18, 2026 · 11:00 AM EST</p>
              </li>
            </ul>
          </SidebarCard>

          <SidebarCard title="Task List Summary" icon="✅">
            <p>
              <span className="font-semibold text-teal-700">1 of 4</span> tasks
              completed
            </p>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div className="h-2 w-1/4 rounded-full bg-teal-500" />
            </div>
          </SidebarCard>

          <SidebarCard title="Track Group" icon="👥">
            <p>24 participants in this cohort</p>
          </SidebarCard>

          <SidebarCard title="Accountability Partner" icon="🤝">
            <p>
              <span className="font-medium text-gray-900">Alex Morgan</span>
              <br />
              Matched for Stage 1
            </p>
          </SidebarCard>

          <SidebarCard title="Tools" icon="🔧">
            <ul className="space-y-1">
              <li>Topic Worksheet Template</li>
              <li>Audience Persona Guide</li>
              <li>Niche Validation Checklist</li>
            </ul>
          </SidebarCard>

          <GuideProfileCard compact />
        </div>
      </div>
    </PageContainer>
  );
}
