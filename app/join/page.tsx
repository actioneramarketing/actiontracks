import { PageContainer } from "@/components/layout/PageContainer";
import { RegisterParticipantForm } from "@/components/auth/RegisterParticipantForm";

export default function JoinPage() {
  return (
    <PageContainer>
      <div className="max-w-md mx-auto mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Join Action Tracks
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Create a participant account to access live Action Tracks.
        </p>
      </div>
      <RegisterParticipantForm />
    </PageContainer>
  );
}
