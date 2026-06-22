import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ParticipantExperiencePlaceholder() {
  return (
    <PageContainer>
      <Card
        padding="lg"
        className="max-w-xl mx-auto text-center bg-gradient-to-br from-gray-50 to-white border-gray-200"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-2xl">
          ✨
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Action Track Experience Coming Soon
        </h1>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
          The welcome and completion experiences are being prepared. Your guide
          is currently building this Action Track.
        </p>
        <Button href="/library" variant="primary" className="mt-6">
          Back to Library
        </Button>
      </Card>
    </PageContainer>
  );
}
