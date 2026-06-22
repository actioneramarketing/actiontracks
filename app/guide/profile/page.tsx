import { PageContainer } from "@/components/layout/PageContainer";
import { GuideProfileEditor } from "@/components/guide/GuideProfileEditor";
import { requireGuideForProfilePage } from "@/lib/auth/guide";
import { redirect } from "next/navigation";

export default async function GuideProfilePage() {
  let auth;
  try {
    auth = await requireGuideForProfilePage();
  } catch {
    return (
      <PageContainer className="max-w-4xl">
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
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
    <PageContainer className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Guide Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage the profile connected to your Action Tracks.
        </p>
      </div>
      <GuideProfileEditor guide={auth.guide} />
    </PageContainer>
  );
}
