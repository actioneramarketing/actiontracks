import { PageContainer } from "@/components/layout/Nav";
import { StageCard } from "@/components/tracks/StageCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { demoStages, demoTrack } from "@/lib/demo-data";
import Link from "next/link";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function StagesListPage({ params }: PageProps) {
  const { trackId } = await params;

  return (
    <PageContainer>
      <div className="mb-6">
        <Link
          href={`/guide/tracks/${trackId}/edit`}
          className="text-sm text-gray-500 hover:text-teal-700"
        >
          ← Back to Edit Track
        </Link>
      </div>

      <SectionHeader
        title="Manage Stages"
        description={`${demoTrack.title} — ${demoStages.length} stages`}
        action={
          <Button variant="accent" disabled className="opacity-60 cursor-not-allowed">
            Add Stage
          </Button>
        }
        className="mb-8"
      />

      <div className="space-y-4">
        {demoStages.map((stage) => (
          <StageCard key={stage.id} stage={stage} trackId={trackId} />
        ))}
      </div>
    </PageContainer>
  );
}
