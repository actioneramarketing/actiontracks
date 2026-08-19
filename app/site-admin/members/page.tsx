import { PageContainer } from "@/components/layout/PageContainer";
import { BuilderPageHeader } from "@/components/builder/BuilderPageHeader";
import { EmptyState } from "@/components/builder/EmptyState";
import {
  SiteAdminAccessDeniedCard,
  SiteAdminLoginRequiredCard,
} from "@/components/auth/SiteAdminAccessCards";
import { SiteAdminMembersList } from "@/components/site-admin/SiteAdminMembersList";
import { SiteAdminSubnav } from "@/components/site-admin/SiteAdminSubnav";
import { getActionTrackMembersForSiteAdmin } from "@/lib/actions/site-admin-members";
import { getSiteAdminAccess } from "@/lib/auth/site-admin";
import { Button } from "@/components/ui/Button";

export default async function SiteAdminMembersPage() {
  const access = await getSiteAdminAccess();

  if (access.status === "unauthenticated") {
    return <SiteAdminLoginRequiredCard />;
  }

  if (access.status === "denied") {
    return <SiteAdminAccessDeniedCard />;
  }

  const { members, error } = await getActionTrackMembersForSiteAdmin();

  return (
    <PageContainer className="max-w-6xl">
      <BuilderPageHeader
        title="Action Track Members"
        subtitle="View participant enrollments and manage access for each Action Track."
        actions={
          <Button href="/site-admin/action-tracks" variant="secondary" size="sm">
            Action Tracks
          </Button>
        }
      />
      <SiteAdminSubnav current="members" />

      {error ? (
        <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          Some member details could not be loaded. Please try again.
        </p>
      ) : null}

      {members.length === 0 && !error ? (
        <EmptyState
          icon="👥"
          title="No enrollments yet"
          description="When participants join Action Tracks, their enrollments will appear here."
        />
      ) : members.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Unable to load members"
          description="Please try again in a moment."
        />
      ) : (
        <SiteAdminMembersList members={members} />
      )}
    </PageContainer>
  );
}
