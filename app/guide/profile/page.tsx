import { PageContainer } from "@/components/layout/PageContainer";
import { GuideProfileForm } from "@/components/guide/GuideProfileForm";
import { requireGuideForProfilePage } from "@/lib/auth/guide";
import { redirect } from "next/navigation";

export default async function GuideProfilePage() {
  let auth;
  try {
    auth = await requireGuideForProfilePage();
  } catch {
    return (
      <PageContainer>
        <div className="max-w-xl mx-auto rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Unable to load profile
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            There was a problem loading your guide profile. Please try again.
          </p>
        </div>
      </PageContainer>
    );
  }

  if (auth.status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Guide Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your public guide profile and account details.
        </p>
      </div>
      <GuideProfileForm guide={auth.guide} />
    </PageContainer>
  );
}
