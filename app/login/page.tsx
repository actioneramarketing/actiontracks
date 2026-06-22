import { PageContainer } from "@/components/layout/PageContainer";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <PageContainer>
      <div className="max-w-md mx-auto mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Guide Login</h1>
        <p className="mt-2 text-sm text-gray-600">
          Guide access is by invitation only.
        </p>
      </div>
      <LoginForm />
    </PageContainer>
  );
}
