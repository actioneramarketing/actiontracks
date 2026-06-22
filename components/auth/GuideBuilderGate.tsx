import { PageContainer } from "@/components/layout/PageContainer";
import { AccessPendingCard } from "@/components/auth/AccessPendingCard";
import { requireGuide } from "@/lib/auth/guide";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface GuideBuilderGateProps {
  children: ReactNode;
}

export async function GuideBuilderGate({ children }: GuideBuilderGateProps) {
  const auth = await requireGuide();

  if (auth.status === "unauthenticated") {
    redirect("/login");
  }

  if (auth.status === "no_profile") {
    redirect("/guide/profile");
  }

  if (auth.status === "pending") {
    return <AccessPendingCard />;
  }

  return <>{children}</>;
}

export async function GuideBuilderPageContainer({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <GuideBuilderGate>
      <PageContainer wide={wide}>{children}</PageContainer>
    </GuideBuilderGate>
  );
}
