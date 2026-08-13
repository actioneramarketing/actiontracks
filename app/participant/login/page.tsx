import { PageContainer } from "@/components/layout/PageContainer";
import { ParticipantLoginForm } from "@/components/auth/ParticipantLoginForm";

export default function ParticipantLoginPage() {
  return (
    <PageContainer>
      <div className="max-w-md mx-auto mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Participant Login</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to access your Action Tracks.
        </p>
      </div>
      <ParticipantLoginForm />
    </PageContainer>
  );
}
